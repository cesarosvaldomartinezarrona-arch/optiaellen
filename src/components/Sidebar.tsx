import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShoppingCart, CreditCard, Truck,
  Package, FlaskConical, Receipt, Settings, ChevronLeft, ChevronRight, LogOut, X, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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
    label: 'PRINCIPAL',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', permission: 'panel' },
      { to: '/clientes', icon: Users, label: 'Clientes', permission: 'clientes' },
      { to: '/recetas', icon: FileText, label: 'Recetas', permission: 'recetas' },
    ],
  },
  {
    label: 'OPERACIONES',
    items: [
      { to: '/ventas', icon: ShoppingCart, label: 'Ventas', badgeKey: 'ventas' as const, permission: 'ventas' },
      { to: '/inventario', icon: Package, label: 'Inventario', permission: 'inventario' },
      { to: '/gastos', icon: Receipt, label: 'Gastos', permission: 'gastos' },
      { to: '/laboratorio', icon: FlaskConical, label: 'Laboratorio', permission: 'laboratorio' },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { to: '/configuracion', icon: Settings, label: 'Configuracion', permission: 'configuracion' },
    ],
  },
];

const extraNavItems: NavItem[] = [
  { to: '/cobrar', icon: CreditCard, label: 'Cobrar', badgeKey: 'cobrar' as const, permission: 'cobrar' },
  { to: '/entregar', icon: Truck, label: 'Entregar', badgeKey: 'entregar' as const, permission: 'entregar' },
];

interface SidebarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ isMobile, mobileOpen, onMobileClose }: SidebarProps) {
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

  const sidebarWidth = isMobile ? 300 : (collapsed ? 82 : 260);

  const sidebarContent = (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Glow orb top */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#7c3aed] rounded-full blur-[80px] opacity-20 pointer-events-none" />
      <div className="absolute top-40 -right-20 w-48 h-48 bg-[#4f46e5] rounded-full blur-[70px] opacity-10 pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-2xl blur-lg opacity-40" />
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-purple-500/25 ring-1 ring-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12C2 12 6 6 12 6C18 6 22 12 22 12C22 12 18 18 12 18C6 18 2 12 2 12Z" fill="white" fillOpacity="0.95" />
              <circle cx="12" cy="12" r="4.5" fill="#7c3aed" />
              <circle cx="12" cy="12" r="2.2" fill="#0f0a1f" />
              <circle cx="13.2" cy="10.8" r="0.7" fill="white" opacity="0.9" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f0a1f] animate-pulse" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-extrabold tracking-tight text-white flex items-center gap-1">
              Opti<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd]">A</span>Ellen
              <Sparkles className="w-3 h-3 text-amber-300 ml-1" />
            </h1>
            <p className="text-[10px] text-white/35 tracking-wide">Ver bien es vivir mejor</p>
          </div>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors ml-auto">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!collapsed && <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />}

      {/* Mobile handle */}
      {isMobile && <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mt-3 mb-1 lg:hidden" />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navSections
          .map(section => ({
            ...section,
            items: section.items.filter(item => !item.permission || hasPermission(item.permission)),
          }))
          .filter(section => section.items.length > 0)
          .map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="flex items-center gap-2 px-3 mb-2.5">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    {section.label}
                  </p>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                  const showLabDot = item.label === 'Laboratorio' && pendingDeliveryCount > 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={isMobile ? onMobileClose : undefined}
                      className={`group relative flex items-center gap-3 px-3 py-3 rounded-2xl text-[13.5px] font-medium transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                          : 'text-white/50 hover:bg-white/[0.06] hover:text-white hover:backdrop-blur-sm hover:translate-x-1'
                      }`}
                    >
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-60" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-full shadow" />
                        </>
                      )}
                      <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20 backdrop-blur-sm shadow-inner ring-1 ring-white/20'
                          : 'bg-white/[0.06] group-hover:bg-white/10 group-hover:scale-110'
                      }`}>
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} strokeWidth={2} />
                      </div>
                      {!collapsed && (
                        <>
                          <span className="relative truncate font-medium">{item.label}</span>
                          {isActive && <div className="relative ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow" />}
                        </>
                      )}
                      {!collapsed && badgeCount > 0 && item.badgeKey !== undefined && item.label !== 'Laboratorio' && (
                        <span className="relative ml-auto bg-[#ef4444] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md shadow-red-500/20 ring-2 ring-[#0f0a1f]">
                          {badgeCount}
                        </span>
                      )}
                      {!collapsed && showLabDot && (
                        <span className="relative ml-auto bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md shadow-red-500/20 ring-2 ring-[#0f0a1f] animate-pulse">
                          {pendingDeliveryCount}
                        </span>
                      )}
                      {collapsed && (badgeCount > 0 || showLabDot) && (
                        <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0f0a1f] shadow-lg">
                          {badgeCount || pendingDeliveryCount}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        <div className="hidden">
          {extraNavItems.filter(i => !i.permission || hasPermission(i.permission)).map(item => (
            <NavLink key={item.to} to={item.to} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="relative p-3 space-y-3">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 backdrop-blur-sm hover:from-white/[0.1] hover:to-white/[0.05] transition-all group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] via-[#ef4444] to-[#ec4899] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white shadow-md group-hover:scale-105 transition-transform">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f0a1f]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-white/40 capitalize">{user.role === 'admin' ? 'Administrador' : user.role}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
        {collapsed && user && (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-[11px] font-bold text-white shadow-md">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:bg-white/5 hover:text-white/80 transition-all group ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center transition-colors">
            <LogOut className="w-4 h-4 group-hover:text-red-400" />
          </div>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-white/15 text-center tracking-wide">v1.0 · opticællen • Moderno</p>
        )}
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-7 h-7 bg-[#1e1440] border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-[#2d1b6e] hover:border-[#7c3aed]/30 transition-all duration-200 shadow-xl hover:scale-110"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-[100dvh] bg-[#0f0a1f] text-white flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl border-r border-white/5 overflow-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 300, borderTopRightRadius: '24px', borderBottomRightRadius: '24px' }}
      >
        {sidebarContent}
      </aside>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#0f0a1f] text-white flex flex-col z-50 transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1033]/50 via-transparent to-transparent pointer-events-none" />
      <div className="relative flex flex-col h-full">
        {sidebarContent}
      </div>
    </aside>
  );
}
