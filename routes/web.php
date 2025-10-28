<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\RenewalController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Businesses
    Route::resource('businesses', BusinessController::class);

    // Permits
    Route::resource('permits', PermitController::class);
    Route::post('permits/{permit}/approve', [PermitController::class, 'approve'])->name('permits.approve');
    Route::post('permits/{permit}/reject', [PermitController::class, 'reject'])->name('permits.reject');
    Route::get('permits/{permit}/print', [PermitController::class, 'print'])->name('permits.print');

    // Inspections (we'll create this next)
    Route::resource('inspections', InspectionController::class);

    // Renewals (we'll create this next)
    Route::resource('renewals', RenewalController::class);

    // Reports (we'll create this next)
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
