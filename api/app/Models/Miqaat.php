<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Miqaat extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'description',
        'status',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];
    
    /**
     * Get the events for this miqaat.
     */
    public function events(): HasMany
    {
        return $this->hasMany(MiqaatEvent::class);
    }
    
    /**
     * Get the registrations for this miqaat.
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(MiqaatRegistration::class);
    }
    
    /**
     * Get the arrival scans for this miqaat.
     */
    public function arrivalScans(): HasMany
    {
        return $this->hasMany(ArrivalScan::class);
    }
    
    /**
     * Get the accommodations for this miqaat.
     */
    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class);
    }
    
    /**
     * Get the waaz center preferences for this miqaat.
     */
    public function waazCenterPreferences(): HasMany
    {
        return $this->hasMany(WaazCenterPreference::class);
    }
}
