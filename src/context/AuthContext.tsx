import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  addUser: (data: { username: string; name: string; role: UserRole; password: string }) => void;
  updateUser: (id: string, data: Partial<User> & { password?: string }) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: (User & { password: string })[] = [
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

const OPTOMETRISTA_PERMISSIONS = [
  'panel', 'clientes', 'recetas', 'laboratorio',
];

const GERENTE_PERMISSIONS = [
  'panel', 'clientes', 'recetas', 'ventas', 'cobrar', 'entregar',
  'laboratorio', 'gastos', 'inventario',
];

function getPermissions(role: UserRole): string[] {
  if (role === 'admin') return ADMIN_PERMISSIONS;
  if (role === 'optometrista') return OPTOMETRISTA_PERMISSIONS;
  if (role === 'gerente') return GERENTE_PERMISSIONS;
  return COMPRADOR_PERMISSIONS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('optia_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersList, setUsersList] = useState<(User & { password: string })[]>(() => {
    const saved = localStorage.getItem('optia_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const saveUsers = (list: (User & { password: string })[]) => {
    setUsersList(list);
    localStorage.setItem('optia_users', JSON.stringify(list));
  };

  const login = useCallback((username: string, password: string): boolean => {
    const found = usersList.find(u => u.username === username && u.password === password);
    if (found) {
      const u: User = { id: found.id, username: found.username, name: found.name, role: found.role };
      setUser(u);
      localStorage.setItem('optia_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, [usersList]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('optia_user');
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return getPermissions(user.role).includes(permission);
  }, [user]);

  const addUser = useCallback((data: { username: string; name: string; role: UserRole; password: string }) => {
    const newUser: User & { password: string } = {
      id: `U${String(usersList.length + 1).padStart(3, '0')}`,
      ...data,
    };
    saveUsers([...usersList, newUser]);
  }, [usersList]);

  const updateUser = useCallback((id: string, data: Partial<User> & { password?: string }) => {
    saveUsers(usersList.map(u => u.id === id ? { ...u, ...data } : u));
  }, [usersList]);

  const deleteUser = useCallback((id: string) => {
    saveUsers(usersList.filter(u => u.id !== id));
  }, [usersList]);

  const users: User[] = usersList.map(({ password: _, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, hasPermission, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
