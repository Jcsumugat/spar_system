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

    // Role check methods
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

    // Relationships
    public function inspections()
    {
        return $this->hasMany(Inspection::class, 'inspector_id');
    }

    public function issuedPermits()
    {
        return $this->hasMany(SanitaryPermit::class, 'issued_by');
    }

    public function approvedPermits()
    {
        return $this->hasMany(SanitaryPermit::class, 'approved_by');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
