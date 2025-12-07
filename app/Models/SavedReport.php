<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedReport extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'report_type',
        'filters',
        'columns',
        'is_shared',
    ];

    protected $casts = [
        'filters' => 'array',
        'columns' => 'array',
        'is_shared' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
