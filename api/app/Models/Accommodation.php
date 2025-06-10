<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Accommodation extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'its_id',
        'miqaat_id',
        'name',
        'city',
        'pincode',
        'accommodation_type',
        'check_in_date',
        'check_out_date',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
    ];
    
    /**
     * Get the mumineen that owns this accommodation.
     */
    public function mumineen(): BelongsTo
    {
        return $this->belongsTo(Mumineen::class, 'its_id', 'its_id');
    }
    
    /**
     * Get the miqaat associated with this accommodation.
     */
    public function miqaat(): BelongsTo
    {
        return $this->belongsTo(Miqaat::class);
    }
}
