<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class SanitaryPermit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'permit_number',
        'business_id',
        'permit_type',
        'issue_date',
        'expiry_date',
        'status',
        'issued_by',
        'approved_by',
        'remarks',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class, 'permit_id');
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(PermitRenewal::class, 'previous_permit_id');
    }

    public function documents()
    {
        return $this->morphMany(DocumentAttachment::class, 'attachable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeExpiring($query, $days = 30)
    {
        return $query->where('status', 'Active')
            ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now())
            ->whereIn('status', ['Active', 'Expiring Soon']);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    // Accessors
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'Active';
    }

    public function getIsExpiringAttribute(): bool
    {
        if ($this->status !== 'Active') {
            return false;
        }

        return $this->expiry_date->lte(now()->addDays(30)) &&
            $this->expiry_date->gt(now());
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date->lt(now());
    }

    public function getDaysUntilExpiryAttribute(): int
    {
        return now()->diffInDays($this->expiry_date, false);
    }

    // Helper Methods
    public static function generatePermitNumber(): string
    {
        $year = date('Y');
        $lastPermit = static::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastPermit ? (int) substr($lastPermit->permit_number, -5) + 1 : 1;

        return sprintf('SP-%s-%05d', $year, $sequence);
    }

    public function updateStatus(): void
    {
        if ($this->expiry_date->lt(now())) {
            $this->update(['status' => 'Expired']);
        } elseif ($this->expiry_date->lte(now()->addDays(30)) && $this->status === 'Active') {
            $this->update(['status' => 'Expiring Soon']);
        }
    }

    public function canBeRenewed(): bool
    {
        return in_array($this->status, ['Active', 'Expiring Soon', 'Expired']) &&
            !$this->hasPendingRenewal();
    }

    public function hasPendingRenewal(): bool
    {
        return $this->renewals()
            ->whereIn('renewal_status', ['Pending', 'Under Review', 'Inspection Required'])
            ->exists();
    }

    // Boot method for automatic status updates
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($permit) {
            if (empty($permit->permit_number)) {
                $permit->permit_number = static::generatePermitNumber();
            }
        });

        static::saving(function ($permit) {
            // Auto-update status based on expiry date
            if ($permit->isDirty('expiry_date') || $permit->isDirty('issue_date')) {
                if ($permit->expiry_date->lt(now())) {
                    $permit->status = 'Expired';
                } elseif ($permit->expiry_date->lte(now()->addDays(30))) {
                    if ($permit->status === 'Active') {
                        $permit->status = 'Expiring Soon';
                    }
                }
            }
        });
    }
}
