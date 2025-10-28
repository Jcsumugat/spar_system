<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'inspection_time' => 'datetime',
        'follow_up_date' => 'date',
        'overall_score' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function permit()
    {
        return $this->belongsTo(SanitaryPermit::class, 'permit_id');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function checklistItems()
    {
        return $this->hasMany(InspectionChecklistItem::class);
    }

    public function violations()
    {
        return $this->hasMany(Violation::class);
    }

    public function documents()
    {
        return $this->morphMany(DocumentAttachment::class, 'attachable');
    }

    // Scopes
    public function scopePassed($query)
    {
        return $query->where('result', 'Passed');
    }

    public function scopeFailed($query)
    {
        return $query->where('result', 'Failed');
    }

    public function scopePending($query)
    {
        return $query->where('result', 'Pending');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('inspection_date', '>=', now())
            ->where('result', 'Pending');
    }

    // Helper Methods
    public static function generateInspectionNumber()
    {
        $year = date('Y');
        $lastInspection = static::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastInspection) {
            $lastNumber = intval(substr($lastInspection->inspection_number, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return 'INS-' . $year . '-' . $newNumber;
    }

    public function isPassed(): bool
    {
        return $this->result === 'Passed';
    }

    public function isFailed(): bool
    {
        return $this->result === 'Failed';
    }

    public function hasNonCompliantItems(): bool
    {
        return $this->checklistItems()
            ->where('status', 'Non-Compliant')
            ->exists();
    }

    public function getCompliancePercentageAttribute()
    {
        $totalItems = $this->checklistItems()->count();
        if ($totalItems === 0) return 0;

        $compliantItems = $this->checklistItems()
            ->where('status', 'Compliant')
            ->count();

        return round(($compliantItems / $totalItems) * 100, 2);
    }
}
