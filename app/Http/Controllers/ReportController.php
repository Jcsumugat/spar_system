<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\Inspection;
use App\Models\Violation;
use App\Models\PermitRenewal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function dashboard()
    {
        $stats = [
            'total_businesses' => Business::count(),
            'active_businesses' => Business::active()->count(),
            'total_permits' => SanitaryPermit::count(),
            'active_permits' => SanitaryPermit::where('status', 'Active')->count(),
            'expiring_permits' => SanitaryPermit::where('status', 'Expiring Soon')->count(),
            'expired_permits' => SanitaryPermit::where('status', 'Expired')->count(),
            'pending_renewals' => PermitRenewal::pending()->count(),
            'total_inspections' => Inspection::count(),
            'inspections_this_month' => Inspection::whereMonth('inspection_date', now()->month)
                ->whereYear('inspection_date', now()->year)
                ->count(),
            'passed_inspections' => Inspection::passed()->count(),
            'failed_inspections' => Inspection::failed()->count(),
            'open_violations' => Violation::open()->count(),
            'overdue_violations' => Violation::overdue()->count(),
        ];

        // Business distribution by type
        $businessesByType = Business::select('business_type', DB::raw('count(*) as total'))
            ->groupBy('business_type')
            ->get();

        // Business distribution by barangay
        $businessesByBarangay = Business::select('barangay', DB::raw('count(*) as total'))
            ->groupBy('barangay')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Permit status distribution
        $permitsByStatus = SanitaryPermit::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        // Inspections by type
        $inspectionsByType = Inspection::select('inspection_type', DB::raw('count(*) as total'))
            ->groupBy('inspection_type')
            ->get();

        // Monthly inspections trend (last 12 months)
        $monthlyInspections = Inspection::select(
            DB::raw('DATE_FORMAT(inspection_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->where('inspection_date', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent activities
        $recentPermits = SanitaryPermit::with('business')
            ->latest('created_at')
            ->limit(5)
            ->get();

        $recentInspections = Inspection::with(['business', 'inspector'])
            ->latest('inspection_date')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'charts' => [
                'businessesByType' => $businessesByType,
                'businessesByBarangay' => $businessesByBarangay,
                'permitsByStatus' => $permitsByStatus,
                'inspectionsByType' => $inspectionsByType,
                'monthlyInspections' => $monthlyInspections,
            ],
            'recent' => [
                'permits' => $recentPermits,
                'inspections' => $recentInspections,
            ],
        ]);
    }

    public function businesses(Request $request)
    {
        $query = Business::query();

        $dateFrom = $request->input('date_from', now()->subYear()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $query->whereBetween('created_at', [$dateFrom, $dateTo]);

        // Statistics
        $stats = [
            'total' => $query->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
            'inactive' => (clone $query)->where('is_active', false)->count(),
            'food_establishments' => (clone $query)->where('business_type', 'Food Establishment')->count(),
            'non_food_establishments' => (clone $query)->where('business_type', 'Non-Food Establishment')->count(),
        ];

        // By barangay
        $byBarangay = Business::select('barangay', DB::raw('count(*) as total'))
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('barangay')
            ->orderByDesc('total')
            ->get();

        // By category
        $byCategory = Business::select('establishment_category', DB::raw('count(*) as total'))
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->whereNotNull('establishment_category')
            ->groupBy('establishment_category')
            ->orderByDesc('total')
            ->get();

        // Monthly registration trend
        $monthlyRegistrations = Business::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Reports/Businesses', [
            'stats' => $stats,
            'byBarangay' => $byBarangay,
            'byCategory' => $byCategory,
            'monthlyRegistrations' => $monthlyRegistrations,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function permits(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->subYear()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $query = SanitaryPermit::whereBetween('issue_date', [$dateFrom, $dateTo]);

        // Statistics
        $stats = [
            'total_issued' => (clone $query)->count(),
            'active' => (clone $query)->where('status', 'Active')->count(),
            'expired' => (clone $query)->where('status', 'Expired')->count(),
            'expiring_soon' => (clone $query)->where('status', 'Expiring Soon')->count(),
            'suspended' => (clone $query)->where('status', 'Suspended')->count(),
            'revoked' => (clone $query)->where('status', 'Revoked')->count(),
            'new_permits' => (clone $query)->where('permit_type', 'New')->count(),
            'renewals' => (clone $query)->where('permit_type', 'Renewal')->count(),
        ];

        // By status
        $byStatus = SanitaryPermit::select('status', DB::raw('count(*) as total'))
            ->whereBetween('issue_date', [$dateFrom, $dateTo])
            ->groupBy('status')
            ->get();

        // By type
        $byType = SanitaryPermit::select('permit_type', DB::raw('count(*) as total'))
            ->whereBetween('issue_date', [$dateFrom, $dateTo])
            ->groupBy('permit_type')
            ->get();

        // Monthly issuance trend
        $monthlyIssuance = SanitaryPermit::select(
            DB::raw('DATE_FORMAT(issue_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->whereBetween('issue_date', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Expiring permits (next 90 days)
        $expiringPermits = SanitaryPermit::with('business')
            ->where('status', 'Active')
            ->whereBetween('expiry_date', [now(), now()->addDays(90)])
            ->orderBy('expiry_date')
            ->get();

        // Permits by business type
        $byBusinessType = SanitaryPermit::join('businesses', 'sanitary_permits.business_id', '=', 'businesses.id')
            ->select('businesses.business_type', DB::raw('count(*) as total'))
            ->whereBetween('sanitary_permits.issue_date', [$dateFrom, $dateTo])
            ->groupBy('businesses.business_type')
            ->get();

        return Inertia::render('Reports/Permits', [
            'stats' => $stats,
            'byStatus' => $byStatus,
            'byType' => $byType,
            'byBusinessType' => $byBusinessType,
            'monthlyIssuance' => $monthlyIssuance,
            'expiringPermits' => $expiringPermits,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function inspections(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->subYear()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $query = Inspection::whereBetween('inspection_date', [$dateFrom, $dateTo]);

        // Statistics
        $stats = [
            'total_conducted' => (clone $query)->count(),
            'passed' => (clone $query)->where('result', 'Passed')->count(),
            'passed_with_conditions' => (clone $query)->where('result', 'Passed with Conditions')->count(),
            'failed' => (clone $query)->where('result', 'Failed')->count(),
            'pending' => (clone $query)->where('result', 'Pending')->count(),
            'average_score' => (clone $query)->avg('overall_score') ?? 0,
            'requires_follow_up' => (clone $query)->whereNotNull('follow_up_date')->count(),
        ];

        // By type
        $byType = Inspection::select('inspection_type', DB::raw('count(*) as total'))
            ->whereBetween('inspection_date', [$dateFrom, $dateTo])
            ->groupBy('inspection_type')
            ->get();

        // By result
        $byResult = Inspection::select('result', DB::raw('count(*) as total'))
            ->whereBetween('inspection_date', [$dateFrom, $dateTo])
            ->groupBy('result')
            ->get();

        // Monthly inspection trend
        $monthlyInspections = Inspection::select(
            DB::raw('DATE_FORMAT(inspection_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->whereBetween('inspection_date', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // By inspector
        $byInspector = Inspection::join('users', 'inspections.inspector_id', '=', 'users.id')
            ->select('users.name', DB::raw('count(*) as total'))
            ->whereBetween('inspections.inspection_date', [$dateFrom, $dateTo])
            ->groupBy('users.name')
            ->orderByDesc('total')
            ->get();

        // Average score by month
        $averageScoreByMonth = Inspection::select(
            DB::raw('DATE_FORMAT(inspection_date, "%Y-%m") as month'),
            DB::raw('AVG(overall_score) as average_score')
        )
            ->whereBetween('inspection_date', [$dateFrom, $dateTo])
            ->whereNotNull('overall_score')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Upcoming follow-ups
        $upcomingFollowUps = Inspection::with(['business', 'inspector'])
            ->where('follow_up_date', '>=', now())
            ->orderBy('follow_up_date')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/Inspections', [
            'stats' => $stats,
            'byType' => $byType,
            'byResult' => $byResult,
            'byInspector' => $byInspector,
            'monthlyInspections' => $monthlyInspections,
            'averageScoreByMonth' => $averageScoreByMonth,
            'upcomingFollowUps' => $upcomingFollowUps,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function violations(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->subYear()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $query = Violation::whereBetween('violation_date', [$dateFrom, $dateTo]);

        // Statistics
        $stats = [
            'total_violations' => (clone $query)->count(),
            'open' => (clone $query)->where('status', 'Open')->count(),
            'under_correction' => (clone $query)->where('status', 'Under Correction')->count(),
            'resolved' => (clone $query)->where('status', 'Resolved')->count(),
            'unresolved' => (clone $query)->where('status', 'Unresolved')->count(),
            'minor' => (clone $query)->where('severity', 'Minor')->count(),
            'major' => (clone $query)->where('severity', 'Major')->count(),
            'critical' => (clone $query)->where('severity', 'Critical')->count(),
            'overdue' => Violation::overdue()->count(),
        ];

        // By severity
        $bySeverity = Violation::select('severity', DB::raw('count(*) as total'))
            ->whereBetween('violation_date', [$dateFrom, $dateTo])
            ->groupBy('severity')
            ->get();

        // By status
        $byStatus = Violation::select('status', DB::raw('count(*) as total'))
            ->whereBetween('violation_date', [$dateFrom, $dateTo])
            ->groupBy('status')
            ->get();

        // By type
        $byType = Violation::select('violation_type', DB::raw('count(*) as total'))
            ->whereBetween('violation_date', [$dateFrom, $dateTo])
            ->groupBy('violation_type')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Monthly violations trend
        $monthlyViolations = Violation::select(
            DB::raw('DATE_FORMAT(violation_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->whereBetween('violation_date', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Businesses with most violations
        $businessesWithViolations = Violation::join('businesses', 'violations.business_id', '=', 'businesses.id')
            ->select('businesses.business_name', DB::raw('count(*) as total'))
            ->whereBetween('violations.violation_date', [$dateFrom, $dateTo])
            ->groupBy('businesses.business_name')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        // Resolution rate
        $resolved = (clone $query)->where('status', 'Resolved')->count();
        $total = (clone $query)->count();
        $resolutionRate = $total > 0 ? round(($resolved / $total) * 100, 2) : 0;

        return Inertia::render('Reports/Violations', [
            'stats' => $stats,
            'bySeverity' => $bySeverity,
            'byStatus' => $byStatus,
            'byType' => $byType,
            'monthlyViolations' => $monthlyViolations,
            'businessesWithViolations' => $businessesWithViolations,
            'resolutionRate' => $resolutionRate,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function renewals(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->subYear()->toDateString());
        $dateTo = $request->input('date_to', now()->toDateString());

        $query = PermitRenewal::whereBetween('renewal_request_date', [$dateFrom, $dateTo]);

        // Statistics
        $stats = [
            'total_requests' => (clone $query)->count(),
            'pending' => (clone $query)->where('renewal_status', 'Pending')->count(),
            'under_review' => (clone $query)->where('renewal_status', 'Under Review')->count(),
            'inspection_required' => (clone $query)->where('renewal_status', 'Inspection Required')->count(),
            'approved' => (clone $query)->where('renewal_status', 'Approved')->count(),
            'rejected' => (clone $query)->where('renewal_status', 'Rejected')->count(),
        ];

        // By status
        $byStatus = PermitRenewal::select('renewal_status', DB::raw('count(*) as total'))
            ->whereBetween('renewal_request_date', [$dateFrom, $dateTo])
            ->groupBy('renewal_status')
            ->get();

        // Monthly renewal trend
        $monthlyRenewals = PermitRenewal::select(
            DB::raw('DATE_FORMAT(renewal_request_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->whereBetween('renewal_request_date', [$dateFrom, $dateTo])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Average processing time (for approved renewals)
        $averageProcessingTime = PermitRenewal::where('renewal_status', 'Approved')
            ->whereBetween('renewal_request_date', [$dateFrom, $dateTo])
            ->get()
            ->map(function ($renewal) {
                return Carbon::parse($renewal->renewal_request_date)
                    ->diffInDays(Carbon::parse($renewal->updated_at));
            })
            ->average();

        // Approval rate
        $approved = (clone $query)->where('renewal_status', 'Approved')->count();
        $total = (clone $query)->whereIn('renewal_status', ['Approved', 'Rejected'])->count();
        $approvalRate = $total > 0 ? round(($approved / $total) * 100, 2) : 0;

        return Inertia::render('Reports/Renewals', [
            'stats' => $stats,
            'byStatus' => $byStatus,
            'monthlyRenewals' => $monthlyRenewals,
            'averageProcessingTime' => round($averageProcessingTime ?? 0, 1),
            'approvalRate' => $approvalRate,
            'filters' => ['date_from' => $dateFrom, 'date_to' => $dateTo],
        ]);
    }

    public function compliance()
    {
        // Overall compliance metrics
        $totalBusinesses = Business::active()->count();
        $businessesWithActivePermits = Business::whereHas('sanitaryPermits', function ($query) {
            $query->where('status', 'Active');
        })->count();
        $complianceRate = $totalBusinesses > 0
            ? round(($businessesWithActivePermits / $totalBusinesses) * 100, 2)
            : 0;

        // Businesses without permits
        $businessesWithoutPermits = Business::active()
            ->whereDoesntHave('sanitaryPermits', function ($query) {
                $query->where('status', 'Active');
            })
            ->with('sanitaryPermits')
            ->get();

        // Businesses with expired permits
        $businessesWithExpiredPermits = Business::active()
            ->whereHas('sanitaryPermits', function ($query) {
                $query->where('status', 'Expired');
            })
            ->whereDoesntHave('sanitaryPermits', function ($query) {
                $query->where('status', 'Active');
            })
            ->with('sanitaryPermits')
            ->get();

        // Businesses with violations
        $businessesWithOpenViolations = Business::active()
            ->whereHas('violations', function ($query) {
                $query->whereIn('status', ['Open', 'Under Correction']);
            })
            ->withCount(['violations' => function ($query) {
                $query->whereIn('status', ['Open', 'Under Correction']);
            }])
            ->get();

        // Compliance by barangay
        $complianceByBarangay = Business::select('barangay')
            ->selectRaw('COUNT(*) as total_businesses')
            ->selectRaw('SUM(CASE WHEN EXISTS (
                SELECT 1 FROM sanitary_permits
                WHERE sanitary_permits.business_id = businesses.id
                AND sanitary_permits.status = "Active"
            ) THEN 1 ELSE 0 END) as compliant_businesses')
            ->groupBy('barangay')
            ->get()
            ->map(function ($item) {
                $item->compliance_rate = $item->total_businesses > 0
                    ? round(($item->compliant_businesses / $item->total_businesses) * 100, 2)
                    : 0;
                return $item;
            });

        // Inspection compliance
        $inspectionStats = [
            'businesses_inspected_this_year' => Inspection::whereYear('inspection_date', now()->year)
                ->distinct('business_id')
                ->count(),
            'total_active_businesses' => $totalBusinesses,
            'businesses_never_inspected' => Business::active()
                ->whereDoesntHave('inspections')
                ->count(),
            'businesses_overdue_inspection' => Business::active()
                ->whereHas('inspections', function ($query) {
                    $query->where('inspection_date', '<', now()->subYear());
                })
                ->count(),
        ];

        return Inertia::render('Reports/Compliance', [
            'complianceRate' => $complianceRate,
            'businessesWithoutPermits' => $businessesWithoutPermits,
            'businessesWithExpiredPermits' => $businessesWithExpiredPermits,
            'businessesWithOpenViolations' => $businessesWithOpenViolations,
            'complianceByBarangay' => $complianceByBarangay,
            'inspectionStats' => $inspectionStats,
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->input('type'); // businesses, permits, inspections, violations, renewals

        // This would typically generate a CSV or Excel file
        // For now, returning JSON as placeholder

        $data = [];
        $filename = '';

        switch ($type) {
            case 'businesses':
                $data = Business::with('sanitaryPermits')->get();
                $filename = 'businesses_report_' . now()->format('Y-m-d') . '.csv';
                break;
            case 'permits':
                $data = SanitaryPermit::with('business')->get();
                $filename = 'permits_report_' . now()->format('Y-m-d') . '.csv';
                break;
            case 'inspections':
                $data = Inspection::with(['business', 'inspector'])->get();
                $filename = 'inspections_report_' . now()->format('Y-m-d') . '.csv';
                break;
            case 'violations':
                $data = Violation::with('business')->get();
                $filename = 'violations_report_' . now()->format('Y-m-d') . '.csv';
                break;
            case 'renewals':
                $data = PermitRenewal::with(['business', 'previousPermit'])->get();
                $filename = 'renewals_report_' . now()->format('Y-m-d') . '.csv';
                break;
        }

        // Return as download (implement CSV generation as needed)
        return response()->json([
            'message' => 'Export functionality to be implemented',
            'type' => $type,
            'filename' => $filename,
            'records' => $data->count(),
        ]);
    }
}
