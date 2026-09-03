import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShoppingCart,
  Package, Receipt, FlaskConical, Settings, ChevronLeft, ChevronRight, LogOut, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badgeKey?: 'lab';
  permission?: string;
  highlight?: boolean;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'PRINCIPAL',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', permission: 'panel' },
      { to: '/clientes', icon: Users, label: 'Clientes', permission: 'clientes' },
      { to: '/ticket', icon: FileText, label: 'Ticket de Venta', permission: 'ventas', highlight: true },
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
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ isMobile, mobileOpen, onMobileClose, collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const { deliveryOrders } = useApp();
  const { user, logout, hasPermission } = useAuth();

  const labPending = deliveryOrders.filter(d => d.status !== 'Entregado').length;
  const sidebarWidth = isMobile ? 300 : (collapsed ? 72 : 232);

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo — limpio, centrado */}
      <div className="flex flex-col items-center pt-7 pb-6 px-4 shrink-0 relative">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="OptiAEllen" className="w-14 h-14 object-contain" />
        </div>
        {!collapsed && (
          <div className="text-center mt-3 min-w-0 w-full">
            <h1 className="text-[15px] font-bold tracking-tight text-white leading-none truncate">
              OptiAEllen
            </h1>
            <p className="text-[11px] text-white/45 mt-1 font-normal truncate">Ver bien es vivir mejor</p>
          </div>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/60 shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation — moderno, espacioso, sin recorte */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-7 min-h-0">
        {navSections
          .map(section => ({
            ...section,
            items: section.items.filter(item => !item.permission || hasPermission(item.permission)),
          }))
          .filter(section => section.items.length > 0)
          .map((section) => (
            <div key={section.label} className="min-w-0">
              {!collapsed && (
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em] px-3 mb-3 truncate">
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
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 rounded-lg font-medium transition-colors min-w-0 ${
                        item.highlight && !isActive
                          ? 'py-3 text-[14px] bg-[var(--accent)]/10 text-white border border-[var(--accent)]/25'
                          : 'py-2.5 text-[13px]'
                      } ${
                        isActive
                          ? 'bg-[var(--accent)] text-white shadow-[0_2px_10px_rgba(124,58,237,0.35)]'
                          : !item.highlight ? 'text-[#9ca3b8] hover:text-white hover:bg-white/[0.06]' : ''
                      }`}
                    >
                      <Icon className={`${item.highlight && !isActive ? 'w-5 h-5' : 'w-[18px] h-[18px]'} shrink-0 ${isActive ? 'text-white' : 'text-[#9ca3b8]'}`} strokeWidth={isActive ? 2.2 : 1.8} />
                      {!collapsed && <span className="truncate flex-1 min-w-0 text-left">{item.label}</span>}
                      {!collapsed && badge > 0 && (
                        <span className="ml-auto bg-[#ef4444] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
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

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-white/5">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg bg-white/[0.04] min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-xs font-bold text-white shrink-0">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white leading-none truncate">{user?.name || 'Admin Ruiz'}</p>
              <p className="text-[11px] text-white/45 leading-none mt-1 truncate">{user?.role === 'admin' ? 'Administrador' : user?.role}</p>
            </div>
            <button onClick={logout} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white shrink-0" title="Cerrar sesión">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center text-xs font-bold text-white">AR</div>
            <button onClick={logout} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white" title="Cerrar sesión">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          className="absolute -right-3 top-[84px] w-6 h-6 bg-[#1e1a3a] border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-[#2a2250] transition-colors shadow-md z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-[100dvh] w-[300px] bg-[#0f0a1f] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl will-change-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#0f0a1f] text-white flex flex-col z-50 transition-all duration-200 ease-out will-change-[width]"
      style={{ width: sidebarWidth }}
    >
      {sidebarContent}
    </aside>
  );
}
