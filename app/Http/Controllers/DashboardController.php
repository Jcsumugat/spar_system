<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\Inspection;
use App\Models\PermitRenewal;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Key Statistics
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
            'pending_inspections' => Inspection::pending()->count(),
        ];

        // Charts Data
        $charts = [
            // Business distribution by type
            'businessesByType' => Business::select('business_type', DB::raw('count(*) as total'))
                ->groupBy('business_type')
                ->get(),

            // Top 10 barangays by business count
            'businessesByBarangay' => Business::select('barangay', DB::raw('count(*) as total'))
                ->groupBy('barangay')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),

            // Permit status distribution
            'permitsByStatus' => SanitaryPermit::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get(),

            // Inspections by type
            'inspectionsByType' => Inspection::select('inspection_type', DB::raw('count(*) as total'))
                ->groupBy('inspection_type')
                ->get(),

            // Inspections by result
            'inspectionsByResult' => Inspection::select('result', DB::raw('count(*) as total'))
                ->groupBy('result')
                ->get(),

            // Monthly inspections trend (last 12 months)
            'monthlyInspections' => Inspection::select(
                DB::raw('DATE_FORMAT(inspection_date, "%Y-%m") as month'),
                DB::raw('count(*) as total')
            )
                ->where('inspection_date', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),

            // Monthly permits issued (last 12 months)
            'monthlyPermits' => SanitaryPermit::select(
                DB::raw('DATE_FORMAT(issue_date, "%Y-%m") as month'),
                DB::raw('count(*) as total')
            )
                ->where('issue_date', '>=', now()->subMonths(12))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
        ];

        // Recent Activities
        $recentActivities = [
            'permits' => SanitaryPermit::with(['business', 'issuedBy'])
                ->latest('created_at')
                ->limit(5)
                ->get(),

            'inspections' => Inspection::with(['business', 'inspector'])
                ->latest('inspection_date')
                ->limit(5)
                ->get(),

            'renewals' => PermitRenewal::with(['business', 'previousPermit'])
                ->pending()
                ->latest('created_at')
                ->limit(5)
                ->get(),
        ];

        // Alerts and Notifications
        $alerts = [
            // Permits expiring in next 30 days
            'expiringPermits' => SanitaryPermit::with('business')
                ->where('status', 'Active')
                ->whereBetween('expiry_date', [now(), now()->addDays(30)])
                ->orderBy('expiry_date')
                ->limit(10)
                ->get(),

            // Businesses without active permits
            'businessesWithoutPermits' => Business::active()
                ->whereDoesntHave('sanitaryPermits', function ($query) {
                    $query->where('status', 'Active');
                })
                ->limit(10)
                ->get(),

            // Pending renewals requiring attention
            'pendingRenewals' => PermitRenewal::with(['business', 'previousPermit'])
                ->whereIn('renewal_status', ['Pending', 'Under Review'])
                ->orderBy('renewal_request_date')
                ->limit(10)
                ->get(),

            // Upcoming inspections (if follow-up dates are set)
            'upcomingInspections' => Inspection::with(['business', 'inspector'])
                ->whereNotNull('follow_up_date')
                ->where('follow_up_date', '>=', now())
                ->orderBy('follow_up_date')
                ->limit(10)
                ->get(),
        ];

        // User-specific data (for inspectors)
        $userData = [];
        if ($user->isSanitaryInspector() || $user->isMunicipalHealthOfficer()) {
            $userData = [
                'myInspections' => Inspection::where('inspector_id', $user->id)
                    ->whereMonth('inspection_date', now()->month)
                    ->count(),
                'myInspectionsTotal' => Inspection::where('inspector_id', $user->id)->count(),
                'myRecentInspections' => Inspection::with('business')
                    ->where('inspector_id', $user->id)
                    ->latest('inspection_date')
                    ->limit(5)
                    ->get(),
            ];
        }

        // Unread notifications for current user
        $notifications = Notification::where('user_id', $user->id)
            ->unread()
            ->latest('created_at')
            ->limit(10)
            ->get();

        // Compliance metrics
        $compliance = [
            'total_businesses' => Business::active()->count(),
            'compliant_businesses' => Business::active()
                ->whereHas('sanitaryPermits', function ($query) {
                    $query->where('status', 'Active');
                })
                ->count(),
        ];
        $compliance['compliance_rate'] = $compliance['total_businesses'] > 0
            ? round(($compliance['compliant_businesses'] / $compliance['total_businesses']) * 100, 2)
            : 0;

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'charts' => $charts,
            'recentActivities' => $recentActivities,
            'alerts' => $alerts,
            'userData' => $userData,
            'notifications' => $notifications,
            'compliance' => $compliance,
        ]);
    }
}
