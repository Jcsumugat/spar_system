<?php

namespace App\Http\Controllers;

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
        $query = Business::query();

        if ($request->filled('business_type')) {
            $query->where('business_type', $request->business_type);
        }

        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        if ($request->filled('permit_status')) {
            $query->where('permit_status', $request->permit_status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $businesses = $query->latest()->get();

        return response()->json([
            'data' => $businesses,
            'summary' => [
                'total' => $businesses->count(),
                'food_establishments' => $businesses->where('business_type', 'Food Establishment')->count(),
                'non_food_establishments' => $businesses->where('business_type', 'Non-Food Establishment')->count(),
                'active_permits' => $businesses->where('permit_status', 'approved')->count(),
                'pending' => $businesses->where('permit_status', 'pending')->count(),
            ]
        ]);
    }

    public function inspectionReport(Request $request)
    {
        $query = Inspection::with(['business', 'inspector']);

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

        if ($request->filled('search')) {
            $query->whereHas('business', function ($q) use ($request) {
                $q->where('business_name', 'like', '%' . $request->search . '%');
            });
        }

        $inspections = $query->latest('inspection_date')->get();

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
                'overall_score' => $inspection->overall_score,
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
                'average_score' => round($inspections->where('overall_score', '>', 0)->avg('overall_score'), 2),
            ]
        ]);
    }

    public function permitReport(Request $request)
    {
        $query = SanitaryPermit::with(['business']);

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

        if ($request->filled('search')) {
            $query->whereHas('business', function ($q) use ($request) {
                $q->where('business_name', 'like', '%' . $request->search . '%');
            });
        }

        $permits = $query->latest('issue_date')->get();

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

        if ($request->filled('search')) {
            $query->whereHas('business', function ($q) use ($request) {
                $q->where('business_name', 'like', '%' . $request->search . '%');
            });
        }

        $reports = $query->latest('submitted_at')->get();
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

        $activities = $query->latest()->limit(100)->get();

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

    public function export(Request $request)
    {
        $type = $request->get('type');
        $format = $request->get('format', 'csv');
        $filters = $request->get('filters', []);

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
            case 'pdf':
                return $this->exportPDF($data, $filename, $type);
            default:
                return response()->json(['error' => 'Invalid format'], 400);
        }
    }

    private function getExportData($type, $filters)
    {
        $query = null;

        switch ($type) {
            case 'business':
                $query = Business::query();
                if (isset($filters['date_from'])) {
                    $query->whereDate('created_at', '>=', $filters['date_from']);
                }
                if (isset($filters['date_to'])) {
                    $query->whereDate('created_at', '<=', $filters['date_to']);
                }
                return $query->get();

            case 'inspection':
                $query = Inspection::with(['business', 'inspector']);
                if (isset($filters['date_from'])) {
                    $query->whereDate('inspection_date', '>=', $filters['date_from']);
                }
                if (isset($filters['date_to'])) {
                    $query->whereDate('inspection_date', '<=', $filters['date_to']);
                }
                if (isset($filters['search']) && !empty($filters['search'])) {
                    $query->whereHas('business', function ($q) use ($filters) {
                        $q->where('business_name', 'like', '%' . $filters['search'] . '%');
                    });
                }
                return $query->latest('inspection_date')->get();

            case 'permit':
                $query = SanitaryPermit::with(['business']);
                if (isset($filters['date_from'])) {
                    $query->whereDate('issue_date', '>=', $filters['date_from']);
                }
                if (isset($filters['date_to'])) {
                    $query->whereDate('issue_date', '<=', $filters['date_to']);
                }
                return $query->get();

            case 'lab':
                $query = LabReport::with(['business', 'submittedBy']);
                if (isset($filters['date_from'])) {
                    $query->whereDate('submitted_at', '>=', $filters['date_from']);
                }
                if (isset($filters['date_to'])) {
                    $query->whereDate('submitted_at', '<=', $filters['date_to']);
                }
                return $query->get();

            case 'activity':
                $query = ActivityLog::with(['user']);
                if (isset($filters['date_from'])) {
                    $query->whereDate('created_at', '>=', $filters['date_from']);
                }
                if (isset($filters['date_to'])) {
                    $query->whereDate('created_at', '<=', $filters['date_to']);
                }
                return $query->limit(1000)->get();

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
            foreach ($data as $row) {
                $rowData = $this->formatRowData($row, $type);

                // Ensure all values are strings and properly encoded
                $rowData = array_map(function ($value) {
                    if (is_null($value)) {
                        return 'N/A';
                    }
                    // Convert to string and ensure UTF-8
                    return mb_convert_encoding((string)$value, 'UTF-8', 'UTF-8');
                }, $rowData);

                fputcsv($file, $rowData);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportExcel($data, $filename, $type)
    {
        // For now, we'll export as CSV with .xlsx extension
        // You can integrate a library like PhpSpreadsheet for true Excel files
        return $this->exportCSV($data, str_replace('.excel', '.csv', $filename), $type);
    }

    private function exportPDF($data, $filename, $type)
    {
        // Generate HTML for PDF
        $html = $this->generatePDFHTML($data, $type);

        // For now, return HTML that can be printed as PDF
        // You can integrate libraries like DomPDF or TCPDF for true PDF generation
        $headers = [
            'Content-Type' => 'text/html',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ];

        return response($html, 200, $headers);
    }

    private function getColumnHeaders($type)
    {
        switch ($type) {
            case 'business':
                return ['ID', 'Business Name', 'Owner Name', 'Type', 'Address', 'Barangay', 'Contact', 'Email', 'Category', 'Employees', 'Status', 'Created At'];

            case 'inspection':
                return ['ID', 'Inspection Number', 'Business', 'Inspector', 'Date', 'Type', 'Result', 'Score', 'Created At'];

            case 'permit':
                return ['ID', 'Permit Number', 'Business', 'Type', 'Issue Date', 'Expiry Date', 'Status', 'Created At'];

            case 'lab':
                return ['ID', 'Business', 'Application Type', 'Submitted By', 'Status', 'Result', 'Submitted At'];

            case 'activity':
                return ['ID', 'User', 'Action', 'Model', 'Description', 'IP Address', 'Created At'];

            default:
                return ['Data'];
        }
    }

    private function formatRowData($row, $type)
    {
        switch ($type) {
            case 'business':
                return [
                    $row->id,
                    $row->business_name,
                    $row->owner_name,
                    $row->business_type,
                    $row->address,
                    $row->barangay,
                    $row->contact_number,
                    $row->email ?? 'N/A',
                    $row->establishment_category,
                    $row->number_of_employees,
                    $row->permit_status,
                    $row->created_at,
                ];

            case 'inspection':
                return [
                    $row->id,
                    $row->inspection_number,
                    $row->business->business_name ?? 'N/A',
                    $row->inspector->name ?? 'N/A',
                    $row->inspection_date ? \Carbon\Carbon::parse($row->inspection_date)->format('Y-m-d') : 'N/A',
                    $row->inspection_type,
                    $row->result,
                    $row->overall_score ?? 'N/A',
                    $row->created_at ? \Carbon\Carbon::parse($row->created_at)->format('Y-m-d H:i:s') : 'N/A',
                ];

            case 'permit':
                return [
                    $row->id,
                    $row->permit_number,
                    $row->business->business_name ?? 'N/A',
                    $row->permit_type,
                    $row->issue_date,
                    $row->expiry_date,
                    $row->status,
                    $row->created_at,
                ];

            case 'lab':
                return [
                    $row->id,
                    $row->business->business_name ?? 'N/A',
                    $row->application_type,
                    $row->submittedBy->name ?? 'N/A',
                    $row->status,
                    $row->overall_result ?? 'N/A',
                    $row->submitted_at,
                ];

            case 'activity':
                return [
                    $row->id,
                    $row->user->name ?? 'System',
                    $row->action,
                    $row->model_type,
                    $row->description,
                    $row->ip_address ?? 'N/A',
                    $row->created_at,
                ];

            default:
                return [$row];
        }
    }

    private function generatePDFHTML($data, $type)
    {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>' . ucfirst($type) . ' Report</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { margin: 0; color: #2563eb; }
                .header p { margin: 5px 0; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #2563eb; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Tibiao Rural Health Unit</h1>
                <p>Sanitary Permit Certification System</p>
                <h2>' . ucfirst($type) . ' Report</h2>
                <p>Generated on: ' . Carbon::now()->format('F d, Y h:i A') . '</p>
            </div>

            <table>
                <thead>
                    <tr>';

        foreach ($this->getColumnHeaders($type) as $header) {
            $html .= '<th>' . htmlspecialchars($header) . '</th>';
        }

        $html .= '</tr></thead><tbody>';

        foreach ($data as $row) {
            $html .= '<tr>';
            foreach ($this->formatRowData($row, $type) as $cell) {
                $html .= '<td>' . htmlspecialchars($cell) . '</td>';
            }
            $html .= '</tr>';
        }

        $html .= '</tbody></table>

            <div class="footer">
                <p>This is a computer-generated report from the Sanitary Permit Certification System</p>
                <p>Total Records: ' . count($data) . '</p>
            </div>
        </body>
        </html>';

        return $html;
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
            'active_permits' => SanitaryPermit::where('status', 'Active')->count(),
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
}
