<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    public function mumineen()
    {
        return $this->hasMany(Mumineen::class);
    }

    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->permissions->where('slug', $permission)->count() > 0;
        }
        return $permission->intersect($this->permissions)->count() > 0;
    }
}
