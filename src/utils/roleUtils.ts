
import { User } from '../types';

export const hasPermission = (user: User | null, action: string): boolean => {
  if (!user) return false;

  const permissions = {
    Admin: ['create', 'read', 'update', 'delete', 'assign'],
    Inspector: ['read', 'update'],
    Engineer: ['read', 'update']
  };

  return permissions[user.role]?.includes(action) || false;
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;

  // All authenticated users can access dashboard and basic views
  const publicRoutes = ['/dashboard', '/ships', '/jobs', '/calendar'];
  
  // Only admins can access user management
  const adminRoutes = ['/admin'];

  if (publicRoutes.some(r => route.startsWith(r))) return true;
  if (adminRoutes.some(r => route.startsWith(r))) return user.role === 'Admin';

  return true;
};
