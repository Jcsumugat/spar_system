<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LabReportController;
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

    // Dashboard
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
        Route::get('/{business}', [BusinessController::class, 'show'])->name('show');
        Route::get('/{business}/edit', [BusinessController::class, 'edit'])->name('edit');
        Route::put('/{business}', [BusinessController::class, 'update'])->name('update');
        Route::delete('/{business}', [BusinessController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Lab Report Management
    |--------------------------------------------------------------------------
    */
    Route::prefix('lab-reports')->name('lab-reports.')->group(function () {
        Route::get('/', [LabReportController::class, 'index'])->name('index');
        Route::get('/create', [LabReportController::class, 'create'])->name('create');
        Route::post('/', [LabReportController::class, 'store'])->name('store');
        Route::get('/{labReport}', [LabReportController::class, 'show'])->name('show');
        Route::get('/{labReport}/edit', [LabReportController::class, 'edit'])->name('edit');
        Route::put('/{labReport}', [LabReportController::class, 'update'])->name('update');
        Route::delete('/{labReport}', [LabReportController::class, 'destroy'])->name('destroy');

        // Lab Inspector Actions
        Route::get('/inspection/queue', [LabReportController::class, 'inspectionQueue'])->name('inspection.queue');
        Route::post('/{labReport}/approve', [LabReportController::class, 'approve'])->name('approve');
        Route::post('/{labReport}/reject', [LabReportController::class, 'reject'])->name('reject');
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
        Route::get('/{permit}', [PermitController::class, 'show'])->name('show');
        Route::get('/{permit}/edit', [PermitController::class, 'edit'])->name('edit');
        Route::put('/{permit}', [PermitController::class, 'update'])->name('update');
        Route::delete('/{permit}', [PermitController::class, 'destroy'])->name('destroy');

        // Permit Actions
        Route::post('/{permit}/approve', [PermitController::class, 'approve'])->name('approve');
        Route::post('/{permit}/reject', [PermitController::class, 'reject'])->name('reject');
        Route::get('/{permit}/print', [PermitController::class, 'print'])->name('print');
    });

    /*
    |--------------------------------------------------------------------------
    | Inspection Management
    |--------------------------------------------------------------------------
    */
    Route::prefix('inspections')->name('inspections.')->group(function () {
        Route::get('/', [InspectionController::class, 'index'])->name('index');
        Route::get('/create', [InspectionController::class, 'create'])->name('create');
        Route::post('/', [InspectionController::class, 'store'])->name('store');
        Route::get('/{inspection}', [InspectionController::class, 'show'])->name('show');
        Route::get('/{inspection}/edit', [InspectionController::class, 'edit'])->name('edit');
        Route::put('/{inspection}', [InspectionController::class, 'update'])->name('update');
        Route::delete('/{inspection}', [InspectionController::class, 'destroy'])->name('destroy');
        Route::post('/{inspection}/approve', [InspectionController::class, 'approve'])->name('approve');
        Route::post('/{inspection}/reject', [InspectionController::class, 'reject'])->name('reject');
        Route::post('/inspections/{inspection}/save-progress', [InspectionController::class, 'saveProgress'])
            ->name('inspections.save-progress');
        Route::post('/inspections/{inspection}/pass', [InspectionController::class, 'pass'])
            ->name('inspections.pass');
        Route::post('/inspections/{inspection}/fail', [InspectionController::class, 'fail'])
            ->name('inspections.fail');
    });


    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/businesses', [ReportController::class, 'businesses'])->name('businesses');
        Route::get('/permits', [ReportController::class, 'permits'])->name('permits');
        Route::get('/inspections', [ReportController::class, 'inspections'])->name('inspections');
        Route::get('/violations', [ReportController::class, 'violations'])->name('violations');
        Route::get('/compliance', [ReportController::class, 'compliance'])->name('compliance');
        Route::post('/export', [ReportController::class, 'export'])->name('export');
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
