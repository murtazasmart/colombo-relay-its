// Permission types for user roles and access rights

export type Permission = 
  | 'view:census'
  | 'edit:census'
  | 'view:miqaat'
  | 'edit:miqaat'
  | 'view:accommodation'
  | 'edit:accommodation'
  | 'view:scan'
  | 'edit:scan'
  | 'admin:all';

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserPermissions {
  itsId: string;
  roles: string[];
  permissions: Permission[];
  isAdmin: boolean;
}

// Default roles with their permissions
export const ROLES: Record<string, UserRole> = {
  'admin': {
    id: 'admin',
    name: 'Administrator',
    permissions: ['admin:all']
  },
  'manager': {
    id: 'manager',
    name: 'Miqaat Manager',
    permissions: [
      'view:census',
      'edit:census',
      'view:miqaat',
      'edit:miqaat',
      'view:accommodation',
      'edit:accommodation',
      'view:scan',
      'edit:scan'
    ]
  },
  'volunteer': {
    id: 'volunteer',
    name: 'Volunteer',
    permissions: [
      'view:census',
      'view:miqaat',
      'view:accommodation',
      'edit:accommodation',
      'view:scan'
    ]
  },
  'user': {
    id: 'user',
    name: 'Regular User',
    permissions: [
      'view:miqaat',
      'view:accommodation'
    ]
  }
};
