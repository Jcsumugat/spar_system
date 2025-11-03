<?php

namespace App\Helpers;

use App\Models\Notification;

class NotificationHelper
{
    public static function create($userId, $type, $title, $message, $data = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function permitExpiring($userId, $business, $permit)
    {
        return self::create(
            $userId,
            'permit_expiring',
            'Permit Expiring Soon',
            "Permit for {$business->business_name} expires on " . date('M d, Y', strtotime($permit->expiry_date)),
            [
                'business_id' => $business->id,
                'permit_id' => $permit->id,
            ]
        );
    }

    public static function inspectionDue($userId, $business, $inspection)
    {
        return self::create(
            $userId,
            'inspection_due',
            'Inspection Scheduled',
            "Inspection scheduled for {$business->business_name} on " . date('M d, Y', strtotime($inspection->inspection_date)),
            [
                'business_id' => $business->id,
                'inspection_id' => $inspection->id,
            ]
        );
    }

    public static function renewalPending($userId, $business, $renewal)
    {
        return self::create(
            $userId,
            'renewal_pending',
            'Renewal Pending',
            "Renewal request from {$business->business_name} is pending approval",
            [
                'business_id' => $business->id,
                'renewal_id' => $renewal->id,
            ]
        );
    }

    public static function labReportSubmitted($userId, $business, $labReport)
    {
        $applicationType = ucfirst($labReport->application_type);

        return self::create(
            $userId,
            'lab_report_submitted',
            'New Lab Report Submitted',
            "{$applicationType} application lab report from {$business->business_name} requires review",
            [
                'business_id' => $business->id,
                'lab_report_id' => $labReport->id,
                'application_type' => $labReport->application_type,
            ]
        );
    }

    public static function businessRegistered($userId, $business)
    {
        return self::create(
            $userId,
            'business_registered',
            'New Business Registered',
            "New business '{$business->business_name}' owned by {$business->owner_name} has been registered and requires inspection",
            [
                'business_id' => $business->id,
                'business_type' => $business->business_type,
                'barangay' => $business->barangay,
            ]
        );
    }
}
