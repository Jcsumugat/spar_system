<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        $query = Business::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                    ->orWhere('owner_name', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        if ($request->has('barangay') && $request->barangay !== 'all') {
            $query->where('barangay', $request->barangay);
        }

        if ($request->has('business_type') && $request->business_type !== 'all') {
            $query->where('business_type', $request->business_type);
        }

        $businesses = $query->withCount(['sanitaryPermits', 'inspections',])
            ->latest('created_at')
            ->paginate(15);

        $barangays = Business::distinct('barangay')->pluck('barangay');

        return Inertia::render('Businesses/Index', [
            'businesses' => $businesses,
            'barangays' => $barangays,
            'filters' => $request->only(['search', 'barangay', 'business_type']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Businesses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'business_type' => 'required|in:Food Establishment,Non-Food Establishment',
            'address' => 'required|string',
            'barangay' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'establishment_category' => 'nullable|string',
            'number_of_employees' => 'nullable|integer|min:0',
        ]);

        $business = Business::create($validated);

        ActivityLog::logActivity(
            'created',
            $business,
            'Created business ' . $business->business_name
        );

        return redirect()->route('businesses.show', $business)
            ->with('success', 'Business registered successfully.');
    }

    public function show(Business $business)
    {
        $business->load([
            'sanitaryPermits.issuedBy',
            'inspections.inspector',
        ]);

        return Inertia::render('Businesses/Show', [
            'business' => $business,
        ]);
    }

    public function edit(Business $business)
    {
        return Inertia::render('Businesses/Edit', [
            'business' => $business,
        ]);
    }

    public function update(Request $request, Business $business)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'business_type' => 'required|in:Food,Non-Food',
            'address' => 'required|string',
            'barangay' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'establishment_category' => 'nullable|string',
            'number_of_employees' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $oldData = $business->toArray();
        $business->update($validated);

        ActivityLog::logActivity(
            'updated',
            $business,
            'Updated business ' . $business->business_name,
            ['old' => $oldData, 'new' => $validated]
        );

        return redirect()->route('businesses.show', $business)
            ->with('success', 'Business updated successfully.');
    }

    public function destroy(Business $business)
    {
        $business->delete();

        ActivityLog::logActivity(
            'deleted',
            $business,
            'Deleted business ' . $business->business_name
        );

        return redirect()->route('businesses.index')
            ->with('success', 'Business deleted successfully.');
    }
}
