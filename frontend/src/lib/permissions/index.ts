import { Permission, UserPermissions, ROLES } from './types';

/**
 * Get the current user's permissions from local storage
 * @returns UserPermissions object with user roles and permissions
 */
export function getUserPermissions(): UserPermissions | null {
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }

  // Get ITS ID from local storage
  const itsId = localStorage.getItem('its_no');
  if (!itsId) {
    return null;
  }

  // In a real implementation, you would fetch this data from an API
  // For now, we'll simulate with hardcoded roles based on ITS ID
  // This should be replaced with actual API calls in production

  // Demo roles assignment - in production, this would come from your backend
  let roles: string[] = ['user']; // Default role
  
  // Demo role assignment - replace with actual logic
  if (itsId === 'ADMIN123') {
    roles = ['admin'];
  } else if (itsId.startsWith('MGR')) {
    roles = ['manager'];
  } else if (itsId.startsWith('VOL')) {
    roles = ['volunteer'];
  }

  // Calculate all permissions from assigned roles
  const allPermissions = new Set<Permission>();
  
  // Add permissions from all roles
  roles.forEach(roleId => {
    const role = ROLES[roleId];
    if (role) {
      role.permissions.forEach(permission => {
        allPermissions.add(permission);
      });
    }
  });

  return {
    itsId,
    roles,
    permissions: Array.from(allPermissions),
    isAdmin: roles.includes('admin') || allPermissions.has('admin:all')
  };
}

/**
 * Check if a user has a specific permission
 * @param permission The permission to check
 * @returns Boolean indicating if user has permission
 */
export function hasPermission(permission: Permission): boolean {
  const userPermissions = getUserPermissions();
  
  if (!userPermissions) {
    return false;
  }
  
  // Admin always has all permissions
  if (userPermissions.isAdmin || userPermissions.permissions.includes('admin:all')) {
    return true;
  }
  
  return userPermissions.permissions.includes(permission);
}

/**
 * Get the current user's ITS ID from local storage
 * @returns The user's ITS ID or null if not found
 */
export function getCurrentUserItsId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('its_no');
}

/**
 * Protect a component with permission requirements
 * @param Component The React component to protect
 * @param requiredPermissions Array of permissions required to access
 * @returns Protected component or fallback
 */
export function withPermission(requiredPermissions: Permission[]): boolean {
  // Check if user has any of the required permissions
  return requiredPermissions.some(permission => hasPermission(permission));
}
