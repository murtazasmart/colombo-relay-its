<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MiqaatRegistration extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'miqaat_id',
        'its_id',
        'registration_date',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'registration_date' => 'date',
    ];
    
    /**
     * Get the miqaat that owns this registration.
     */
    public function miqaat(): BelongsTo
    {
        return $this->belongsTo(Miqaat::class);
    }
    
    /**
     * Get the mumineen that owns this registration.
     */
    public function mumineen(): BelongsTo
    {
        return $this->belongsTo(Mumineen::class, 'its_id', 'its_id');
    }
}
