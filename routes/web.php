<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\LabReportController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Business Management
    |--------------------------------------------------------------------------
    */
    Route::prefix('businesses')->name('businesses.')->group(function () {
        Route::get('/', [BusinessController::class, 'index'])->name('index');
        Route::get('/create', [BusinessController::class, 'create'])->name('create');
        Route::post('/', [BusinessController::class, 'store'])->name('store');
        Route::get('/{business}/edit', [BusinessController::class, 'edit'])->name('edit');
        Route::put('/{business}', [BusinessController::class, 'update'])->name('update');
        Route::delete('/{business}', [BusinessController::class, 'destroy'])->name('destroy');


        Route::get('/{business}', [BusinessController::class, 'show'])->name('show');
    });

    /*
    |--------------------------------------------------------------------------
    | Lab Report Management
    |--------------------------------------------------------------------------
    */
    Route::prefix('lab-reports')->name('lab-reports.')->group(function () {
        // Public routes (both admin and staff can access)
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

    /*
|--------------------------------------------------------------------------
| Permit Management
|--------------------------------------------------------------------------
*/
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

    /*
    |--------------------------------------------------------------------------
    | Inspection Management
    |--------------------------------------------------------------------------
    */
    Route::prefix('inspections')->name('inspections.')->group(function () {
        // Public routes (both admin and staff can access)
        Route::get('/', [InspectionController::class, 'index'])->name('index');
        Route::get('/{inspection}', [InspectionController::class, 'show'])->name('show');

        // Admin-only routes
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
    });

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread', [NotificationController::class, 'getUnread'])->name('unread');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Settings/Configuration
    |--------------------------------------------------------------------------
    */
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::put('/', [SettingsController::class, 'update'])->name('update');
    });

    /*
    |--------------------------------------------------------------------------
    | User Profile
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
