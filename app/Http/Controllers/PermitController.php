<?php

namespace App\Http\Controllers;

use App\Models\SanitaryPermit;
use App\Models\Business;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PermitController extends Controller
{
    public function index(Request $request)
    {
        $query = SanitaryPermit::with(['business', 'issuedBy', 'approvedBy']);

        // Filter by permit type
        if ($request->has('permit_type') && $request->permit_type !== 'all') {
            $query->where('permit_type', $request->permit_type);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('permit_number', 'like', "%{$search}%")
                    ->orWhereHas('business', function ($q) use ($search) {
                        $q->where('business_name', 'like', "%{$search}%");
                    });
            });
        }

        $permits = $query->latest('created_at')->paginate(15);

        return Inertia::render('Permits/Index', [
            'permits' => $permits,
            'filters' => $request->only(['permit_type', 'search', 'status']),
        ]);
    }

    public function create()
    {
        $businesses = Business::active()->get(['id', 'business_name']);

        return Inertia::render('Permits/Create', [
            'businesses' => $businesses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_type' => 'required|in:New,Renewal',
            'issue_date' => 'required|date',
            'expiry_date' => 'required|date|after:issue_date',
            'remarks' => 'nullable|string',
        ]);

        $validated['permit_number'] = SanitaryPermit::generatePermitNumber();
        $validated['issued_by'] = auth()->id();
        $validated['status'] = 'Pending';

        $permit = SanitaryPermit::create($validated);

        ActivityLog::logActivity(
            'created',
            $permit,
            'Created sanitary permit ' . $permit->permit_number
        );

        return redirect()->route('permits.show', $permit)
            ->with('success', 'Permit created successfully.');
    }

    public function show(SanitaryPermit $permit)
    {
        $permit->load([
            'business',
            'issuedBy',
            'approvedBy',
            'inspections.inspector',
            'documents.uploader'
        ]);

        return Inertia::render('Permits/Show', [
            'permit' => $permit,
        ]);
    }

    public function edit(SanitaryPermit $permit)
    {
        $businesses = Business::active()->get(['id', 'business_name']);

        return Inertia::render('Permits/Edit', [
            'permit' => $permit,
            'businesses' => $businesses,
        ]);
    }

    public function update(Request $request, SanitaryPermit $permit)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_type' => 'required|in:New,Renewal',
            'issue_date' => 'required|date',
            'expiry_date' => 'required|date|after:issue_date',
            'status' => 'required|in:Active,Expiring Soon,Expired,Suspended,Revoked,Pending',
            'remarks' => 'nullable|string',
        ]);

        $oldData = $permit->toArray();
        $permit->update($validated);

        ActivityLog::logActivity(
            'updated',
            $permit,
            'Updated sanitary permit ' . $permit->permit_number,
            ['old' => $oldData, 'new' => $validated]
        );

        return redirect()->route('permits.show', $permit)
            ->with('success', 'Permit updated successfully.');
    }

    public function approve(SanitaryPermit $permit)
    {
        if (!auth()->user()->canApprovePermits()) {
            abort(403, 'Unauthorized action.');
        }

        $permit->update([
            'status' => 'Active',
            'approved_by' => auth()->id(),
        ]);

        ActivityLog::logActivity(
            'approved',
            $permit,
            'Approved sanitary permit ' . $permit->permit_number
        );

        return back()->with('success', 'Permit approved successfully.');
    }

    public function reject(Request $request, SanitaryPermit $permit)
    {
        if (!auth()->user()->canApprovePermits()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'remarks' => 'required|string|max:500',
        ]);

        $permit->update([
            'status' => 'Revoked',
            'remarks' => $validated['remarks'],
        ]);

        ActivityLog::logActivity(
            'rejected',
            $permit,
            'Rejected sanitary permit ' . $permit->permit_number
        );

        return back()->with('success', 'Permit rejected.');
    }

    public function destroy(SanitaryPermit $permit)
    {
        $permit->delete();

        ActivityLog::logActivity(
            'deleted',
            $permit,
            'Deleted sanitary permit ' . $permit->permit_number
        );

        return redirect()->route('permits.index')
            ->with('success', 'Permit deleted successfully.');
    }

    public function print(SanitaryPermit $permit)
    {
        $permit->load('business', 'issuedBy', 'approvedBy');

        return Inertia::render('Permits/Print', [
            'permit' => $permit,
        ]);
    }
}
