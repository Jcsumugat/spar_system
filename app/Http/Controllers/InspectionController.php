<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\User;
use App\Models\InspectionChecklistItem;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InspectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Inspection::with(['business', 'inspector', 'permit']);

        // Filters
        if ($request->has('result') && $request->result !== 'all') {
            $query->where('result', $request->result);
        }

        if ($request->has('inspection_type') && $request->inspection_type !== 'all') {
            $query->where('inspection_type', $request->inspection_type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('inspection_number', 'like', "%{$search}%")
                    ->orWhereHas('business', function ($q) use ($search) {
                        $q->where('business_name', 'like', "%{$search}%");
                    });
            });
        }

        $inspections = $query->latest('inspection_date')->paginate(15);

        return Inertia::render('Inspections/Index', [
            'inspections' => $inspections,
            'filters' => $request->only(['result', 'inspection_type', 'search']),
        ]);
    }

    public function create()
    {
        $businesses = Business::active()->get(['id', 'business_name']);
        $inspectors = User::inspectors()->active()->get(['id', 'name']);
        $permits = SanitaryPermit::with('business')->get();

        return Inertia::render('Inspections/Create', [
            'businesses' => $businesses,
            'inspectors' => $inspectors,
            'permits' => $permits,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_id' => 'nullable|exists:sanitary_permits,id',
            'inspection_date' => 'required|date',
            'inspection_time' => 'nullable|date_format:H:i',
            'inspector_id' => 'required|exists:users,id',
            'inspection_type' => 'required|in:Initial,Renewal,Follow-up,Complaint-based,Random',
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
        ]);

        $validated['inspection_number'] = Inspection::generateInspectionNumber();
        $validated['result'] = 'Pending';

        $inspection = Inspection::create($validated);

        // Generate default checklist items
        $this->generateChecklistItems($inspection);

        ActivityLog::logActivity(
            'created',
            $inspection,
            'Created inspection ' . $inspection->inspection_number
        );

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection created successfully.');
    }

    public function show(Inspection $inspection)
    {
        $inspection->load([
            'business',
            'inspector',
            'permit',
            'checklistItems',
            'violations',
            'documents.uploader'
        ]);

        return Inertia::render('Inspections/Show', [
            'inspection' => $inspection,
        ]);
    }

    public function edit(Inspection $inspection)
    {
        $businesses = Business::active()->get(['id', 'business_name']);
        $inspectors = User::inspectors()->active()->get(['id', 'name']);
        $permits = SanitaryPermit::with('business')->get();

        return Inertia::render('Inspections/Edit', [
            'inspection' => $inspection->load('checklistItems'),
            'businesses' => $businesses,
            'inspectors' => $inspectors,
            'permits' => $permits,
        ]);
    }

    public function update(Request $request, Inspection $inspection)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'permit_id' => 'nullable|exists:sanitary_permits,id',
            'inspection_date' => 'required|date',
            'inspection_time' => 'nullable|date_format:H:i',
            'inspector_id' => 'required|exists:users,id',
            'inspection_type' => 'required|in:Initial,Renewal,Follow-up,Complaint-based,Random',
            'result' => 'required|in:Passed,Passed with Conditions,Failed,Pending',
            'findings' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'follow_up_date' => 'nullable|date|after:inspection_date',
            'checklist_items' => 'nullable|array',
        ]);

        $oldData = $inspection->toArray();

        // Update checklist items if provided
        if (isset($validated['checklist_items'])) {
            foreach ($validated['checklist_items'] as $item) {
                InspectionChecklistItem::updateOrCreate(
                    ['id' => $item['id'] ?? null],
                    [
                        'inspection_id' => $inspection->id,
                        'category' => $item['category'],
                        'item_description' => $item['item_description'],
                        'status' => $item['status'],
                        'notes' => $item['notes'] ?? null,
                    ]
                );
            }
            unset($validated['checklist_items']);
        }

        // Calculate overall score
        $validated['overall_score'] = $inspection->calculateScore();

        $inspection->update($validated);

        ActivityLog::logActivity(
            'updated',
            $inspection,
            'Updated inspection ' . $inspection->inspection_number,
            ['old' => $oldData, 'new' => $validated]
        );

        return redirect()->route('inspections.show', $inspection)
            ->with('success', 'Inspection updated successfully.');
    }

    public function destroy(Inspection $inspection)
    {
        $inspection->delete();

        ActivityLog::logActivity(
            'deleted',
            $inspection,
            'Deleted inspection ' . $inspection->inspection_number
        );

        return redirect()->route('inspections.index')
            ->with('success', 'Inspection deleted successfully.');
    }

    public function print(Inspection $inspection)
    {
        $inspection->load([
            'business',
            'inspector',
            'permit',
            'checklistItems'
        ]);

        return Inertia::render('Inspections/Print', [
            'inspection' => $inspection,
        ]);
    }

    private function generateChecklistItems(Inspection $inspection)
    {
        $business = $inspection->business;
        $categories = [];

        if ($business->business_type === 'Food Establishment') {
            $categories = [
                'Food Safety' => [
                    'Proper food storage and temperature control',
                    'Clean and sanitized food preparation areas',
                    'No contamination or cross-contamination risks',
                    'Proper food handling practices observed',
                ],
                'Sanitation' => [
                    'Clean floors, walls, and ceilings',
                    'Proper waste disposal system',
                    'Clean and functional handwashing facilities',
                    'Pest control measures in place',
                ],
                'Personnel Hygiene' => [
                    'Staff wearing clean uniforms and hairnets',
                    'Valid health certificates available',
                    'Proper handwashing practices observed',
                ],
                'Facilities' => [
                    'Adequate ventilation and lighting',
                    'Proper drainage system',
                    'Clean restroom facilities',
                ],
            ];
        } else {
            $categories = [
                'General Sanitation' => [
                    'Clean and orderly premises',
                    'Proper waste disposal',
                    'Adequate lighting and ventilation',
                ],
                'Facilities' => [
                    'Clean restroom facilities',
                    'Proper drainage',
                    'Pest control measures',
                ],
                'Safety' => [
                    'Fire safety equipment available',
                    'Clear emergency exits',
                    'First aid kit available',
                ],
            ];
        }

        foreach ($categories as $category => $items) {
            foreach ($items as $item) {
                InspectionChecklistItem::create([
                    'inspection_id' => $inspection->id,
                    'category' => $category,
                    'item_description' => $item,
                    'status' => 'Not Applicable',
                ]);
            }
        }
    }
}
