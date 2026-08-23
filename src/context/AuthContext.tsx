import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: (User & { password: string })[] = [
  { id: 'U001', username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
  { id: 'U002', username: 'vendedor', password: 'vendedor123', name: 'Vendedor General', role: 'comprador' },
];

const ADMIN_PERMISSIONS = [
  'panel', 'clientes', 'recetas', 'ventas', 'cobrar', 'entregar',
  'laboratorio', 'gastos', 'inventario', 'configuracion',
];

const COMPRADOR_PERMISSIONS = [
  'ventas', 'cobrar', 'entregar', 'inventario',
];

function getPermissions(role: UserRole): string[] {
  return role === 'admin' ? ADMIN_PERMISSIONS : COMPRADOR_PERMISSIONS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('optia_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const u: User = { id: found.id, username: found.username, name: found.name, role: found.role };
      setUser(u);
      localStorage.setItem('optia_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('optia_user');
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return getPermissions(user.role).includes(permission);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
