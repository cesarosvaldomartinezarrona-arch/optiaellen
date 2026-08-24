import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShoppingCart,
  Package, Receipt, FlaskConical, Settings, ChevronLeft, ChevronRight, LogOut, X
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badgeKey?: 'lab';
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
      { to: '/ventas', icon: ShoppingCart, label: 'Ventas', permission: 'ventas' },
      { to: '/inventario', icon: Package, label: 'Inventario', permission: 'inventario' },
      { to: '/gastos', icon: Receipt, label: 'Gastos', permission: 'gastos' },
      { to: '/laboratorio', icon: FlaskConical, label: 'Laboratorio', badgeKey: 'lab', permission: 'laboratorio' },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { to: '/configuracion', icon: Settings, label: 'Configuracion', permission: 'configuracion' },
    ],
  },
];

interface SidebarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ isMobile, mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { deliveryOrders } = useApp();
  const { user, logout, hasPermission } = useAuth();

  const labPending = deliveryOrders.filter(d => d.status !== 'Entregado').length;
  const sidebarWidth = isMobile ? 300 : (collapsed ? 72 : 232);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo — exact like image: centered, purple square, eye, title */}
      <div className="flex flex-col items-center pt-7 pb-6 px-4">
        <div className="w-[48px] h-[48px] rounded-lg bg-[#7c3aed] flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.3)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5.5 5.5 12 5.5C18.5 5.5 23 12 23 12C23 12 18.5 18.5 12 18.5C5.5 18.5 1 12 1 12Z" fill="white" />
            <ellipse cx="12" cy="12" rx="5.2" ry="5.2" fill="#7c3aed" />
            <circle cx="12" cy="12" r="2.3" fill="#0f0a1f" />
            <circle cx="13.5" cy="10.7" r="0.8" fill="white" opacity="0.95" />
          </svg>
        </div>
        {!collapsed && (
          <div className="text-center mt-3">
            <h1 className="text-[15px] font-bold tracking-tight text-white leading-none">
              OptiAEllen
            </h1>
            <p className="text-[11px] text-white/40 mt-1 font-normal">Ver bien es vivir mejor</p>
          </div>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/60">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation — limpio, espacioso, llamativo en activo */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-7">
        {navSections
          .map(section => ({
            ...section,
            items: section.items.filter(item => !item.permission || hasPermission(item.permission)),
          }))
          .filter(section => section.items.length > 0)
          .map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] px-3 mb-3">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  const badge = item.badgeKey === 'lab' ? labPending : 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={isMobile ? onMobileClose : undefined}
                      className={`flex items-center gap-3 px-3 py-[10px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#7c3aed] text-white shadow-[0_2px_10px_rgba(124,58,237,0.35)]'
                          : 'text-[#9ca3b8] hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#9ca3b8]'}`} strokeWidth={isActive ? 2.2 : 1.8} />
                      {!collapsed && <span className="truncate tracking-wide">{item.label}</span>}
                      {!collapsed && badge > 0 && (
                        <span className="ml-auto bg-[#ef4444] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                          {badge}
                        </span>
                      )}
                      {collapsed && badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0f0a1f] shadow">
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
      </nav>

      {/* Footer — limpio */}
      <div className="mt-auto p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.03]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white leading-none truncate">{user.name || 'Admin Ruiz'}</p>
              <p className="text-[11px] text-white/40 leading-none mt-1">{user.role === 'admin' ? 'Administrador' : user.role}</p>
            </div>
            <button onClick={logout} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="Cerrar sesión">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {collapsed && user && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-xs font-bold text-white">AR</div>
            <button onClick={logout} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="Cerrar sesión">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[84px] w-6 h-6 bg-[#1e1a3a] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-[#2a2250] transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-[100dvh] bg-[#0f0a1f] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 300 }}
      >
        {sidebarContent}
      </aside>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#0f0a1f] text-white flex flex-col z-50 transition-all duration-200"
      style={{ width: sidebarWidth }}
    >
      {sidebarContent}
    </aside>
  );
}
