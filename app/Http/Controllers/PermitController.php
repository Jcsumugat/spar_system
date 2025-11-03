<?php

namespace App\Http\Controllers;

use App\Models\SanitaryPermit;
use App\Models\Business;
use App\Models\ActivityLog;
use App\Models\PermitPrintLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PermitController extends Controller
{
    public function index(Request $request)
    {
        $query = SanitaryPermit::with(['business', 'issuedBy', 'approvedBy'])
            ->withCount('printLogs'); // Add print count

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

        // Get print count for this permit
        $printCount = PermitPrintLog::where('permit_id', $permit->id)->count();

        // Get print count for this business
        $businessPrintCount = PermitPrintLog::getBusinessPrintCount($permit->business_id);

        return Inertia::render('Permits/Show', [
            'permit' => $permit,
            'printCount' => $printCount,
            'businessPrintCount' => $businessPrintCount,
        ]);
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

    /**
     * Log successful print
     */
    public function logPrint(Request $request, SanitaryPermit $permit)
    {
        PermitPrintLog::create([
            'permit_id' => $permit->id,
            'business_id' => $permit->business_id,
            'printed_by' => auth()->id(),
            'printed_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        ActivityLog::logActivity(
            'printed',
            $permit,
            'Printed sanitary permit ' . $permit->permit_number
        );

        return response()->json([
            'success' => true,
            'message' => 'Print logged successfully',
        ]);
    }

    /**
     * Get print statistics for a business
     */
    public function getPrintStatistics(Request $request, $businessId)
    {
        $business = Business::findOrFail($businessId);

        $totalPrints = PermitPrintLog::getBusinessPrintCount($businessId);

        // Prints this month
        $monthlyPrints = PermitPrintLog::getBusinessPrintCountByDateRange(
            $businessId,
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        );

        // Prints by staff
        $printsByStaff = PermitPrintLog::where('business_id', $businessId)
            ->with('printedBy:id,name')
            ->selectRaw('printed_by, COUNT(*) as print_count')
            ->groupBy('printed_by')
            ->get();

        return response()->json([
            'business' => $business,
            'total_prints' => $totalPrints,
            'monthly_prints' => $monthlyPrints,
            'prints_by_staff' => $printsByStaff,
        ]);
    }
}
