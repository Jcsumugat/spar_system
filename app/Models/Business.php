<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'business_name',
        'owner_name',
        'business_type',
        'address',
        'barangay',
        'contact_number',
        'email',
        'establishment_category',
        'number_of_employees',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'number_of_employees' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function sanitaryPermits(): HasMany
    {
        return $this->hasMany(SanitaryPermit::class);
    }

    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(PermitRenewal::class);
    }

    public function documents()
    {
        return $this->morphMany(DocumentAttachment::class, 'attachable');
    }

    // Accessors & Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByBarangay($query, $barangay)
    {
        return $query->where('barangay', $barangay);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('business_type', $type);
    }

    // Helper Methods
    public function getActivePermitAttribute()
    {
        return $this->sanitaryPermits()
            ->whereIn('status', ['Active', 'Expiring Soon'])
            ->latest('issue_date')
            ->first();
    }

    public function hasActivePermit(): bool
    {
        return $this->activePermit !== null;
    }

    public function getLatestInspectionAttribute()
    {
        return $this->inspections()->latest('inspection_date')->first();
    }

    public function hasOpenViolations(): bool
    {
        return $this->violations()
            ->whereIn('status', ['Open', 'Under Correction'])
            ->exists();
    }
}
