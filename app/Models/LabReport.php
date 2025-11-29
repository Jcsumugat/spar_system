<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class LabReport extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'lab_reports';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'application_type',
        'submitted_by',
        'inspected_by',

        // Photo paths
        'fecalysis_photo',
        'xray_sputum_photo',
        'receipt_photo',
        'dti_photo',

        // Test results
        'fecalysis_result',
        'xray_sputum_result',
        'receipt_result',
        'dti_result',

        // Remarks
        'fecalysis_remarks',
        'xray_sputum_remarks',
        'receipt_remarks',
        'dti_remarks',
        'general_remarks',
        'inspector_remarks',

        // Status and results
        'status',
        'overall_result',
        'submitted_at',
        'inspected_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
        'inspected_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the business that owns the lab report.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the user who submitted the lab report.
     */
    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * Get the inspector who reviewed the lab report.
     */
    public function inspectedBy()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }

    /**
     * Get the status badge configuration.
     *
     * @return array
     */
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => [
                'text' => 'Pending Inspection',
                'color' => 'yellow',
                'class' => 'bg-yellow-100 text-yellow-800'
            ],
            'approved' => [
                'text' => 'Approved',
                'color' => 'green',
                'class' => 'bg-green-100 text-green-800'
            ],
            'rejected' => [
                'text' => 'Rejected',
                'color' => 'red',
                'class' => 'bg-red-100 text-red-800'
            ],
            'failed' => [
                'text' => 'Failed',
                'color' => 'red',
                'class' => 'bg-red-100 text-red-800'
            ],
        ];

        return $badges[$this->status] ?? [
            'text' => 'Unknown',
            'color' => 'gray',
            'class' => 'bg-gray-100 text-gray-800'
        ];
    }

    /**
     * Get the overall result badge configuration.
     *
     * @return array
     */
    public function getOverallResultBadgeAttribute()
    {
        $badges = [
            'pass' => [
                'text' => 'Pass',
                'color' => 'green',
                'class' => 'bg-green-100 text-green-800'
            ],
            'fail' => [
                'text' => 'Fail',
                'color' => 'red',
                'class' => 'bg-red-100 text-red-800'
            ],
        ];

        return $badges[$this->overall_result] ?? [
            'text' => 'Unknown',
            'color' => 'gray',
            'class' => 'bg-gray-100 text-gray-800'
        ];
    }

    /**
     * Scope a query to only include pending lab reports.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved lab reports.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected lab reports.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope a query to only include reports for new applications.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNewApplications($query)
    {
        return $query->where('application_type', 'new');
    }

    /**
     * Scope a query to only include reports for renewals.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRenewals($query)
    {
        return $query->where('application_type', 'renewal');
    }

    /**
     * Check if all test results passed.
     *
     * @return bool
     */
    public function allTestsPassed()
    {
        return $this->fecalysis_result === 'pass' &&
            $this->xray_sputum_result === 'pass' &&
            $this->receipt_result === 'pass' &&
            $this->dti_result === 'pass';
    }

    /**
     * Check if any test result failed.
     *
     * @return bool
     */
    public function hasFailedTests()
    {
        return $this->fecalysis_result === 'fail' ||
            $this->xray_sputum_result === 'fail' ||
            $this->receipt_result === 'fail' ||
            $this->dti_result === 'fail';
    }

    /**
     * Get the list of failed tests.
     *
     * @return array
     */
    public function getFailedTests()
    {
        $failed = [];

        if ($this->fecalysis_result === 'fail') {
            $failed[] = 'Fecalysis Examination';
        }
        if ($this->xray_sputum_result === 'fail') {
            $failed[] = 'X-Ray/Sputum Examination';
        }
        if ($this->receipt_result === 'fail') {
            $failed[] = 'Receipt';
        }
        if ($this->dti_result === 'fail') {
            $failed[] = 'DTI';
        }

        return $failed;
    }

    /**
     * Check if the lab report is pending inspection.
     *
     * @return bool
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the lab report is approved.
     *
     * @return bool
     */
    public function isApproved()
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the lab report is rejected.
     *
     * @return bool
     */
    public function isRejected()
    {
        return $this->status === 'rejected';
    }
    /**
     * Get the URL for the fecalysis photo.
     */
    public function getFecalysisPhotoUrlAttribute()
    {
        return $this->fecalysis_photo ? Storage::url($this->fecalysis_photo) : null;
    }

    /**
     * Get the URL for the xray/sputum photo.
     */
    public function getXraySputumPhotoUrlAttribute()
    {
        return $this->xray_sputum_photo ? Storage::url($this->xray_sputum_photo) : null;
    }

    /**
     * Get the URL for the receipt photo.
     */
    public function getReceiptPhotoUrlAttribute()
    {
        return $this->receipt_photo ? Storage::url($this->receipt_photo) : null;
    }

    /**
     * Get the URL for the DTI photo.
     */
    public function getDtiPhotoUrlAttribute()
    {
        return $this->dti_photo ? Storage::url($this->dti_photo) : null;
    }

    protected $appends = [
        'fecalysis_photo_url',
        'xray_sputum_photo_url',
        'receipt_photo_url',
        'dti_photo_url',
        'status_badge',
        'overall_result_badge'
    ];
    public function inspection()
    {
        return $this->hasOne(Inspection::class, 'business_id', 'business_id')
            ->whereDate('created_at', $this->created_at->toDateString());
    }
    public function labReports()
    {
        return $this->hasMany(LabReport::class);
    }
}
