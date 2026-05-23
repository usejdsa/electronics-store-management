import { useAuth } from '../context/AuthContext';

export function useRole() {
  const { user } = useAuth();
  const roles = user?.roles || [];

  const is = (role) => roles.includes(role);
  const isAdmin = is('Admin');
  const isTechnician = is('Technician');
  const isCashier = is('Cashier');

  const can = (action) => {
    switch (action) {
      case 'view:dashboard':         return isAdmin || isTechnician || isCashier;

      case 'view:products':          return isAdmin || isTechnician || isCashier;
      case 'mutate:products':        return isAdmin;

      case 'view:categories':        return isAdmin || isTechnician;
      case 'mutate:categories':      return isAdmin;

      case 'view:customers':         return isAdmin || isCashier;
      case 'mutate:customers':       return isAdmin || isCashier;
      case 'delete:customers':       return isAdmin;

      case 'view:orders':            return isAdmin || isCashier;
      case 'mutate:orders':          return isAdmin || isCashier;
      case 'delete:orders':          return isAdmin;

      case 'view:order-details':     return isAdmin || isCashier;
      case 'mutate:order-details':   return isAdmin || isCashier;
      case 'delete:order-details':   return isAdmin;

      case 'view:suppliers':         return isAdmin;
      case 'mutate:suppliers':       return isAdmin;

      case 'view:purchase-orders':   return isAdmin;
      case 'mutate:purchase-orders': return isAdmin;

      case 'view:inventory':         return isAdmin || isTechnician;
      case 'mutate:inventory':       return isAdmin;

      case 'view:users':             return isAdmin;

      default: return false;
    }
  };

  return { can, isAdmin, isTechnician, isCashier, roles };
}