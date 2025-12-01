<?php

namespace App\Http\Controllers;

use App\Models\LabReport;
use App\Models\Business;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Helpers\NotificationHelper;

class LabReportController extends Controller
{
    /**
     * Display a listing of lab reports.
     */
    public function index()
    {
        $labReports = LabReport::with(['business', 'submittedBy', 'inspectedBy'])
            ->latest()
            ->paginate(10);

        return Inertia::render('LabReports/Index', [
            'labReports' => $labReports
        ]);
    }

    public function create(Request $request)
    {
        $businesses = Business::active()
            ->whereDoesntHave('labReports', function ($query) {
                $query->whereIn('status', ['pending', 'approved']);
            })
            ->get(['id', 'business_name', 'owner_name', 'permit_status']);

        $selectedBusinessId = $request->query('business_id');

        $selectedBusiness = null;
        if ($selectedBusinessId) {
            $selectedBusiness = Business::find($selectedBusinessId);
        }

        return Inertia::render('LabReports/Create', [
            'businesses' => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
            'selectedBusiness' => $selectedBusiness,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'application_type' => 'required|in:new,renewal',

            'fecalysis_photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'xray_sputum_photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'receipt_photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'dti_photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',

            'fecalysis_remarks' => 'nullable|string|max:500',
            'xray_sputum_remarks' => 'nullable|string|max:500',
            'receipt_remarks' => 'nullable|string|max:500',
            'dti_remarks' => 'nullable|string|max:500',
            'general_remarks' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        try {
            $fecalysisPath = $request->file('fecalysis_photo')->store('lab-reports/fecalysis', 'public');
            $xrayPath = $request->file('xray_sputum_photo')->store('lab-reports/xray-sputum', 'public');
            $receiptPath = $request->file('receipt_photo')->store('lab-reports/receipts', 'public');
            $dtiPath = $request->file('dti_photo')->store('lab-reports/dti', 'public');

            $business = Business::findOrFail($validated['business_id']);

            $labReport = LabReport::create([
                'business_id' => $validated['business_id'],
                'application_type' => $validated['application_type'],
                'submitted_by' => auth()->id(),

                'fecalysis_photo' => $fecalysisPath,
                'xray_sputum_photo' => $xrayPath,
                'receipt_photo' => $receiptPath,
                'dti_photo' => $dtiPath,

                'fecalysis_result' => null,
                'xray_sputum_result' => null,
                'receipt_result' => null,
                'dti_result' => null,

                'fecalysis_remarks' => $validated['fecalysis_remarks'] ?? null,
                'xray_sputum_remarks' => $validated['xray_sputum_remarks'] ?? null,
                'receipt_remarks' => $validated['receipt_remarks'] ?? null,
                'dti_remarks' => $validated['dti_remarks'] ?? null,
                'general_remarks' => $validated['general_remarks'] ?? null,

                'status' => 'pending',
                'overall_result' => null,
                'submitted_at' => now(),
            ]);

            // Create inspection for both new and renewal applications
            $inspection = $this->createInspectionForLabReport($labReport);

            $inspectors = User::where('role', 'admin')->get();

            foreach ($inspectors as $inspector) {
                NotificationHelper::labReportSubmitted(
                    $inspector->id,
                    $business,
                    $labReport,
                    $inspection
                );
            }

            DB::commit();

            $message = 'Lab report submitted successfully. Physical inspection #' . $inspection->inspection_number . ' has been scheduled for ' . $inspection->inspection_date->format('F d, Y') . '.';

            return redirect()->route('lab-reports.index')
                ->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($fecalysisPath)) Storage::disk('public')->delete($fecalysisPath);
            if (isset($xrayPath)) Storage::disk('public')->delete($xrayPath);
            if (isset($receiptPath)) Storage::disk('public')->delete($receiptPath);
            if (isset($dtiPath)) Storage::disk('public')->delete($dtiPath);

            return back()->withErrors(['error' => 'Failed to submit lab report: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified lab report.
     */
    public function show(LabReport $labReport)
    {
        $labReport->load(['business', 'submittedBy', 'inspectedBy']);

        $inspection = Inspection::where('business_id', $labReport->business_id)
            ->whereDate('created_at', $labReport->created_at->toDateString())
            ->first();

        return Inertia::render('LabReports/Show', [
            'labReport' => $labReport,
            'inspection' => $inspection
        ]);
    }

    public function edit(LabReport $labReport)
    {
        if (!in_array($labReport->status, ['pending', 'rejected'])) {
            return redirect()->route('lab-reports.show', $labReport)
                ->with('error', 'This lab report cannot be edited.');
        }

        $businesses = Business::active()
            ->get(['id', 'business_name', 'owner_name', 'permit_status']);

        $labReport->fecalysis_photo_url = $labReport->fecalysis_photo
            ? Storage::url($labReport->fecalysis_photo)
            : null;
        $labReport->xray_sputum_photo_url = $labReport->xray_sputum_photo
            ? Storage::url($labReport->xray_sputum_photo)
            : null;
        $labReport->receipt_photo_url = $labReport->receipt_photo
            ? Storage::url($labReport->receipt_photo)
            : null;
        $labReport->dti_photo_url = $labReport->dti_photo
            ? Storage::url($labReport->dti_photo)
            : null;

        return Inertia::render('LabReports/Edit', [
            'labReport' => $labReport,
            'businesses' => $businesses
        ]);
    }

    public function update(Request $request, LabReport $labReport)
    {
        // Only allow updates if not approved
        if ($labReport->status === 'approved') {
            return redirect()->route('lab-reports.show', $labReport)
                ->with('error', 'Approved lab reports cannot be modified.');
        }

        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'application_type' => 'required|in:new,renewal',

            // File uploads (optional on update)
            'fecalysis_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'xray_sputum_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'receipt_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'dti_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',

            // Remarks
            'fecalysis_remarks' => 'nullable|string|max:500',
            'xray_sputum_remarks' => 'nullable|string|max:500',
            'receipt_remarks' => 'nullable|string|max:500',
            'dti_remarks' => 'nullable|string|max:500',
            'general_remarks' => 'nullable|string|max:1000',
        ]);

        // Prepare update data (only include fields that should be updated)
        $updateData = [
            'business_id' => $validated['business_id'],
            'application_type' => $validated['application_type'],
            'fecalysis_remarks' => $validated['fecalysis_remarks'],
            'xray_sputum_remarks' => $validated['xray_sputum_remarks'],
            'receipt_remarks' => $validated['receipt_remarks'],
            'dti_remarks' => $validated['dti_remarks'],
            'general_remarks' => $validated['general_remarks'],

            // Reset evaluation fields when edited
            'status' => 'pending',
            'overall_result' => null,
            'fecalysis_result' => null,
            'xray_sputum_result' => null,
            'receipt_result' => null,
            'dti_result' => null,
            'inspected_by' => null,
            'inspected_at' => null,
            'inspector_remarks' => null,
        ];

        // Handle file uploads ONLY if new files are provided
        if ($request->hasFile('fecalysis_photo')) {
            if ($labReport->fecalysis_photo) {
                Storage::disk('public')->delete($labReport->fecalysis_photo);
            }
            $updateData['fecalysis_photo'] = $request->file('fecalysis_photo')->store('lab-reports/fecalysis', 'public');
        }

        if ($request->hasFile('xray_sputum_photo')) {
            if ($labReport->xray_sputum_photo) {
                Storage::disk('public')->delete($labReport->xray_sputum_photo);
            }
            $updateData['xray_sputum_photo'] = $request->file('xray_sputum_photo')->store('lab-reports/xray-sputum', 'public');
        }

        if ($request->hasFile('receipt_photo')) {
            if ($labReport->receipt_photo) {
                Storage::disk('public')->delete($labReport->receipt_photo);
            }
            $updateData['receipt_photo'] = $request->file('receipt_photo')->store('lab-reports/receipts', 'public');
        }

        if ($request->hasFile('dti_photo')) {
            if ($labReport->dti_photo) {
                Storage::disk('public')->delete($labReport->dti_photo);
            }
            $updateData['dti_photo'] = $request->file('dti_photo')->store('lab-reports/dti', 'public');
        }

        $labReport->update($updateData);

        return redirect()->route('lab-reports.index')
            ->with('success', 'Lab report updated successfully.');
    }

    /**
     * Remove the specified lab report from storage.
     */
    public function destroy(LabReport $labReport)
    {
        // Only allow deletion if not approved
        if ($labReport->status === 'approved') {
            return back()->with('error', 'Approved lab reports cannot be deleted.');
        }

        DB::beginTransaction();
        try {
            // Delete associated inspection if it exists
            $inspection = Inspection::where('business_id', $labReport->business_id)
                ->whereDate('created_at', $labReport->created_at->toDateString())
                ->first();

            if ($inspection) {
                // Only delete if inspection is still pending
                if ($inspection->result === 'Pending') {
                    $inspection->delete();
                }
            }

            // Delete associated files
            Storage::disk('public')->delete([
                $labReport->fecalysis_photo,
                $labReport->xray_sputum_photo,
                $labReport->receipt_photo,
                $labReport->dti_photo,
            ]);

            $labReport->delete();

            DB::commit();

            return redirect()->route('lab-reports.index')
                ->with('success', 'Lab report and associated inspection deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete lab report: ' . $e->getMessage());
        }
    }

    /**
     * Display lab reports pending inspection (for lab inspectors).
     */
    public function inspectionQueue()
    {
        $pendingReports = LabReport::with(['business', 'submittedBy'])
            ->where('status', 'pending')
            ->latest('submitted_at')
            ->paginate(10);

        return Inertia::render('LabReports/InspectionQueue', [
            'pendingReports' => $pendingReports
        ]);
    }

    /**
     * Approve a lab report after inspection.
     */
    public function approve(Request $request, LabReport $labReport)
    {
        $validated = $request->validate([
            'fecalysis_result' => 'required|in:pass,fail',
            'xray_sputum_result' => 'required|in:pass,fail',
            'receipt_result' => 'required|in:pass,fail',
            'dti_result' => 'required|in:pass,fail',
            'inspector_remarks' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();
        try {
            // Determine overall result
            $allPassed = $validated['fecalysis_result'] === 'pass' &&
                $validated['xray_sputum_result'] === 'pass' &&
                $validated['receipt_result'] === 'pass' &&
                $validated['dti_result'] === 'pass';

            $labReport->update([
                'status' => 'approved',
                'fecalysis_result' => $validated['fecalysis_result'],
                'xray_sputum_result' => $validated['xray_sputum_result'],
                'receipt_result' => $validated['receipt_result'],
                'dti_result' => $validated['dti_result'],
                'overall_result' => $allPassed ? 'pass' : 'fail',
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
                'inspector_remarks' => $validated['inspector_remarks'],
            ]);

            // Update associated inspection if exists
            $inspection = Inspection::where('business_id', $labReport->business_id)
                ->whereDate('created_at', $labReport->created_at->toDateString())
                ->first();

            if ($inspection) {
                $inspection->update([
                    'result' => $allPassed ? 'Approved' : 'Conditional',
                    'findings' => 'Lab report evaluated. Overall result: ' . ($allPassed ? 'PASS' : 'FAIL'),
                ]);
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'Lab report evaluated and approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to approve lab report: ' . $e->getMessage()]);
        }
    }

    /**
     * Reject a lab report after inspection.
     */
    public function reject(Request $request, LabReport $labReport)
    {
        $validated = $request->validate([
            'fecalysis_result' => 'required|in:pass,fail',
            'xray_sputum_result' => 'required|in:pass,fail',
            'receipt_result' => 'required|in:pass,fail',
            'dti_result' => 'required|in:pass,fail',
            'inspector_remarks' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();
        try {
            $labReport->update([
                'status' => 'rejected',
                'fecalysis_result' => $validated['fecalysis_result'],
                'xray_sputum_result' => $validated['xray_sputum_result'],
                'receipt_result' => $validated['receipt_result'],
                'dti_result' => $validated['dti_result'],
                'overall_result' => 'fail',
                'inspected_by' => auth()->id(),
                'inspected_at' => now(),
                'inspector_remarks' => $validated['inspector_remarks'],
            ]);

            // Update associated inspection if exists
            $inspection = Inspection::where('business_id', $labReport->business_id)
                ->whereDate('created_at', $labReport->created_at->toDateString())
                ->first();

            if ($inspection) {
                $inspection->update([
                    'result' => 'Denied',
                    'findings' => 'Lab report rejected. ' . $validated['inspector_remarks'],
                ]);
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'Lab report rejected.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to reject lab report: ' . $e->getMessage()]);
        }
    }

    /**
     * Create an inspection automatically when lab report is submitted (for both new and renewal applications)
     */
    private function createInspectionForLabReport(LabReport $labReport)
    {
        // Generate inspection number
        $lastInspection = Inspection::latest()->first();
        $nextNumber = $lastInspection
            ? (int)substr($lastInspection->inspection_number, -4) + 1
            : 1;
        $inspectionNumber = 'INS-' . date('Y') . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        // Get the first available inspector (Admin or Sanitary Inspector)
        $inspector = User::whereIn('role', ['Admin', 'Sanitary Inspector'])
            ->where('is_active', 1)
            ->first();

        // If no inspector found, throw an error
        if (!$inspector) {
            throw new \Exception('No active inspector available to assign to this inspection.');
        }

        // Determine inspection type and details based on application type
        $inspectionType = $labReport->application_type === 'new' ? 'Initial' : 'Renewal';
        $findings = $labReport->application_type === 'new'
            ? 'Lab report submitted on ' . now()->format('F d, Y') . '. Physical inspection scheduled for new application.'
            : 'Lab report submitted on ' . now()->format('F d, Y') . '. Physical inspection scheduled for permit renewal.';

        $inspection = Inspection::create([
            'inspection_number' => $inspectionNumber,
            'business_id' => $labReport->business_id,
            'inspection_date' => now()->addDays(3), // Schedule 3 days from now
            'inspection_time' => '09:00:00',
            'inspector_id' => $inspector->id,
            'inspection_type' => $inspectionType, // Dynamic based on application type
            'result' => 'Pending',
            'findings' => $findings,
            'recommendations' => 'Conduct on-site inspection to verify compliance with sanitary standards.',
        ]);

        return $inspection;
    }

    /**
     * Get statistics for dashboard
     */
    public function getStatistics()
    {
        return [
            'total' => LabReport::count(),
            'pending' => LabReport::where('status', 'pending')->count(),
            'approved' => LabReport::where('status', 'approved')->count(),
            'rejected' => LabReport::where('status', 'rejected')->count(),
            'pass_rate' => LabReport::where('overall_result', 'pass')->count() / max(LabReport::count(), 1) * 100,
        ];
    }
}
