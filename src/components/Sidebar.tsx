import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShoppingCart, CreditCard, Truck,
  Package, FlaskConical, Receipt, Settings, ChevronLeft, ChevronRight, LogOut
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

// Hidden from main nav but still accessible via direct URL / workflow
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

  const sidebarWidth = isMobile ? 280 : (collapsed ? 76 : 240);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex flex-col items-center pt-6 pb-5 px-4">
        <div className="w-12 h-12 rounded-2xl bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 6 6 12 6C18 6 22 12 22 12C22 12 18 18 12 18C6 18 2 12 2 12Z" fill="white" fillOpacity="0.95" />
            <circle cx="12" cy="12" r="4.5" fill="#7c3aed" stroke="#6d28d9" strokeWidth="0.5" />
            <circle cx="12" cy="12" r="2.2" fill="#1a0e2e" />
            <circle cx="13.2" cy="10.8" r="0.7" fill="white" opacity="0.9" />
          </svg>
        </div>
        {!collapsed && (
          <div className="text-center mt-3">
            <h1 className="text-[15px] font-extrabold tracking-tight text-white">
              Opti<span className="text-[#a78bfa]">A</span>Ellen
            </h1>
            <p className="text-[9px] text-white/30 tracking-wide mt-0.5">Ver bien es vivir mejor</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-5">
        {navSections
          .map(section => ({
            ...section,
            items: section.items.filter(item => !item.permission || hasPermission(item.permission)),
          }))
          .filter(section => section.items.length > 0)
          .map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.18em] px-3 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                  // laboratorio gets red dot with count 3 if there are pending lab orders (simulate as per image)
                  const showLabDot = item.label === 'Laboratorio' && pendingDeliveryCount > 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={isMobile ? onMobileClose : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/20'
                          : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/45 group-hover:text-white/70'}`} strokeWidth={2} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && badgeCount > 0 && item.badgeKey !== undefined && item.label !== 'Laboratorio' && (
                        <span className="ml-auto bg-[#ef4444] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {badgeCount}
                        </span>
                      )}
                      {!collapsed && showLabDot && (
                        <span className="ml-auto bg-[#ef4444] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {pendingDeliveryCount}
                        </span>
                      )}
                      {collapsed && (badgeCount > 0 || showLabDot) && (
                        <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0f0a1f]">
                          {badgeCount || pendingDeliveryCount}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        {/* Hidden extra items: show only if permission and not already visible */}
        <div className="hidden">
          {extraNavItems.filter(i => !i.permission || hasPermission(i.permission)).map(item => (
            <NavLink key={item.to} to={item.to} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-3 py-4 space-y-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/35 capitalize">{user.role === 'admin' ? 'Administrador' : user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-white/40 hover:bg-white/5 hover:text-white/70 transition-all ${collapsed ? 'justify-center' : ''}`}
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 bg-[#1a1030] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-[#2d1b4e] transition-all duration-200 shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </>
  );

  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0f0a1f] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 280 }}
      >
        {sidebarContent}
      </aside>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#0f0a1f] text-white flex flex-col z-50 transition-all duration-300 ease-in-out"
      style={{ width: sidebarWidth }}
    >
      {sidebarContent}
    </aside>
  );
}
