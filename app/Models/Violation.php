<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Violation extends Model
{
    protected $fillable = [
        'business_id',
        'inspection_id',
        'violation_type',
        'description',
        'severity',
        'violation_date',
        'compliance_deadline',
        'status',
        'resolution_date',
        'resolution_notes',
    ];

    protected $casts = [
        'violation_date' => 'date',
        'compliance_deadline' => 'date',
        'resolution_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(Inspection::class);
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'Open');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'Resolved');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'Open')
            ->where('compliance_deadline', '<', now());
    }

    public function scopeCritical($query)
    {
        return $query->where('severity', 'Critical');
    }

    public function scopeMajor($query)
    {
        return $query->where('severity', 'Major');
    }

    public function scopeMinor($query)
    {
        return $query->where('severity', 'Minor');
    }

    // Helper Methods
    public function isOverdue(): bool
    {
        return $this->status === 'Open' && $this->compliance_deadline < now();
    }

    public function isCritical(): bool
    {
        return $this->severity === 'Critical';
    }

    public function isResolved(): bool
    {
        return $this->status === 'Resolved';
    }

    public function daysUntilDeadline(): int
    {
        return now()->diffInDays($this->compliance_deadline, false);
    }
}
