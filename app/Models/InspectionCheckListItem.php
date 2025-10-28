<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionChecklistItem extends Model
{
    protected $fillable = [
        'inspection_id',
        'category',
        'item_description',
        'status',
        'notes',
    ];

    public function inspection()
    {
        return $this->belongsTo(Inspection::class);
    }

    public function scopeNonCompliant($query)
    {
        return $query->where('status', 'Non-Compliant');
    }
}
