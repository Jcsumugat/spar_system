<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\LabReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect()->route('login');
});


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('businesses')->name('businesses.')->group(function () {
        Route::get('/', [BusinessController::class, 'index'])->name('index');
        Route::get('/create', [BusinessController::class, 'create'])->name('create');
        Route::post('/', [BusinessController::class, 'store'])->name('store');
        Route::get('/{business}/edit', [BusinessController::class, 'edit'])->name('edit');
        Route::put('/{business}', [BusinessController::class, 'update'])->name('update');
        Route::delete('/{business}', [BusinessController::class, 'destroy'])->name('destroy');
        Route::get('/{business}', [BusinessController::class, 'show'])->name('show');
    });

    Route::prefix('lab-reports')->name('lab-reports.')->group(function () {
        Route::get('/', [LabReportController::class, 'index'])->name('index');
        Route::get('/inspection/queue', [LabReportController::class, 'inspectionQueue'])->name('inspection.queue');
        Route::get('/create', [LabReportController::class, 'create'])->name('create');
        Route::post('/', [LabReportController::class, 'store'])->name('store');
        Route::get('/{labReport}/edit', [LabReportController::class, 'edit'])->name('edit');
        Route::put('/{labReport}', [LabReportController::class, 'update'])->name('update');
        Route::delete('/{labReport}', [LabReportController::class, 'destroy'])->name('destroy');
        Route::post('/{labReport}/approve', [LabReportController::class, 'approve'])->name('approve');
        Route::get('/{labReport}', [LabReportController::class, 'show'])->name('show');
    });

    Route::prefix('permits')->name('permits.')->group(function () {
        Route::get('/', [PermitController::class, 'index'])->name('index');
        Route::get('/create', [PermitController::class, 'create'])->name('create');
        Route::post('/', [PermitController::class, 'store'])->name('store');
        Route::get('/businesses/{business}/print-statistics', [PermitController::class, 'getPrintStatistics'])
            ->name('businesses.print-statistics');
        Route::get('/{permit}', [PermitController::class, 'show'])->name('show');
        Route::get('/{permit}/print', [PermitController::class, 'print'])->name('print');
        Route::post('/{permit}/log-print', [PermitController::class, 'logPrint'])->name('log-print');
        Route::delete('/{permit}', [PermitController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('inspections')->name('inspections.')->group(function () {
        Route::get('/', [InspectionController::class, 'index'])->name('index');

        Route::middleware('admin')->group(function () {
            Route::get('/create', [InspectionController::class, 'create'])->name('create');
            Route::post('/', [InspectionController::class, 'store'])->name('store');
            Route::get('/{inspection}/edit', [InspectionController::class, 'edit'])->name('edit');
            Route::put('/{inspection}', [InspectionController::class, 'update'])->name('update');
            Route::delete('/{inspection}', [InspectionController::class, 'destroy'])->name('destroy');
            Route::post('/{inspection}/save-progress', [InspectionController::class, 'saveProgress'])->name('save-progress');
            Route::post('/{inspection}/pass', [InspectionController::class, 'pass'])->name('pass');
            Route::post('/{inspection}/fail', [InspectionController::class, 'fail'])->name('fail');
        });

        Route::get('/{inspection}', [InspectionController::class, 'show'])->name('show');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread', [NotificationController::class, 'getUnread'])->name('unread');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    // Reports routes - moved here, inside the main auth group
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/business', [ReportController::class, 'businessReport'])->name('business');
        Route::get('/inspection', [ReportController::class, 'inspectionReport'])->name('inspection');
        Route::get('/permit', [ReportController::class, 'permitReport'])->name('permit');
        Route::get('/lab', [ReportController::class, 'labReport'])->name('lab');
        Route::get('/activity', [ReportController::class, 'activityReport'])->name('activity');
        Route::get('/barangay', [ReportController::class, 'barangayReport'])->name('barangay');
        Route::get('/trends', [ReportController::class, 'monthlyTrends'])->name('trends');
        Route::post('/export', [ReportController::class, 'export'])->name('export');
        Route::post('/save', [ReportController::class, 'saveReport'])->name('save');
    });

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::put('/', [SettingsController::class, 'update'])->name('update');
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::post('/verify', [ProfileVerificationController::class, 'verify'])->name('verify');
        Route::get('/check-verification', [ProfileVerificationController::class, 'checkVerification'])->name('check-verification');
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
    });
});

require __DIR__ . '/auth.php';
