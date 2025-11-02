<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\User;
use App\Models\LabReport;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
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
        ]);

        $inspection->update($validated);

        ActivityLog::logActivity(
            'updated',
            $inspection,
            'Saved progress for inspection ' . $inspection->inspection_number
        );

        return back()->with('success', 'Progress saved successfully.');
    }

    public function pass(Request $request, Inspection $inspection)
    {
        // Validate inspection is still pending
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'This inspection has already been completed.');
        }

        $validated = $request->validate([
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'pass_with_conditions' => 'boolean',
            'document_statuses' => 'required|array',
            'document_statuses.*' => 'required|in:approved,rejected',
        ]);

        // Check all documents are approved
        $allApproved = collect($validated['document_statuses'])->every(function ($status) {
            return $status === 'approved';
        });

        if (!$allApproved) {
            return back()->with('error', 'All documents must be approved to pass the inspection.');
        }

        // Update inspection
        $inspection->update([
            'result' => 'Approved',
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
        ]);

        // Update associated lab report
        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->first();

        if ($labReport) {
            $labReport->update([
                'status' => 'approved',
                'overall_result' => 'pass',
                'fecalysis_result' => $validated['document_statuses']['fecalysis'] === 'approved' ? 'pass' : 'fail',
                'xray_sputum_result' => $validated['document_statuses']['xray_sputum'] === 'approved' ? 'pass' : 'fail',
                'receipt_result' => $validated['document_statuses']['receipt'] === 'approved' ? 'pass' : 'fail',
                'dti_result' => $validated['document_statuses']['dti'] === 'approved' ? 'pass' : 'fail',
                'inspector_remarks' => $validated['recommendations'],
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
            ]);
        }

        // Create or update the sanitary permit
        $permitType = $inspection->inspection_type === 'Initial' ? 'New' : 'Renewal';

        $permit = SanitaryPermit::updateOrCreate(
            ['business_id' => $inspection->business_id],
            [
                'permit_number' => SanitaryPermit::generatePermitNumber(),
                'permit_type' => $permitType,
                'issue_date' => now(),
                'expiry_date' => now()->addYear(),
                'issued_by' => auth()->id(),
                'approved_by' => auth()->id(),
                'status' => 'Active',
                'remarks' => $validated['recommendations'] ?? null,
            ]
        );

        // Update inspection with permit_id
        $inspection->update(['permit_id' => $permit->id]);

        ActivityLog::logActivity(
            'approved',
            $inspection,
            'Approved inspection ' . $inspection->inspection_number . ' and issued permit ' . $permit->permit_number
        );

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection approved successfully! Sanitary permit has been issued.');
    }

    public function fail(Request $request, Inspection $inspection)
    {
        // Validate inspection is still pending
        if ($inspection->result !== 'Pending') {
            return back()->with('error', 'This inspection has already been completed.');
        }

        $validated = $request->validate([
            'findings' => 'required|string',
            'recommendations' => 'nullable|string',
            'document_statuses' => 'required|array',
            'document_statuses.*' => 'required|in:approved,rejected',
        ]);

        // Update inspection
        $inspection->update([
            'result' => 'Denied',
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
        ]);

        // Update associated lab report
        $labReport = LabReport::where('business_id', $inspection->business_id)
            ->whereDate('created_at', $inspection->created_at->toDateString())
            ->first();

        if ($labReport) {
            $labReport->update([
                'status' => 'rejected',
                'overall_result' => 'fail',
                'fecalysis_result' => $validated['document_statuses']['fecalysis'] === 'approved' ? 'pass' : 'fail',
                'xray_sputum_result' => $validated['document_statuses']['xray_sputum'] === 'approved' ? 'pass' : 'fail',
                'receipt_result' => $validated['document_statuses']['receipt'] === 'approved' ? 'pass' : 'fail',
                'dti_result' => $validated['document_statuses']['dti'] === 'approved' ? 'pass' : 'fail',
                'inspector_remarks' => $validated['findings'],
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
            ]);
        }

        ActivityLog::logActivity(
            'denied',
            $inspection,
            'Denied inspection ' . $inspection->inspection_number
        );

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
