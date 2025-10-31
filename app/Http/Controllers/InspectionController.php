<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\User;
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
            'inspection_type' => 'required|in:Initial,Renewal,Follow-up,Complaint-based,Random',
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
        $inspection->load([
            'business',
            'inspector',
            'permit',
            'documents.uploader'
        ]);

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
            'inspection_type' => 'required|in:Initial,Renewal,Follow-up,Complaint-based,Random',
            'result' => 'required|in:Passed,Failed,Pending,Passed with Conditions',
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
        $validated = $request->validate([
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'pass_with_conditions' => 'boolean',
        ]);

        $result = $validated['pass_with_conditions'] ? 'Passed with Conditions' : 'Passed';

        $inspection->update([
            'result' => $result,
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
        ]);

        // Create or update the sanitary permit
        $permit = SanitaryPermit::updateOrCreate(
            ['business_id' => $inspection->business_id],
            [
                'permit_number' => SanitaryPermit::generatePermitNumber(),
                'permit_type' => $inspection->inspection_type === 'Initial' ? 'New' : 'Renewal',
                'issue_date' => now(),
                'expiry_date' => now()->addYear(),
                'issued_by' => auth()->id(),
                'approved_by' => auth()->id(),
                'status' => 'Active',
                'remarks' => $validated['recommendations'] ?? null,
            ]
        );

        ActivityLog::logActivity(
            'passed',
            $inspection,
            'Passed inspection ' . $inspection->inspection_number . ' and issued permit ' . $permit->permit_number
        );

        return back()->with('success', 'Inspection passed and permit issued successfully.');
    }

    public function fail(Request $request, Inspection $inspection)
    {
        $validated = $request->validate([
            'findings' => 'required|string',
            'recommendations' => 'nullable|string',
        ]);

        $inspection->update([
            'result' => 'Failed',
            'findings' => $validated['findings'],
            'recommendations' => $validated['recommendations'],
        ]);

        ActivityLog::logActivity(
            'failed',
            $inspection,
            'Failed inspection ' . $inspection->inspection_number
        );

        return back()->with('success', 'Inspection marked as failed.');
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
