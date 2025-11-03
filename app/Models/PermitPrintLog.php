<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermitPrintLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'permit_id',
        'business_id',
        'printed_by',
        'printed_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'printed_at' => 'datetime',
    ];

    public function permit()
    {
        return $this->belongsTo(SanitaryPermit::class, 'permit_id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function printedBy()
    {
        return $this->belongsTo(User::class, 'printed_by');
    }

    /**
     * Get print count for a specific business
     */
    public static function getBusinessPrintCount($businessId)
    {
        return self::where('business_id', $businessId)->count();
    }

    /**
     * Get print count for a specific business by date range
     */
    public static function getBusinessPrintCountByDateRange($businessId, $startDate, $endDate)
    {
        return self::where('business_id', $businessId)
            ->whereBetween('printed_at', [$startDate, $endDate])
            ->count();
    }

    /**
     * Get print count for a specific staff member
     */
    public static function getStaffPrintCount($userId, $businessId = null)
    {
        $query = self::where('printed_by', $userId);

        if ($businessId) {
            $query->where('business_id', $businessId);
        }

        return $query->count();
    }
}
