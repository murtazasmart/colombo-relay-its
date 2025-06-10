<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaazCenterPreference extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'its_id',
        'waaz_center_id',
        'miqaat_id',
    ];
    
    /**
     * Get the mumineen that owns this preference.
     */
    public function mumineen(): BelongsTo
    {
        return $this->belongsTo(Mumineen::class, 'its_id', 'its_id');
    }
    
    /**
     * Get the waaz center associated with this preference.
     */
    public function waazCenter(): BelongsTo
    {
        return $this->belongsTo(WaazCenter::class);
    }
    
    /**
     * Get the miqaat associated with this preference.
     */
    public function miqaat(): BelongsTo
    {
        return $this->belongsTo(Miqaat::class);
    }
}
