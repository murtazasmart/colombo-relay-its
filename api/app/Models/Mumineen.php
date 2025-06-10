<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mumineen extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mumineen';
    
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'its_id';
    
    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';
    
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'its_id',
        'eits_id',
        'hof_its_id',
        'full_name',
        'gender',
        'age',
        'mobile',
        'country',
    ];
    
    /**
     * Get the head of family of this mumineen.
     */
    public function headOfFamily(): BelongsTo
    {
        return $this->belongsTo(Mumineen::class, 'hof_its_id', 'its_id');
    }
    
    /**
     * Get the family members of this mumineen.
     */
    public function familyMembers(): HasMany
    {
        return $this->hasMany(Mumineen::class, 'hof_its_id', 'its_id');
    }
    
    /**
     * Get the miqaat registrations for this mumineen.
     */
    public function miqaatRegistrations(): HasMany
    {
        return $this->hasMany(MiqaatRegistration::class, 'its_id', 'its_id');
    }
    
    /**
     * Get the arrival scans for this mumineen.
     */
    public function arrivalScans(): HasMany
    {
        return $this->hasMany(ArrivalScan::class, 'its_id', 'its_id');
    }
    
    /**
     * Get the accommodations for this mumineen.
     */
    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class, 'its_id', 'its_id');
    }
    
    /**
     * Get the waaz center preferences for this mumineen.
     */
    public function waazCenterPreferences(): HasMany
    {
        return $this->hasMany(WaazCenterPreference::class, 'its_id', 'its_id');
    }
}
