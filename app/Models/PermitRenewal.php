<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermitRenewal extends Model
{
    protected $fillable = [
        'previous_permit_id',
        'new_permit_id',
        'business_id',
        'renewal_request_date',
        'renewal_status',
        'rejection_reason',
    ];

    protected $casts = [
        'renewal_request_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function previousPermit(): BelongsTo
    {
        return $this->belongsTo(SanitaryPermit::class, 'previous_permit_id');
    }

    public function newPermit(): BelongsTo
    {
        return $this->belongsTo(SanitaryPermit::class, 'new_permit_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('renewal_status', 'Pending');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('renewal_status', 'Under Review');
    }

    public function scopeApproved($query)
    {
        return $query->where('renewal_status', 'Approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('renewal_status', 'Rejected');
    }

    // Helper Methods
    public function isPending(): bool
    {
        return $this->renewal_status === 'Pending';
    }

    public function isApproved(): bool
    {
        return $this->renewal_status === 'Approved';
    }

    public function isRejected(): bool
    {
        return $this->renewal_status === 'Rejected';
    }
}
