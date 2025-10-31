<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inspection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'inspection_number',
        'business_id',
        'permit_id',
        'inspection_date',
        'inspection_time',
        'inspector_id',
        'inspection_type',
        'result',
        'overall_score',
        'findings',
        'recommendations',
        'follow_up_date',
    ];

    protected $casts = [
        'inspection_date' => 'date',
        'follow_up_date' => 'date',
        'overall_score' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function permit(): BelongsTo
    {
        return $this->belongsTo(SanitaryPermit::class, 'permit_id');
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function checklistItems(): HasMany
    {
        return $this->hasMany(InspectionChecklistItem::class);
    }

    public function documents()
    {
        return $this->morphMany(DocumentAttachment::class, 'attachable');
    }

    // Scopes
    public function scopePassed($query)
    {
        return $query->whereIn('result', ['Passed', 'Approved']);
    }

    public function scopeFailed($query)
    {
        return $query->whereIn('result', ['Failed', 'Denied']);
    }

    public function scopePassedWithConditions($query)
    {
        return $query->where('result', 'Passed with Conditions');
    }

    public function scopePending($query)
    {
        return $query->where('result', 'Pending');
    }

    public function scopeByInspector($query, $inspectorId)
    {
        return $query->where('inspector_id', $inspectorId);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('inspection_date', now()->month)
            ->whereYear('inspection_date', now()->year);
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('inspection_date', now()->year);
    }

    // Helper Methods
    public static function generateInspectionNumber(): string
    {
        $year = date('Y');
        $lastInspection = static::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastInspection ? (int) substr($lastInspection->inspection_number, -5) + 1 : 1;

        return sprintf('INS-%s-%05d', $year, $sequence);
    }

    public function isPassed(): bool
    {
        return in_array($this->result, ['Passed', 'Approved']);
    }

    public function isFailed(): bool
    {
        return in_array($this->result, ['Failed', 'Denied']);
    }

    public function isPending(): bool
    {
        return $this->result === 'Pending';
    }

    public function isPassedWithConditions(): bool
    {
        return $this->result === 'Passed with Conditions';
    }

    public function calculateScore(): float
    {
        $items = $this->checklistItems;

        if ($items->isEmpty()) {
            return 0;
        }

        $compliant = $items->where('status', 'Compliant')->count();
        $total = $items->whereIn('status', ['Compliant', 'Non-Compliant'])->count();

        if ($total === 0) {
            return 0;
        }

        return round(($compliant / $total) * 100, 2);
    }

    public function labReport()
    {
        return $this->belongsTo(LabReport::class, 'business_id', 'business_id')
            ->whereDate('created_at', $this->created_at->toDateString());
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($inspection) {
            if (empty($inspection->inspection_number)) {
                $inspection->inspection_number = static::generateInspectionNumber();
            }
        });
    }
}
