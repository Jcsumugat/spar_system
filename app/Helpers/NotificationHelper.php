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

    public static function labReportSubmitted($userId, $business, $labReport, $inspection = null)
    {
        $applicationType = ucfirst($labReport->application_type);

        $data = [
            'business_id' => $business->id,
            'lab_report_id' => $labReport->id,
            'application_type' => $labReport->application_type,
        ];

        // If inspection exists, include it for inspector redirect
        if ($inspection) {
            $data['inspection_id'] = $inspection->id;
        }

        return self::create(
            $userId,
            'lab_report_submitted',
            'New Lab Report Submitted',
            "{$applicationType} application lab report from {$business->business_name} requires review",
            $data
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

    // New notification methods for lab inspector
    public static function inspectionProgressSaved($userId, $business, $inspection)
    {
        return self::create(
            $userId,
            'inspection_progress_saved',
            'Inspection Progress Updated',
            "Progress saved for inspection {$inspection->inspection_number} at {$business->business_name}",
            [
                'business_id' => $business->id,
                'inspection_id' => $inspection->id,
                'inspection_number' => $inspection->inspection_number,
            ]
        );
    }

    public static function inspectionApproved($userId, $business, $inspection, $permit = null)
    {
        $message = "Inspection {$inspection->inspection_number} for {$business->business_name} has been approved";

        if ($permit) {
            $message .= " and permit {$permit->permit_number} has been issued";
        }

        return self::create(
            $userId,
            'inspection_approved',
            'Inspection Approved',
            $message,
            [
                'business_id' => $business->id,
                'inspection_id' => $inspection->id,
                'inspection_number' => $inspection->inspection_number,
                'permit_id' => $permit ? $permit->id : null,
                'permit_number' => $permit ? $permit->permit_number : null,
            ]
        );
    }

    public static function inspectionDenied($userId, $business, $inspection)
    {
        return self::create(
            $userId,
            'inspection_denied',
            'Inspection Denied',
            "Inspection {$inspection->inspection_number} for {$business->business_name} has been denied",
            [
                'business_id' => $business->id,
                'inspection_id' => $inspection->id,
                'inspection_number' => $inspection->inspection_number,
                'findings' => $inspection->findings,
            ]
        );
    }

    public static function labReportReviewed($userId, $business, $labReport, $status)
    {
        $statusText = ucfirst($status);

        return self::create(
            $userId,
            'lab_report_reviewed',
            "Lab Report {$statusText}",
            "Lab report for {$business->business_name} has been {$status} by the inspector",
            [
                'business_id' => $business->id,
                'lab_report_id' => $labReport->id,
                'status' => $status,
                'overall_result' => $labReport->overall_result,
            ]
        );
    }
}
