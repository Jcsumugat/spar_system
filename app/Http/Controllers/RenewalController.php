<?php

namespace App\Http\Controllers;

use App\Models\PermitRenewal;
use App\Models\SanitaryPermit;
use App\Models\Business;
use App\Models\ActivityLog;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RenewalController extends Controller
{
    public function index(Request $request)
    {
        $query = PermitRenewal::with(['business', 'previousPermit', 'newPermit']);

        // Filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('renewal_status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('business', function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%");
            })->orWhereHas('previousPermit', function ($q) use ($search) {
                $q->where('permit_number', 'like', "%{$search}%");
            });
        }

        $renewals = $query->latest('created_at')->paginate(15);

        return Inertia::render('Renewals/Index', [
            'renewals' => $renewals,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        // Get businesses with expiring or expired permits
        $businesses = Business::whereHas('sanitaryPermits', function ($query) {
            $query->whereIn('status', ['Active', 'Expiring Soon', 'Expired']);
        })->with(['sanitaryPermits' => function ($query) {
            $query->latest('issue_date');
        }])->get();

        return Inertia::render('Renewals/Create', [
            'businesses' => $businesses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'previous_permit_id' => 'required|exists:sanitary_permits,id',
        ]);

        // Check if renewal already exists
        $existingRenewal = PermitRenewal::where('previous_permit_id', $validated['previous_permit_id'])
            ->whereIn('renewal_status', ['Pending', 'Under Review', 'Inspection Required'])
            ->first();

        if ($existingRenewal) {
            return back()->withErrors(['error' => 'A renewal request already exists for this permit.']);
        }

        $validated['renewal_request_date'] = now();
        $validated['renewal_status'] = 'Pending';

        $renewal = PermitRenewal::create($validated);

        // Create notification
        Notification::create([
            'business_id' => $validated['business_id'],
            'notification_type' => 'Renewal Required',
            'title' => 'Permit Renewal Request Submitted',
            'message' => 'Your renewal request has been submitted and is pending review.',
        ]);

        ActivityLog::logActivity(
            'created',
            $renewal,
            'Created renewal request for permit #' . $renewal->previousPermit->permit_number
        );

        return redirect()->route('renewals.show', $renewal)
            ->with('success', 'Renewal request submitted successfully.');
    }

    public function show(PermitRenewal $renewal)
    {
        $renewal->load([
            'business',
            'previousPermit.issuedBy',
            'newPermit.issuedBy',
        ]);

        return Inertia::render('Renewals/Show', [
            'renewal' => $renewal,
        ]);
    }

    public function approve(Request $request, PermitRenewal $renewal)
    {
        if (!auth()->user()->canApprovePermits()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'issue_date' => 'required|date',
            'expiry_date' => 'required|date|after:issue_date',
        ]);

        // Create new permit
        $newPermit = SanitaryPermit::create([
            'permit_number' => SanitaryPermit::generatePermitNumber(),
            'business_id' => $renewal->business_id,
            'permit_type' => 'Renewal',
            'issue_date' => $validated['issue_date'],
            'expiry_date' => $validated['expiry_date'],
            'status' => 'Active',
            'issued_by' => auth()->id(),
            'approved_by' => auth()->id(),
        ]);

        // Update renewal
        $renewal->update([
            'new_permit_id' => $newPermit->id,
            'renewal_status' => 'Approved',
        ]);

        // Update old permit status
        $renewal->previousPermit->update([
            'status' => 'Expired',
        ]);

        // Create notification
        Notification::create([
            'business_id' => $renewal->business_id,
            'notification_type' => 'Permit Approved',
            'title' => 'Permit Renewal Approved',
            'message' => 'Your permit renewal has been approved. New permit: ' . $newPermit->permit_number,
        ]);

        ActivityLog::logActivity(
            'approved',
            $renewal,
            'Approved renewal request and issued new permit ' . $newPermit->permit_number
        );

        return back()->with('success', 'Renewal approved and new permit issued successfully.');
    }

    public function reject(Request $request, PermitRenewal $renewal)
    {
        if (!auth()->user()->canApprovePermits()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $renewal->update([
            'renewal_status' => 'Rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Create notification
        Notification::create([
            'business_id' => $renewal->business_id,
            'notification_type' => 'Permit Rejected',
            'title' => 'Permit Renewal Rejected',
            'message' => 'Your permit renewal has been rejected. Reason: ' . $validated['rejection_reason'],
        ]);

        ActivityLog::logActivity(
            'rejected',
            $renewal,
            'Rejected renewal request'
        );

        return back()->with('success', 'Renewal request rejected.');
    }

    public function requireInspection(PermitRenewal $renewal)
    {
        if (!auth()->user()->canApprovePermits()) {
            abort(403, 'Unauthorized action.');
        }

        $renewal->update([
            'renewal_status' => 'Inspection Required',
        ]);

        // Create notification
        Notification::create([
            'business_id' => $renewal->business_id,
            'notification_type' => 'Inspection Scheduled',
            'title' => 'Inspection Required for Renewal',
            'message' => 'An inspection is required before your renewal can be processed.',
        ]);

        ActivityLog::logActivity(
            'updated',
            $renewal,
            'Marked renewal as requiring inspection'
        );

        return back()->with('success', 'Renewal marked as requiring inspection.');
    }

    public function destroy(PermitRenewal $renewal)
    {
        $renewal->delete();

        ActivityLog::logActivity(
            'deleted',
            $renewal,
            'Deleted renewal request'
        );

        return redirect()->route('renewals.index')
            ->with('success', 'Renewal request deleted successfully.');
    }
}
