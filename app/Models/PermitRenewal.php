<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function inspection()
    {
        return $this->belongsTo(Inspection::class);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['Open', 'Under Correction']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('compliance_deadline', '<', now())
            ->whereIn('status', ['Open', 'Under Correction']);
    }
}
