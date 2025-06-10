<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            ['name' => 'View Census', 'slug' => 'view-census'],
            ['name' => 'Create Census', 'slug' => 'create-census'],
            ['name' => 'Edit Census', 'slug' => 'edit-census'],
            ['name' => 'Delete Census', 'slug' => 'delete-census'],
            ['name' => 'View Accommodation', 'slug' => 'view-accommodation'],
            ['name' => 'Create Accommodation', 'slug' => 'create-accommodation'],
            ['name' => 'Edit Accommodation', 'slug' => 'edit-accommodation'],
            ['name' => 'Delete Accommodation', 'slug' => 'delete-accommodation'],
            ['name' => 'View Miqaat', 'slug' => 'view-miqaat'],
            ['name' => 'Create Miqaat', 'slug' => 'create-miqaat'],
            ['name' => 'Edit Miqaat', 'slug' => 'edit-miqaat'],
            ['name' => 'Delete Miqaat', 'slug' => 'delete-miqaat'],
            ['name' => 'Manage System', 'slug' => 'manage-system'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Full system access',
                'permissions' => [
                    'view-census', 'create-census', 'edit-census', 'delete-census',
                    'view-accommodation', 'create-accommodation', 'edit-accommodation', 'delete-accommodation',
                    'view-miqaat', 'create-miqaat', 'edit-miqaat', 'delete-miqaat',
                    'manage-system'
                ]
            ],
            [
                'name' => 'Accommodation Manager',
                'slug' => 'accommodation-manager',
                'description' => 'Can manage accommodations',
                'permissions' => [
                    'view-census',
                    'view-accommodation', 'create-accommodation', 'edit-accommodation',
                    'view-miqaat'
                ]
            ],
            [
                'name' => 'Census Manager',
                'slug' => 'census-manager',
                'description' => 'Can manage census data',
                'permissions' => [
                    'view-census', 'create-census', 'edit-census',
                    'view-accommodation',
                    'view-miqaat'
                ]
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Basic user access',
                'permissions' => [
                    'view-census',
                    'view-accommodation',
                    'view-miqaat'
                ]
            ]
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);
            
            $role = Role::create($roleData);
            
            // Attach permissions to the role
            foreach ($permissions as $permissionSlug) {
                $permission = Permission::where('slug', $permissionSlug)->first();
                if ($permission) {
                    $role->permissions()->attach($permission->id);
                }
            }
        }
    }
}
