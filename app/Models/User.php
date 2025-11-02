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

    // Role checking methods
    public function isAdmin()
    {
        return strtolower($this->role) === 'admin';
    }

    public function isStaff()
    {
        return strtolower($this->role) === 'staff';
    }

    public function isSanitaryInspector()
    {
        // In your system, only admins can inspect
        return $this->isAdmin();
    }

    public function isMunicipalHealthOfficer()
    {
        // In your system, only admins have this authority
        return $this->isAdmin();
    }

    public function canInspect()
    {
        return $this->isAdmin();
    }

    public function canApprovePermits()
    {
        return $this->isAdmin();
    }

    public function canIssuePermits()
    {
        return $this->isAdmin();
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
