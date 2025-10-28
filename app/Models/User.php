<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'position',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function issuedPermits()
    {
        return $this->hasMany(SanitaryPermit::class, 'issued_by');
    }

    public function approvedPermits()
    {
        return $this->hasMany(SanitaryPermit::class, 'approved_by');
    }

    public function inspections()
    {
        return $this->hasMany(Inspection::class, 'inspector_id');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function uploadedDocuments()
    {
        return $this->hasMany(DocumentAttachment::class, 'uploaded_by');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Role Checks
    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    public function isMunicipalHealthOfficer(): bool
    {
        return $this->role === 'Municipal Health Officer';
    }

    public function isSanitaryInspector(): bool
    {
        return $this->role === 'Sanitary Inspector';
    }

    public function isStaff(): bool
    {
        return $this->role === 'Staff';
    }

    public function hasRole($role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    // Permission Checks
    public function canApprovePermits(): bool
    {
        return in_array($this->role, ['Admin', 'Municipal Health Officer']);
    }

    public function canConductInspections(): bool
    {
        return in_array($this->role, ['Admin', 'Municipal Health Officer', 'Sanitary Inspector']);
    }

    public function canManageUsers(): bool
    {
        return $this->role === 'Admin';
    }

    public function canViewReports(): bool
    {
        return in_array($this->role, ['Admin', 'Municipal Health Officer']);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInspectors($query)
    {
        return $query->whereIn('role', ['Sanitary Inspector', 'Municipal Health Officer', 'Admin']);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
