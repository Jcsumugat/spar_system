<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\User;
use App\Models\LabReport;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Helpers\NotificationHelper;
use Inertia\Inertia;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Inspection::with(['business', 'inspector', 'permit']);

        // Filters
        if ($request->has('result') && $request->result !== 'all') {
            $query->where('result', $request->result);
        }

        if ($request->has('inspection_type') && $request->inspection_type !== 'all') {
            $query->where('inspection_type', $request->inspection_type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('inspection_number', 'like', "%{$search}%")
                    ->orWhereHas('business', function ($q) use ($search) {
                        $q->where('business_name', 'like', "%{$search}%");
                    });
            });
        }

        $inspections = $query->latest('inspection_date')->paginate(15);

        return Inertia::render('Inspections/Index', [
            'inspections' => $inspections,
            'filters' => $request->only(['result', 'inspection_type', 'search']),
        ]);
    }

    public function create()
    {
        $businesses = Business::active()->get(['id', 'business_name']);
        $inspectors = User::inspectors()->active()->get(['id', 'name']);
        $permits = SanitaryPermit::with('business')->get();

        return Inertia::render('Inspections/Create', [
            'businesses' => $businesses,
            'inspectors' => $inspectors,
            'permits' => $permits,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_id' => 'nullable|exists:sanitary_permits,id',
            'inspection_date' => 'required|date',
            'inspection_time' => 'nullable|date_format:H:i',
            'inspector_id' => 'required|exists:users,id',
            'inspection_type' => 'required|in:Initial,Renewal',
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
        ]);

        $validated['inspection_number'] = Inspection::generateInspectionNumber();
        $validated['result'] = 'Pending';

        $inspection = Inspection::create($validated);

        ActivityLog::logActivity(
            'created',
            $inspection,
            'Created inspection ' . $inspection->inspection_number
        );

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection created successfully.');
    }

    public function show(Inspection $inspection)
    {
        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->with('submittedBy')
            ->first();

        if ($labReport) {
            $labReport->fecalysis_photo_url = $labReport->fecalysis_photo
                ? url('storage/' . $labReport->fecalysis_photo)
                : null;
            $labReport->xray_sputum_photo_url = $labReport->xray_sputum_photo
                ? url('storage/' . $labReport->xray_sputum_photo)
                : null;
            $labReport->receipt_photo_url = $labReport->receipt_photo
                ? url('storage/' . $labReport->receipt_photo)
                : null;
            $labReport->dti_photo_url = $labReport->dti_photo
                ? url('storage/' . $labReport->dti_photo)
                : null;
        }

        $inspection->load([
            'business',
            'inspector',
            'permit',
        ]);
        $inspection->lab_report = $labReport;

        return Inertia::render('Inspections/Show', [
            'inspection' => $inspection,
        ]);
    }

    public function edit(Inspection $inspection)
    {
        $businesses = Business::active()->get(['id', 'business_name']);
        $inspectors = User::inspectors()->active()->get(['id', 'name']);
        $permits = SanitaryPermit::with('business')->get();

        return Inertia::render('Inspections/Edit', [
            'inspection' => $inspection,
            'businesses' => $businesses,
            'inspectors' => $inspectors,
            'permits' => $permits,
        ]);
    }

    public function update(Request $request, Inspection $inspection)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_id' => 'nullable|exists:sanitary_permits,id',
            'inspection_date' => 'required|date',
            'inspection_time' => 'nullable|date_format:H:i',
            'inspector_id' => 'required|exists:users,id',
            'inspection_type' => 'required|in:Initial,Renewal',
            'result' => 'required|in:Approved,Denied,Pending',
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'follow_up_date' => 'nullable|date|after:inspection_date',
        ]);

        $oldData = $inspection->toArray();
        $inspection->update($validated);

        ActivityLog::logActivity(
            'updated',
            $inspection,
            'Updated inspection ' . $inspection->inspection_number,
            ['old' => $oldData, 'new' => $validated]
        );

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection updated successfully.');
    }

    public function destroy(Inspection $inspection)
    {
        // Only allow deletion if inspection is pending
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'Cannot delete a completed inspection.');
        }

        $inspection->delete();

        ActivityLog::logActivity(
            'deleted',
            $inspection,
            'Deleted inspection ' . $inspection->inspection_number
        );

        return redirect()->route('inspections.index')
            ->with('success', 'Inspection deleted successfully.');
    }

    public function saveProgress(Request $request, Inspection $inspection)
    {
        // Only allow saving progress if inspection is still pending
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'Cannot update a completed inspection.');
        }

        $validated = $request->validate([
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'document_remarks' => 'nullable|array',
            'document_remarks.fecalysis' => 'nullable|string|max:500',
            'document_remarks.xray_sputum' => 'nullable|string|max:500',
            'document_remarks.receipt' => 'nullable|string|max:500',
            'document_remarks.dti' => 'nullable|string|max:500',
        ]);

        $inspection->update([
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
            'fecalysis_inspector_remarks' => $validated['document_remarks']['fecalysis'] ?? null,
            'xray_sputum_inspector_remarks' => $validated['document_remarks']['xray_sputum'] ?? null,
            'receipt_inspector_remarks' => $validated['document_remarks']['receipt'] ?? null,
            'dti_inspector_remarks' => $validated['document_remarks']['dti'] ?? null,
        ]);

        ActivityLog::logActivity(
            'updated',
            $inspection,
            'Saved progress for inspection ' . $inspection->inspection_number
        );

        // Notify lab inspector about progress save
        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->first();

        if ($labReport && $labReport->submitted_by) {
            NotificationHelper::inspectionProgressSaved(
                $labReport->submitted_by,
                $inspection->business,
                $inspection
            );
        }

        return back()->with('success', 'Progress saved successfully.');
    }

    public function pass(Request $request, Inspection $inspection)
    {
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'This inspection has already been completed.');
        }

        $validated = $request->validate([
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'pass_with_conditions' => 'boolean',
            'document_statuses' => 'required|array',
            'document_statuses.*' => 'required|in:approved,rejected',
            'document_remarks' => 'nullable|array',
            'document_remarks.fecalysis' => 'nullable|string|max:500',
            'document_remarks.xray_sputum' => 'nullable|string|max:500',
            'document_remarks.receipt' => 'nullable|string|max:500',
            'document_remarks.dti' => 'nullable|string|max:500',
        ]);

        $allApproved = collect($validated['document_statuses'])->every(function ($status) {
            return $status === 'approved';
        });

        if (!$allApproved) {
            return back()->with('error', 'All documents must be approved to pass the inspection.');
        }

        $inspection->update([
            'result' => 'Approved',
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
            'fecalysis_inspector_remarks' => $validated['document_remarks']['fecalysis'] ?? null,
            'xray_sputum_inspector_remarks' => $validated['document_remarks']['xray_sputum'] ?? null,
            'receipt_inspector_remarks' => $validated['document_remarks']['receipt'] ?? null,
            'dti_inspector_remarks' => $validated['document_remarks']['dti'] ?? null,
        ]);

        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->first();

        if ($labReport) {
            // Build inspector remarks including document-specific remarks
            $inspectorRemarks = $validated['recommendations'] ?? '';

            if (!empty($validated['document_remarks'])) {
                $remarksArray = [];
                foreach ($validated['document_remarks'] as $docType => $remark) {
                    if (!empty($remark)) {
                        $docLabels = [
                            'fecalysis' => 'Fecalysis',
                            'xray_sputum' => 'X-Ray/Sputum',
                            'receipt' => 'Receipt',
                            'dti' => 'DTI'
                        ];
                        $remarksArray[] = "{$docLabels[$docType]}: {$remark}";
                    }
                }
                if (!empty($remarksArray)) {
                    $inspectorRemarks .= "\n\nDocument-specific notes:\n" . implode("\n", $remarksArray);
                }
            }

            $labReport->update([
                'status' => 'approved',
                'overall_result' => 'pass',
                'fecalysis_result' => $validated['document_statuses']['fecalysis'] === 'approved' ? 'pass' : 'fail',
                'xray_sputum_result' => $validated['document_statuses']['xray_sputum'] === 'approved' ? 'pass' : 'fail',
                'receipt_result' => $validated['document_statuses']['receipt'] === 'approved' ? 'pass' : 'fail',
                'dti_result' => $validated['document_statuses']['dti'] === 'approved' ? 'pass' : 'fail',
                'inspector_remarks' => $inspectorRemarks,
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
            ]);

            // Notify lab inspector about lab report review
            if ($labReport->submitted_by) {
                NotificationHelper::labReportReviewed(
                    $labReport->submitted_by,
                    $inspection->business,
                    $labReport,
                    'approved'
                );
            }
        }

        $permitType = $inspection->inspection_type === 'Initial' ? 'New' : 'Renewal';

        // FIXED: Set issued_by to the staff who submitted the lab report, approved_by to current inspector
        $issuedById = $labReport && $labReport->submitted_by ? $labReport->submitted_by : auth()->id();

        $permit = SanitaryPermit::updateOrCreate(
            ['business_id' => $inspection->business_id],
            [
                'permit_number' => SanitaryPermit::generatePermitNumber(),
                'permit_type' => $permitType,
                'issue_date' => now(),
                'expiry_date' => now()->addYear(),
                'issued_by' => $issuedById, // Staff member who submitted the lab report
                'approved_by' => auth()->id(), // Inspector who approved the inspection
                'status' => 'Active',
                'remarks' => $validated['recommendations'] ?? null,
            ]
        );

        $inspection->update(['permit_id' => $permit->id]);

        ActivityLog::logActivity(
            'approved',
            $inspection,
            'Approved inspection ' . $inspection->inspection_number . ' and issued permit ' . $permit->permit_number
        );

        // Notify lab inspector about inspection approval
        if ($labReport && $labReport->submitted_by) {
            NotificationHelper::inspectionApproved(
                $labReport->submitted_by,
                $inspection->business,
                $inspection,
                $permit
            );
        }

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection approved successfully! Sanitary permit has been issued.');
    }

    public function fail(Request $request, Inspection $inspection)
    {
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'This inspection has already been completed.');
        }

        $validated = $request->validate([
            'findings' => 'required|string',
            'recommendations' => 'nullable|string',
            'document_statuses' => 'required|array',
            'document_statuses.*' => 'required|in:approved,rejected',
            'document_remarks' => 'nullable|array',
            'document_remarks.fecalysis' => 'nullable|string|max:500',
            'document_remarks.xray_sputum' => 'nullable|string|max:500',
            'document_remarks.receipt' => 'nullable|string|max:500',
            'document_remarks.dti' => 'nullable|string|max:500',
        ]);

        $inspection->update([
            'result' => 'Denied',
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
            'fecalysis_inspector_remarks' => $validated['document_remarks']['fecalysis'] ?? null,
            'xray_sputum_inspector_remarks' => $validated['document_remarks']['xray_sputum'] ?? null,
            'receipt_inspector_remarks' => $validated['document_remarks']['receipt'] ?? null,
            'dti_inspector_remarks' => $validated['document_remarks']['dti'] ?? null,
        ]);

        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->first();

        if ($labReport) {
            // Build inspector remarks including document-specific remarks
            $inspectorRemarks = $validated['findings'] ?? '';

            if (!empty($validated['document_remarks'])) {
                $remarksArray = [];
                foreach ($validated['document_remarks'] as $docType => $remark) {
                    if (!empty($remark)) {
                        $docLabels = [
                            'fecalysis' => 'Fecalysis',
                            'xray_sputum' => 'X-Ray/Sputum',
                            'receipt' => 'Receipt',
                            'dti' => 'DTI'
                        ];
                        $remarksArray[] = "{$docLabels[$docType]}: {$remark}";
                    }
                }
                if (!empty($remarksArray)) {
                    $inspectorRemarks .= "\n\nDocument-specific notes:\n" . implode("\n", $remarksArray);
                }
            }

            $labReport->update([
                'status' => 'rejected',
                'overall_result' => 'fail',
                'fecalysis_result' => $validated['document_statuses']['fecalysis'] === 'approved' ? 'pass' : 'fail',
                'xray_sputum_result' => $validated['document_statuses']['xray_sputum'] === 'approved' ? 'pass' : 'fail',
                'receipt_result' => $validated['document_statuses']['receipt'] === 'approved' ? 'pass' : 'fail',
                'dti_result' => $validated['document_statuses']['dti'] === 'approved' ? 'pass' : 'fail',
                'inspector_remarks' => $inspectorRemarks,
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
            ]);

            // Notify lab inspector about lab report review
            if ($labReport->submitted_by) {
                NotificationHelper::labReportReviewed(
                    $labReport->submitted_by,
                    $inspection->business,
                    $labReport,
                    'rejected'
                );
            }
        }

        ActivityLog::logActivity(
            'denied',
            $inspection,
            'Denied inspection ' . $inspection->inspection_number
        );

        // Notify lab inspector about inspection denial
        if ($labReport && $labReport->submitted_by) {
            NotificationHelper::inspectionDenied(
                $labReport->submitted_by,
                $inspection->business,
                $inspection
            );
        }

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection has been marked as denied.');
    }

    public function print(Inspection $inspection)
    {
        $inspection->load([
            'business',
            'inspector',
            'permit',
        ]);

        return Inertia::render('Inspections/Print', [
            'inspection' => $inspection,
        ]);
    }
}
