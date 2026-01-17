<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Business;
use App\Models\Inspection;
use App\Models\SanitaryPermit;
use App\Models\LabReport;
use App\Models\ActivityLog;
use App\Models\SavedReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reportType = $request->get('type', 'overview');

        $savedReports = [];
        if (class_exists(SavedReport::class)) {
            $savedReports = SavedReport::where('user_id', auth()->id())
                ->orWhere('is_shared', true)
                ->latest()
                ->get();
        }

        return Inertia::render('Reports/Index', [
            'reportType' => $reportType,
            'stats' => $this->getOverviewStats(),
            'savedReports' => $savedReports,
        ]);
    }

    public function businessReport(Request $request)
    {
        $query = Business::with(['sanitaryPermits' => function ($q) {
            $q->latest('issue_date'); // Get the most recent permit
        }]);

        // Add search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('business_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('owner_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('contact_number', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%')
                    ->orWhere('address', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->filled('business_type')) {
            $query->where('business_type', $request->business_type);
        }

        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Get all businesses first
        $businesses = $query->oldest('created_at')->get();

        // Map businesses to include their latest permit status
        $businessesData = $businesses->map(function ($business) {
            $latestPermit = $business->sanitaryPermits->first();

            // Determine the actual permit status
            $permitStatus = 'No Permit';
            if ($latestPermit) {
                $permitStatus = $latestPermit->status;
            }

            return [
                'id' => $business->id,
                'business_name' => $business->business_name,
                'owner_name' => $business->owner_name,
                'business_type' => $business->business_type,
                'address' => $business->address,
                'barangay' => $business->barangay,
                'contact_number' => $business->contact_number,
                'email' => $business->email,
                'establishment_category' => $business->establishment_category,
                'number_of_employees' => $business->number_of_employees,
                'permit_status' => $permitStatus,
                'created_at' => $business->created_at,
            ];
        });

        // Apply permit_status filter AFTER mapping
        if ($request->filled('permit_status')) {
            $businessesData = $businessesData->filter(function ($business) use ($request) {
                return $business['permit_status'] === $request->permit_status;
            })->values(); // Reset array keys
        }

        // Count active permits from sanitary_permits table
        $businessIds = $businesses->pluck('id');
        $activePermitsCount = \App\Models\SanitaryPermit::whereIn('business_id', $businessIds)
            ->where('status', 'Active')
            ->count();

        return response()->json([
            'data' => $businessesData,
            'summary' => [
                'total' => $businessesData->count(),
                'food_establishments' => $businessesData->where('business_type', 'Food Establishment')->count(),
                'non_food_establishments' => $businessesData->where('business_type', 'Non-Food Establishment')->count(),
                'active_permits' => $businessesData->where('permit_status', 'Active')->count(),
                'no_permit' => $businessesData->where('permit_status', 'No Permit')->count(),
            ]
        ]);
    }

    public function inspectionReport(Request $request)
    {
        $query = Inspection::with(['business', 'inspector']);

        // Add search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('inspection_number', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('business', function ($q) use ($searchTerm) {
                        $q->where('business_name', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if ($request->filled('result')) {
            $query->where('result', $request->result);
        }

        if ($request->filled('inspection_type')) {
            $query->where('inspection_type', $request->inspection_type);
        }

        if ($request->filled('inspector_id')) {
            $query->where('inspector_id', $request->inspector_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('inspection_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('inspection_date', '<=', $request->date_to);
        }

        $inspections = $query->oldest('inspection_date')->get();

        // Map the data to include flattened relationship fields
        $inspectionsData = $inspections->map(function ($inspection) {
            return [
                'id' => $inspection->id,
                'inspection_number' => $inspection->inspection_number,
                'business_id' => $inspection->business_id,
                'business_name' => $inspection->business->business_name ?? 'N/A',
                'inspection_date' => $inspection->inspection_date,
                'inspection_time' => $inspection->inspection_time,
                'inspector_id' => $inspection->inspector_id,
                'inspector_name' => $inspection->inspector->name ?? 'N/A',
                'inspection_type' => $inspection->inspection_type,
                'result' => $inspection->result,
                'findings' => $inspection->findings,
                'recommendations' => $inspection->recommendations,
                'created_at' => $inspection->created_at,
                'updated_at' => $inspection->updated_at,
            ];
        });

        return response()->json([
            'data' => $inspectionsData,
            'summary' => [
                'total' => $inspections->count(),
                'approved' => $inspections->where('result', 'Approved')->count(),
                'denied' => $inspections->where('result', 'Denied')->count(),
                'pending' => $inspections->where('result', 'Pending')->count(),
            ]
        ]);
    }

    private function getColumnHeaders($type)
    {
        switch ($type) {
            case 'business':
                return ['#', 'Business Name', 'Owner Name', 'Type', 'Address', 'Barangay', 'Contact', 'Email', 'Category', 'Employees', 'Status', 'Created'];
            case 'inspection':
                return ['Inspection Number', 'Business', 'Inspector', 'Date', 'Type', 'Result', 'Created At'];
            case 'permit':
                return ['Permit Number', 'Business', 'Type', 'Issue Date', 'Status', 'Created At'];
            case 'lab':
                return ['#', 'Business', 'Application Type', 'Submitted By', 'Status', 'Result', 'Submitted At'];
            case 'activity':
                return ['#', 'User', 'Action', 'Model', 'Description', 'IP Address', 'Created At'];
            default:
                return ['Data'];
        }
    }

    private function formatRowDataForExport($row, $type, $index = null)
    {
        switch ($type) {
            case 'business':
                return [
                    $index !== null ? $index + 1 : ($row->id ?? ''),
                    $row->business_name ?? 'N/A',
                    $row->owner_name ?? 'N/A',
                    $row->business_type ?? 'N/A',
                    $row->address ?? 'N/A',
                    $row->barangay ?? 'N/A',
                    $row->contact_number ?? 'N/A',
                    $row->email ?? 'N/A',
                    $row->establishment_category ?? 'N/A',
                    $row->number_of_employees ?? 'N/A',
                    $row->permit_status ?? 'N/A',
                    $row->created_at ?? 'N/A',
                ];

            case 'inspection':
                return [
                    $row->inspection_number ?? 'N/A',
                    $row->business->business_name ?? 'N/A',
                    $row->inspector->name ?? 'N/A',
                    $row->inspection_date ?? 'N/A',
                    $row->inspection_type ?? 'N/A',
                    $row->result ?? 'N/A',
                    $row->created_at ?? 'N/A',
                ];

            case 'permit':
                return [
                    $row->permit_number ?? 'N/A',
                    $row->business->business_name ?? 'N/A',
                    $row->permit_type ?? 'N/A',
                    $row->issue_date ?? 'N/A',
                    $row->status ?? 'N/A',
                    $row->created_at ?? 'N/A',
                ];

            case 'lab':
                return [
                    $index !== null ? $index + 1 : ($row->id ?? ''),
                    $row->business->business_name ?? 'N/A',
                    $row->application_type ?? 'N/A',
                    $row->submittedBy->name ?? 'N/A',
                    $row->status ?? 'N/A',
                    $row->overall_result ?? 'N/A',
                    $row->submitted_at ?? 'N/A',
                ];

            case 'activity':
                return [
                    $index !== null ? $index + 1 : ($row->id ?? ''),
                    $row->user->name ?? 'System',
                    $row->action ?? 'N/A',
                    $row->model_type ?? 'N/A',
                    $row->description ?? 'N/A',
                    $row->ip_address ?? 'N/A',
                    $row->created_at ?? 'N/A',
                ];

            default:
                return ['N/A'];
        }
    }

    public function permitReport(Request $request)
    {
        $query = SanitaryPermit::with(['business']);

        // Add search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('permit_number', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('business', function ($q) use ($searchTerm) {
                        $q->where('business_name', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('permit_type')) {
            $query->where('permit_type', $request->permit_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('issue_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('issue_date', '<=', $request->date_to);
        }

        if ($request->get('expiring_soon')) {
            $query->where('status', 'Active')
                ->whereBetween('expiry_date', [now(), now()->addDays(30)]);
        }

        $permits = $query->oldest('issue_date')->get();

        // Map the data to include flattened relationship fields
        $permitsData = $permits->map(function ($permit) {
            return [
                'id' => $permit->id,
                'permit_number' => $permit->permit_number,
                'business_id' => $permit->business_id,
                'business_name' => $permit->business->business_name ?? 'N/A',
                'permit_type' => $permit->permit_type,
                'issue_date' => $permit->issue_date,
                'expiry_date' => $permit->expiry_date,
                'status' => $permit->status,
                'issued_by' => $permit->issued_by,
                'approved_by' => $permit->approved_by,
                'remarks' => $permit->remarks,
                'created_at' => $permit->created_at,
                'updated_at' => $permit->updated_at,
            ];
        });

        return response()->json([
            'data' => $permitsData,
            'summary' => [
                'total' => $permits->count(),
                'active' => $permits->where('status', 'Active')->count(),
                'expired' => $permits->where('status', 'Expired')->count(),
                'expiring_soon' => $permits->where('status', 'Expiring Soon')->count(),
                'new_permits' => $permits->where('permit_type', 'New')->count(),
                'renewals' => $permits->where('permit_type', 'Renewal')->count(),
            ]
        ]);
    }

    public function labReport(Request $request)
    {
        $query = LabReport::with(['business', 'submittedBy', 'inspectedBy']);

        // Add search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->whereHas('business', function ($q) use ($searchTerm) {
                $q->where('business_name', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('application_type')) {
            $query->where('application_type', $request->application_type);
        }

        if ($request->filled('overall_result')) {
            $query->where('overall_result', $request->overall_result);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('submitted_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('submitted_at', '<=', $request->date_to);
        }

        $reports = $query->oldest('submitted_at')->get();
        $totalReports = $reports->count();

        // Map the data to include flattened relationship fields
        $reportsData = $reports->map(function ($report) {
            return [
                'id' => $report->id,
                'business_id' => $report->business_id,
                'business_name' => $report->business->business_name ?? 'N/A',
                'application_type' => $report->application_type,
                'submitted_by' => $report->submitted_by,
                'submitted_by_name' => $report->submittedBy->name ?? 'N/A',
                'inspected_by' => $report->inspected_by,
                'inspected_by_name' => $report->inspectedBy->name ?? 'N/A',
                'status' => $report->status,
                'overall_result' => $report->overall_result ?? ($report->status === 'pending' ? 'Pending' : 'N/A'),
                'fecalysis_result' => $report->fecalysis_result,
                'xray_sputum_result' => $report->xray_sputum_result,
                'receipt_result' => $report->receipt_result,
                'dti_result' => $report->dti_result,
                'submitted_at' => $report->submitted_at,
                'inspected_at' => $report->inspected_at,
                'created_at' => $report->created_at,
                'updated_at' => $report->updated_at,
            ];
        });

        return response()->json([
            'data' => $reportsData,
            'summary' => [
                'total' => $totalReports,
                'approved' => $reports->where('status', 'approved')->count(),
                'rejected' => $reports->where('status', 'rejected')->count(),
                'pending' => $reports->where('status', 'pending')->count(),
                'pass_rate' => $totalReports > 0 ? round(($reports->where('overall_result', 'pass')->count() / $totalReports) * 100, 2) : 0,
            ]
        ]);
    }

    public function activityReport(Request $request)
    {
        $query = ActivityLog::with(['user']);

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', '%' . $request->search . '%')
                    ->orWhere('action', 'like', '%' . $request->search . '%');
            });
        }

        $activities = $query->oldest()->limit(100)->get();

        // Map the data to include flattened relationship fields
        $activitiesData = $activities->map(function ($activity) {
            return [
                'id' => $activity->id,
                'user_id' => $activity->user_id,
                'user_name' => $activity->user->name ?? 'System',
                'action' => $activity->action,
                'model_type' => $activity->model_type,
                'model_id' => $activity->model_id,
                'description' => $activity->description,
                'changes' => $activity->changes,
                'ip_address' => $activity->ip_address,
                'created_at' => $activity->created_at,
                'updated_at' => $activity->updated_at,
            ];
        });

        return response()->json([
            'data' => $activitiesData,
            'summary' => [
                'total' => $activities->count(),
                'created' => $activities->where('action', 'created')->count(),
                'updated' => $activities->where('action', 'updated')->count(),
                'deleted' => $activities->where('action', 'deleted')->count(),
                'approved' => $activities->where('action', 'approved')->count(),
                'denied' => $activities->where('action', 'denied')->count(),
            ]
        ]);
    }

    public function barangayReport(Request $request)
    {
        $barangayStats = Business::selectRaw('barangay, COUNT(*) as total_businesses')
            ->selectRaw('SUM(CASE WHEN permit_status = "approved" THEN 1 ELSE 0 END) as active_permits')
            ->selectRaw('SUM(CASE WHEN permit_status = "pending" THEN 1 ELSE 0 END) as pending_permits')
            ->groupBy('barangay')
            ->get();

        return response()->json([
            'data' => $barangayStats,
            'summary' => [
                'total_barangays' => $barangayStats->count(),
                'total_businesses' => $barangayStats->sum('total_businesses'),
            ]
        ]);
    }

    public function monthlyTrends(Request $request)
    {
        $months = $request->get('months', 12);
        $startDate = Carbon::now()->subMonths($months);

        $businessTrends = Business::where('created_at', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $inspectionTrends = Inspection::where('inspection_date', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(inspection_date, "%Y-%m") as month, COUNT(*) as count')
            ->selectRaw('SUM(CASE WHEN result = "Approved" THEN 1 ELSE 0 END) as approved')
            ->selectRaw('SUM(CASE WHEN result = "Denied" THEN 1 ELSE 0 END) as denied')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $permitTrends = SanitaryPermit::where('issue_date', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(issue_date, "%Y-%m") as month, COUNT(*) as count')
            ->selectRaw('SUM(CASE WHEN permit_type = "New" THEN 1 ELSE 0 END) as new_permits')
            ->selectRaw('SUM(CASE WHEN permit_type = "Renewal" THEN 1 ELSE 0 END) as renewals')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'businesses' => $businessTrends,
            'inspections' => $inspectionTrends,
            'permits' => $permitTrends,
        ]);
    }

    private function getExportData($type, $filters)
    {
        $query = null;

        switch ($type) {
            case 'business':
                $query = Business::with(['sanitaryPermits' => function ($q) {
                    $q->latest('issue_date')->limit(1);
                }]);

                // ONLY apply filters if they have actual values (not empty strings)
                if (isset($filters['business_type']) && $filters['business_type'] !== '') {
                    $query->where('business_type', $filters['business_type']);
                }

                if (isset($filters['barangay']) && $filters['barangay'] !== '') {
                    $query->where('barangay', $filters['barangay']);
                }

                if (isset($filters['date_from']) && $filters['date_from'] !== '') {
                    $query->whereDate('created_at', '>=', $filters['date_from']);
                }

                if (isset($filters['date_to']) && $filters['date_to'] !== '') {
                    $query->whereDate('created_at', '<=', $filters['date_to']);
                }

                $businesses = $query->oldest('created_at')->get();

                return $businesses->map(function ($business) {
                    $latestPermit = $business->sanitaryPermits->first();
                    $permitStatus = 'No Permit';
                    if ($latestPermit) {
                        $permitStatus = $latestPermit->status;
                    }

                    $mapped = new \stdClass();
                    $mapped->id = $business->id;
                    $mapped->business_name = $business->business_name;
                    $mapped->owner_name = $business->owner_name;
                    $mapped->business_type = $business->business_type;
                    $mapped->address = $business->address;
                    $mapped->barangay = $business->barangay;
                    $mapped->contact_number = $business->contact_number;
                    $mapped->email = $business->email;
                    $mapped->establishment_category = $business->establishment_category;
                    $mapped->number_of_employees = $business->number_of_employees;
                    $mapped->permit_status = $permitStatus;
                    $mapped->created_at = $business->created_at ?
                        \Carbon\Carbon::parse($business->created_at)->format('m/d/Y') :
                        'N/A';

                    return $mapped;
                });

            case 'inspection':
                $query = Inspection::with(['business', 'inspector']);

                if (isset($filters['result']) && $filters['result'] !== '') {
                    $query->where('result', $filters['result']);
                }

                if (isset($filters['inspection_type']) && $filters['inspection_type'] !== '') {
                    $query->where('inspection_type', $filters['inspection_type']);
                }

                if (isset($filters['inspector_id']) && $filters['inspector_id'] !== '') {
                    $query->where('inspector_id', $filters['inspector_id']);
                }

                if (isset($filters['date_from']) && $filters['date_from'] !== '') {
                    $query->whereDate('inspection_date', '>=', $filters['date_from']);
                }

                if (isset($filters['date_to']) && $filters['date_to'] !== '') {
                    $query->whereDate('inspection_date', '<=', $filters['date_to']);
                }

                if (isset($filters['search']) && $filters['search'] !== '') {
                    $query->whereHas('business', function ($q) use ($filters) {
                        $q->where('business_name', 'like', '%' . $filters['search'] . '%');
                    });
                }

                $inspections = $query->oldest('inspection_date')->get();

                return $inspections->map(function ($inspection) {
                    $mapped = new \stdClass();
                    $mapped->inspection_number = $inspection->inspection_number;
                    $mapped->business = $inspection->business;
                    $mapped->inspector = $inspection->inspector;
                    $mapped->inspection_date = $inspection->inspection_date ?
                        \Carbon\Carbon::parse($inspection->inspection_date)->format('m/d/Y') :
                        'N/A';
                    $mapped->inspection_type = $inspection->inspection_type;
                    $mapped->result = $inspection->result;
                    $mapped->created_at = $inspection->created_at ?
                        \Carbon\Carbon::parse($inspection->created_at)->format('m/d/Y') :
                        'N/A';
                    return $mapped;
                });

            case 'permit':
                $query = SanitaryPermit::with(['business']);

                if (isset($filters['status']) && $filters['status'] !== '') {
                    $query->where('status', $filters['status']);
                }

                if (isset($filters['permit_type']) && $filters['permit_type'] !== '') {
                    $query->where('permit_type', $filters['permit_type']);
                }

                if (isset($filters['date_from']) && $filters['date_from'] !== '') {
                    $query->whereDate('issue_date', '>=', $filters['date_from']);
                }

                if (isset($filters['date_to']) && $filters['date_to'] !== '') {
                    $query->whereDate('issue_date', '<=', $filters['date_to']);
                }

                $permits = $query->oldest('issue_date')->get();

                return $permits->map(function ($permit) {
                    $mapped = new \stdClass();
                    $mapped->permit_number = $permit->permit_number;
                    $mapped->business = $permit->business;
                    $mapped->permit_type = $permit->permit_type;
                    $mapped->issue_date = $permit->issue_date ?
                        \Carbon\Carbon::parse($permit->issue_date)->format('m/d/Y') :
                        'N/A';
                    $mapped->status = $permit->status;
                    $mapped->created_at = $permit->created_at ?
                        \Carbon\Carbon::parse($permit->created_at)->format('m/d/Y') :
                        'N/A';
                    return $mapped;
                });

            case 'lab':
                $query = LabReport::with(['business', 'submittedBy']);

                if (isset($filters['status']) && $filters['status'] !== '') {
                    $query->where('status', $filters['status']);
                }

                if (isset($filters['application_type']) && $filters['application_type'] !== '') {
                    $query->where('application_type', $filters['application_type']);
                }

                if (isset($filters['overall_result']) && $filters['overall_result'] !== '') {
                    $query->where('overall_result', $filters['overall_result']);
                }

                if (isset($filters['date_from']) && $filters['date_from'] !== '') {
                    $query->whereDate('submitted_at', '>=', $filters['date_from']);
                }

                if (isset($filters['date_to']) && $filters['date_to'] !== '') {
                    $query->whereDate('submitted_at', '<=', $filters['date_to']);
                }

                $reports = $query->oldest('submitted_at')->get();

                return $reports->map(function ($report) {
                    $mapped = new \stdClass();
                    $mapped->id = $report->id;
                    $mapped->business = $report->business;
                    $mapped->application_type = $report->application_type;
                    $mapped->submittedBy = $report->submittedBy;
                    $mapped->status = $report->status;
                    $mapped->overall_result = $report->overall_result;
                    $mapped->submitted_at = $report->submitted_at ?
                        \Carbon\Carbon::parse($report->submitted_at)->format('m/d/Y') :
                        'N/A';
                    return $mapped;
                });

            case 'activity':
                $query = ActivityLog::with(['user']);

                if (isset($filters['action']) && $filters['action'] !== '') {
                    $query->where('action', $filters['action']);
                }

                if (isset($filters['user_id']) && $filters['user_id'] !== '') {
                    $query->where('user_id', $filters['user_id']);
                }

                if (isset($filters['date_from']) && $filters['date_from'] !== '') {
                    $query->whereDate('created_at', '>=', $filters['date_from']);
                }

                if (isset($filters['date_to']) && $filters['date_to'] !== '') {
                    $query->whereDate('created_at', '<=', $filters['date_to']);
                }

                $activities = $query->oldest()->limit(1000)->get();

                return $activities->map(function ($activity) {
                    $mapped = new \stdClass();
                    $mapped->id = $activity->id;
                    $mapped->user = $activity->user;
                    $mapped->action = $activity->action;
                    $mapped->model_type = $activity->model_type;
                    $mapped->description = $activity->description;
                    $mapped->ip_address = $activity->ip_address;
                    $mapped->created_at = $activity->created_at ?
                        \Carbon\Carbon::parse($activity->created_at)->format('m/d/Y') :
                        'N/A';
                    return $mapped;
                });

            default:
                return collect([]);
        }
    }

    private function generateFilename($type, $format)
    {
        $date = Carbon::now()->format('Y-m-d_His');
        return "{$type}_report_{$date}.{$format}";
    }
    private function exportCSV($data, $filename, $type)
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($data, $type) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Add headers based on report type
            $columns = $this->getColumnHeaders($type);
            fputcsv($file, $columns);

            // Add data rows with proper encoding
            $index = 0;
            foreach ($data as $row) {
                $rowData = $this->formatRowDataForExport($row, $type, $index);

                // Ensure all values are strings and properly encoded
                $rowData = array_map(function ($value) {
                    if (is_null($value)) {
                        return 'N/A';
                    }
                    // Convert to string and ensure UTF-8
                    return mb_convert_encoding((string)$value, 'UTF-8', 'UTF-8');
                }, $rowData);

                fputcsv($file, $rowData);
                $index++;
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportExcel($data, $filename, $type)
    {
        // You can integrate a library like PhpSpreadsheet for true Excel files
        return $this->exportCSV($data, str_replace('.excel', '.csv', $filename), $type);
    }

    public function saveReport(Request $request)
    {
        if (!class_exists(SavedReport::class)) {
            return response()->json(['error' => 'SavedReport model not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'report_type' => 'required|string',
            'filters' => 'nullable|array',
            'columns' => 'nullable|array',
            'is_shared' => 'boolean',
        ]);

        $report = SavedReport::create([
            'user_id' => auth()->id(),
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Report saved successfully',
            'report' => $report
        ]);
    }

    private function getOverviewStats(): array
    {
        return [
            'total_businesses' => Business::count(),
            'active_permits' => SanitaryPermit::where('status', 'active')->count(),
            'pending_inspections' => Inspection::where('result', 'Pending')->count(),
            'pending_lab_reports' => LabReport::where('status', 'pending')->count(),
            'expiring_permits' => SanitaryPermit::where('status', 'Expiring Soon')->count(),
            'this_month_businesses' => Business::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'this_month_inspections' => Inspection::whereMonth('inspection_date', now()->month)
                ->whereYear('inspection_date', now()->year)
                ->count(),
            'this_month_permits' => SanitaryPermit::whereMonth('issue_date', now()->month)
                ->whereYear('issue_date', now()->year)
                ->count(),
        ];
    }

    private function getColumnWidths($type)
    {
        switch ($type) {
            case 'inspection':
                return [
                    'A' => 10,
                    'B' => 20,
                    'C' => 35,
                    'D' => 25,
                    'E' => 15,
                    'F' => 15,
                    'G' => 12,
                    'H' => 12,
                    'I' => 20,
                ];
            case 'business':
                return [
                    'A' => 10,
                    'B' => 35,
                    'C' => 25,
                    'D' => 20,
                    'E' => 40,
                    'F' => 20,
                    'G' => 15,
                    'H' => 25,
                    'I' => 20,
                    'J' => 12,
                    'K' => 15,
                    'L' => 20,
                ];
            default:
                return [];
        }
    }

    public function export(Request $request)
    {
        try {
            $type = $request->get('type') ?? $request->input('type');
            $format = $request->get('format', 'csv') ?? $request->input('format', 'csv');

            // Handle filters from both GET and POST
            $filters = $request->get('filters', []);

            // Decode JSON string from GET requests
            if (is_string($filters)) {
                $filters = json_decode($filters, true) ?? [];
            }

            if (empty($filters)) {
                $filters = $request->input('filters', []);
                if (is_string($filters)) {
                    $filters = json_decode($filters, true) ?? [];
                }
            }

            // Get the data based on report type
            $data = $this->getExportData($type, $filters);

            // Generate filename
            $filename = $this->generateFilename($type, $format);

            // Export based on format
            switch ($format) {
                case 'csv':
                    return $this->exportCSV($data, $filename, $type);
                case 'excel':
                    return $this->exportExcel($data, $filename, $type);
                case 'word':
                case 'docx':
                    // Download Word document
                    return $this->exportWord($data, str_replace('.docx', '', $filename) . '.docx', $type);
                case 'pdf':
                    // Direct PDF download using DomPDF
                    return $this->exportPDF($data, str_replace('.pdf', '', $filename) . '.pdf', $type);
                case 'print':
                    // Print preview with auto-print dialog
                    return $this->exportPrintableHTML($data, $filename, $type, true);
                case 'html':
                    // HTML preview WITHOUT auto-print (for manual browser PDF)
                    return $this->exportPrintableHTML($data, $filename, $type, false);
                default:
                    return response()->json(['error' => 'Invalid format'], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Export failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'error' => 'Export failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function exportPDF($data, $filename, $type)
    {
        $reportTitle = strtoupper($type) . ' REPORT';
        $generatedDate = Carbon::now()->format('F d, Y h:i A');

        $inspectorName = 'Health Inspector';
        if (auth()->check() && auth()->user()) {
            $inspectorName = htmlspecialchars(auth()->user()->name);
        }

        $rowCount = count($data);

        // Create HTML for PDF
        $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                size: landscape;
                margin: 1cm;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Arial, sans-serif;
                font-size: 9px;
                color: #1a1a1a;
                line-height: 1.4;
            }

            .print-header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 3px solid #2563eb;
            }

            .print-header h1 {
                font-size: 20px;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 5px;
            }

            .print-header .subtitle {
                font-size: 10px;
                color: #64748b;
                margin-bottom: 10px;
            }

            .print-header h2 {
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
                margin: 8px 0 5px 0;
            }

            .print-header .meta {
                font-size: 9px;
                color: #64748b;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 8px;
            }

            th {
                background-color: #2563eb;
                color: white;
                font-weight: 600;
                text-align: left;
                padding: 8px 6px;
                border: 1px solid #2563eb;
                font-size: 8px;
                text-transform: uppercase;
            }

            td {
                padding: 6px;
                border: 1px solid #cbd5e1;
                color: #334155;
            }

            tr:nth-child(even) {
                background-color: #f8fafc;
            }

            .footer {
                margin-top: 30px;
            }

            .total-section {
                text-align: center;
                margin: 20px auto 40px auto;
                padding: 15px;
                background: #eff6ff;
                border: 2px solid #3b82f6;
                max-width: 300px;
            }

            .total-section .icon {
                font-size: 24px;
                margin-bottom: 5px;
            }

            .total-section .label {
                font-weight: 700;
                font-size: 14px;
                color: #1e40af;
            }

            .signature-section {
                text-align: right;
                padding-right: 60px;
                margin-top: 50px;
            }

            .signature-box {
                display: inline-block;
                text-align: center;
                min-width: 250px;
            }

            .signature-label {
                font-size: 9px;
                color: #64748b;
                margin-bottom: 25px;
                font-weight: 500;
                text-transform: uppercase;
                text-align: left;
                padding-left: 15px;
            }

            .signature-line {
                border-bottom: 1.5px solid #1e293b;
                margin: 0 auto 5px auto;
                width: 100px;
            }

            .signature-name {
                font-weight: 700;
                color: #1e293b;
                font-size: 12px;
            }

            .signature-title {
                font-weight: 600;
                color: #475569;
                font-size: 9px;
                text-transform: uppercase;
                margin-top: 3px;
            }
        </style>
    </head>
    <body>
        <div class="print-header">
            <h1>TIBIAO RURAL HEALTH UNIT</h1>
            <p class="subtitle">Sanitary Permit Certification System</p>
            <h2>' . $reportTitle . '</h2>
            <p class="meta">Generated on ' . $generatedDate . '</p>
        </div>

        <table>
            <thead>
                <tr>';

        // Add headers
        $headers = $this->getColumnHeaders($type);
        foreach ($headers as $header) {
            $html .= '<th>' . htmlspecialchars($header) . '</th>';
        }

        $html .= '</tr>
            </thead>
            <tbody>';

        // Add data rows
        foreach ($data as $index => $row) {
            $html .= '<tr>';
            $rowData = $this->formatRowDataForExport($row, $type, $index);

            foreach ($rowData as $cell) {
                $cellValue = is_null($cell) || $cell === '' ? 'N/A' : (string)$cell;
                $html .= '<td>' . htmlspecialchars($cellValue) . '</td>';
            }

            $html .= '</tr>';
        }

        $html .= '</tbody>
        </table>

        <div class="footer">
            <div class="total-section">
                <div class="icon">📊</div>
                <div class="label">Total Records: ' . $rowCount . '</div>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-label">Prepared by:</div>
                    <div class="signature-line">
                        <div class="signature-name">' . $inspectorName . '</div>
                    </div>
                    <div class="signature-title">Lab Inspector</div>
                </div>
            </div>
        </div>
    </body>
    </html>';

        // Generate PDF using DomPDF
        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('A4', 'landscape');

        // Return PDF download
        return $pdf->download($filename);
    }

    private function exportPrintableHTML($data, $filename, $type, $autoPrint = false)
    {
        $reportTitle = strtoupper($type) . ' REPORT';
        $generatedDate = Carbon::now()->format('F d, Y h:i A');

        $inspectorName = 'Health Inspector';
        if (auth()->check() && auth()->user()) {
            $inspectorName = htmlspecialchars(auth()->user()->name);
        }

        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($reportTitle) . '</title>
    <style>
        @media print {
            @page {
                size: landscape;
                margin: 0.5cm;
            }
            body {
                margin: 0;
                padding: 10px;
            }
            .no-print { display: none !important; }
            .print-header {
                border-bottom: 2px solid #000;
            }
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            thead {
                display: table-header-group;
            }
        }

        @media screen {
            body {
                background: #f5f5f5;
                padding: 20px;
            }
            .container {
                max-width: 1400px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            line-height: 1.5;
        }

        .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .print-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .print-header .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 15px;
        }

        .print-header h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 12px 0 8px 0;
        }

        .print-header .meta {
            font-size: 12px;
            color: #64748b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
        }

        th {
            background: linear-gradient(to bottom, #3b82f6, #2563eb);
            color: white;
            font-weight: 600;
            text-align: left;
            padding: 12px 10px;
            border: 1px solid #2563eb;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 10px;
            border: 1px solid #cbd5e1;
            color: #334155;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tr:hover {
            background-color: #eff6ff;
        }

       .footer {
            margin-top: 50px;
            page-break-inside: avoid;
        }

        .total-section {
            text-align: center;
            margin: 30px auto 60px auto;
            padding: 20px;
            background: #eff6ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            max-width: 400px;
        }

        .total-section .icon {
            font-size: 32px;
            margin-bottom: 8px;
        }

        .total-section .label {
            font-weight: 700;
            font-size: 16px;
            color: #1e40af;
        }

        .signature-section {
            display: flex;
            justify-content: flex-end;
            padding-right: 60px;
            margin-top: 80px;
        }

        .signature-box {
            text-align: center;
            min-width: 320px;
        }

        .signature-label {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 35px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
            padding-left: 20px;
        }

        .signature-line {
            border-bottom: 1.5px solid #1e293b;
            margin: 0 auto 8px auto;
            width: 125px;
        }

        .signature-name {
            font-weight: 700;
            color: #1e293b;
            font-size: 15px;
            padding-bottom: 1px;
        }

        .signature-title {
            font-weight: 600;
            color: #475569;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-top: 5px;
        }

        /* Print Button Styling */
        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
        }

        .print-btn {
            padding: 12px 24px;
            background: linear-gradient(to bottom, #3b82f6, #2563eb);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .print-btn:hover {
            background: linear-gradient(to bottom, #2563eb, #1d4ed8);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
            transform: translateY(-1px);
        }

        .print-btn:active {
            transform: translateY(0);
        }

        .close-btn {
            background: linear-gradient(to bottom, #64748b, #475569);
            padding: 12px 20px;
        }

        .close-btn:hover {
            background: linear-gradient(to bottom, #475569, #334155);
        }

        /* Loading animation */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .container {
            animation: fadeIn 0.3s ease-out;
        }
    </style>
</head>
<body>
    <div class="print-controls no-print">
        <button class="print-btn" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save as PDF
        </button>
        <button class="close-btn print-btn" onclick="window.close()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
        </button>
    </div>

    <div class="container">
        <div class="print-header">
            <h1>TIBIAO RURAL HEALTH UNIT</h1>
            <p class="subtitle">Sanitary Permit Certification System</p>
            <h2>' . $reportTitle . '</h2>
            <p class="meta">Generated on ' . $generatedDate . '</p>
        </div>

        <table>
            <thead>
                <tr>';

        // Add headers
        $headers = $this->getColumnHeaders($type);
        foreach ($headers as $header) {
            $html .= '<th>' . htmlspecialchars($header) . '</th>';
        }

        $html .= '</tr>
            </thead>
            <tbody>';

        // Add data rows
        $rowCount = 0;
        foreach ($data as $index => $row) {
            $html .= '<tr>';
            $rowData = $this->formatRowDataForExport($row, $type, $index);

            foreach ($rowData as $cell) {
                $cellValue = is_null($cell) || $cell === '' ? 'N/A' : (string)$cell;
                $html .= '<td>' . htmlspecialchars($cellValue) . '</td>';
            }

            $html .= '</tr>';
            $rowCount++;
        }

        $html .= '</tbody>
        </table>

        <div class="footer">
            <div class="total-section">
                <div class="icon">📊</div>
                <div class="label">Total Records: ' . $rowCount . '</div>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-label">Prepared by:</div>
                    <div class="signature-line">
                        <div class="signature-name">' . $inspectorName . '</div>
                    </div>
                    <div class="signature-title">Lab Inspector</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Auto-trigger print dialog when page loads (only if autoPrint is enabled)
        ' . ($autoPrint ? '
        window.addEventListener("load", function() {
            // Small delay to ensure page is fully rendered
            setTimeout(function() {
                window.print();
            }, 500);
        });
        ' : '') . '

        // Add keyboard shortcut for print
        document.addEventListener("keydown", function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === "p") {
                e.preventDefault();
                window.print();
            }
        });

        // Optional: Close window after printing is cancelled or completed
        window.addEventListener("afterprint", function() {
            // You can uncomment this if you want the window to close after printing
            // window.close();
        });
    </script>
</body>
</html>';

        return response($html)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Content-Disposition', 'inline; filename="' . str_replace('.pdf', '.html', $filename) . '"');
    }

    private function exportWord($data, $filename, $type)
    {
        // Create new Word document
        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        // Set document properties
        $properties = $phpWord->getDocInfo();
        $properties->setCreator('Tibiao Rural Health Unit');
        $properties->setTitle(strtoupper($type) . ' REPORT');

        // Add section with landscape orientation
        $section = $phpWord->addSection([
            'orientation' => 'landscape',
            'marginTop' => 720,
            'marginBottom' => 720,
            'marginLeft' => 720,
            'marginRight' => 720,
        ]);

        // Add header
        $header = $section->addHeader();
        $header->addText(
            'TIBIAO RURAL HEALTH UNIT',
            ['bold' => true, 'size' => 16, 'color' => '1e40af'],
            ['alignment' => 'center']
        );
        $header->addText(
            'Sanitary Permit Certification System',
            ['size' => 10, 'color' => '64748b'],
            ['alignment' => 'center']
        );
        $header->addText(
            strtoupper($type) . ' REPORT',
            ['bold' => true, 'size' => 14],
            ['alignment' => 'center', 'spaceAfter' => 240]
        );
        $header->addText(
            'Generated on ' . Carbon::now()->format('F d, Y h:i A'),
            ['size' => 9, 'color' => '64748b'],
            ['alignment' => 'center', 'spaceAfter' => 240]
        );

        // Add table
        $table = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '2563eb',
            'cellMargin' => 80,
            'width' => 100 * 50, // 100% width
            'unit' => 'pct'
        ]);

        // Add table headers
        $headers = $this->getColumnHeaders($type);
        $table->addRow(400);
        foreach ($headers as $header) {
            $table->addCell(null, ['bgColor' => '2563eb'])
                ->addText(
                    htmlspecialchars($header),
                    ['bold' => true, 'size' => 9, 'color' => 'FFFFFF'],
                    ['alignment' => 'center']
                );
        }

        // Add data rows
        $rowCount = 0;
        foreach ($data as $index => $row) {
            $table->addRow();
            $rowData = $this->formatRowDataForExport($row, $type, $index);

            foreach ($rowData as $cell) {
                $cellValue = is_null($cell) || $cell === '' ? 'N/A' : (string)$cell;
                $table->addCell()->addText(
                    htmlspecialchars($cellValue),
                    ['size' => 9]
                );
            }
            $rowCount++;
        }

        // Add footer with total records
        $section->addTextBreak(2);
        $section->addText(
            '📊 Total Records: ' . $rowCount,
            ['bold' => true, 'size' => 12, 'color' => '1e40af'],
            ['alignment' => 'center']
        );

        // Add signature section
        $section->addTextBreak(3);

        $inspectorName = 'Health Inspector';
        if (auth()->check() && auth()->user()) {
            $inspectorName = auth()->user()->name;
        }

        $textRun = $section->addTextRun(['alignment' => 'right']);
        $textRun->addText('Prepared by:', ['size' => 9, 'color' => '64748b']);

        $section->addTextBreak(2);

        $section->addText(
            str_repeat('_', 40),
            ['size' => 10],
            ['alignment' => 'right']
        );

        $section->addText(
            $inspectorName,
            ['bold' => true, 'size' => 11],
            ['alignment' => 'right']
        );

        $section->addText(
            'LAB INSPECTOR',
            ['bold' => true, 'size' => 9, 'color' => '475569'],
            ['alignment' => 'right']
        );

        // Save to temp file and download
        $tempFile = tempnam(sys_get_temp_dir(), 'report_');
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ])->deleteFileAfterSend(true);
    }
}
