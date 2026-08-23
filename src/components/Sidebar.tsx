import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShoppingCart, CreditCard, Truck,
  Package, FlaskConical, Receipt, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badgeKey?: 'ventas' | 'cobrar' | 'entregar';
  permission?: string;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'GENERAL',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Panel', permission: 'panel' },
    ],
  },
  {
    label: 'CLÍNICO',
    items: [
      { to: '/clientes', icon: Users, label: 'Clientes', permission: 'clientes' },
      { to: '/recetas', icon: FileText, label: 'Recetas', permission: 'recetas' },
    ],
  },
  {
    label: 'COMERCIAL',
    items: [
      { to: '/ventas', icon: ShoppingCart, label: 'Ventas', badgeKey: 'ventas' as const, permission: 'ventas' },
      { to: '/cobrar', icon: CreditCard, label: 'Cobrar', badgeKey: 'cobrar' as const, permission: 'cobrar' },
      { to: '/entregar', icon: Truck, label: 'Entregar', badgeKey: 'entregar' as const, permission: 'entregar' },
    ],
  },
  {
    label: 'OPERACIONES',
    items: [
      { to: '/inventario', icon: Package, label: 'Inventario', permission: 'inventario' },
      { to: '/laboratorio', icon: FlaskConical, label: 'Laboratorio', permission: 'laboratorio' },
      { to: '/gastos', icon: Receipt, label: 'Gastos', permission: 'gastos' },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { to: '/configuracion', icon: Settings, label: 'Configuración', permission: 'configuracion' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { sales, pendingPayments, deliveryOrders } = useApp();
  const { user, logout, hasPermission } = useAuth();

  const pendingSaleCount = sales.filter(s => s.status === 'Pendiente' || s.status === 'Parcial').length;
  const pendingPaymentCount = pendingPayments.filter(p => p.status === 'Pendiente' || p.status === 'Parcial').length;
  const pendingDeliveryCount = deliveryOrders.filter(d => d.status !== 'Entregado').length;

  const badges: Record<string, number> = {
    ventas: pendingSaleCount,
    cobrar: pendingPaymentCount,
    entregar: pendingDeliveryCount,
  };

  const sidebarWidth = collapsed ? 76 : 260;

  const filteredSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.permission || hasPermission(item.permission)),
    }))
    .filter(section => section.items.length > 0);

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#1a0e2e] text-white flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/5"
      style={{ width: sidebarWidth }}
    >
      <div className="flex flex-col items-center py-6 px-4 border-b border-white/10">
        <Logo size={collapsed ? 48 : 56} />
        {!collapsed && (
          <div className="text-center mt-2">
            <h1 className="text-lg font-extrabold tracking-tight">
              optic<span className="text-[#a855f7]">æ</span>llen
            </h1>
            <p className="text-[9px] text-white/30 tracking-widest">Ver bien es vivir mejor</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {filteredSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.2em] px-3 mb-2">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7c3aed]/30 to-[#6d28d9]/20 text-white shadow-lg shadow-purple-900/20 border border-purple-500/20'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] shadow-md shadow-purple-500/30'
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`} strokeWidth={2} />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && badgeCount > 0 && (
                      <span className="ml-auto bg-[#ef4444] text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md shadow-red-500/30">
                        {badgeCount}
                      </span>
                    )}
                    {collapsed && badgeCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#1a0e2e]">
                        {badgeCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a2c82] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-white/20 text-center tracking-wide">v1.0.0 · opticællen</p>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-[#1a0e2e] border-2 border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-[#2d1b4e] hover:border-purple-500/30 transition-all duration-200 shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
