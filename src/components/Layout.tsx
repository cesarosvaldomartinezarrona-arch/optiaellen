import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect, createContext, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Search, Bell, Maximize2, LayoutDashboard, Users, ShoppingCart, Package, Menu, X, AlertTriangle, Clock, DollarSign, CheckCircle } from 'lucide-react';

export const SidebarContext = createContext({ mobileOpen: false, setMobileOpen: (_v: boolean) => {}, collapsed: false, setCollapsed: (_v: boolean) => {} });

function MobileBottomNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const location = useLocation();
  const { deliveryOrders } = useApp();
  const pendingLab = deliveryOrders.filter(d => d.status !== 'Entregado').length;
  const items = [
    { to: '/', icon: LayoutDashboard, label: 'Inicio' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { to: '/inventario', icon: Package, label: 'Stock' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md bg-[#0f0a1f]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl shadow-black/30 flex items-center justify-around px-2 py-2">
        {items.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${active ? 'text-white' : 'text-white/50'}`}
            >
              {active && <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-lg shadow-lg shadow-[rgba(var(--accent-rgb),0.20)]" />}
              <Icon className={`relative w-5 h-5 ${active ? 'text-white' : 'text-white/60'}`} strokeWidth={active ? 2.5 : 2} />
              <span className={`relative text-[11px] font-semibold tracking-wide ${active ? 'text-white' : 'text-white/60'}`}>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={onMenuOpen}
          className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-white/60 hover:text-white transition-colors min-w-[64px]"
        >
          <div className="relative w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Menu className="w-5 h-5" />
            {pendingLab > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f0a1f]">{pendingLab}</span>}
          </div>
          <span className="text-[11px] font-semibold">Menú</span>
        </button>
      </div>
    </nav>
  );
}

export default function Layout() {
  const { user } = useAuth();
  const { pendingPayments, products, labOrders, sales } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? 72 : 232;
  const marginStyle = isMobile ? { marginLeft: 0 } : { marginLeft: sidebarWidth };

  const notifications = useMemo(() => {
    const items: { id: string; icon: any; color: string; bg: string; title: string; desc: string; time: string }[] = [];
    pendingPayments.filter(p => p.status === 'Pendiente').forEach(p => {
      items.push({ id: `cobro-${p.id}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', title: `Pago pendiente: ${p.patientName}`, desc: `$${p.pending.toLocaleString()} pendientes`, time: 'Ahora' });
    });
    products.filter(p => p.stock < 10).forEach(p => {
      items.push({ id: `stock-${p.id}`, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', title: `Stock bajo: ${p.name}`, desc: `Solo ${p.stock} piezas`, time: 'Inventario' });
    });
    labOrders.filter(o => o.phase < 6).forEach(o => {
      items.push({ id: `lab-${o.id}`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', title: `Laboratorio: ${o.patientName}`, desc: `${o.status} — Entrega: ${o.estimatedDelivery}`, time: 'Taller' });
    });
    sales.filter(s => s.status === 'Pagado').slice(-3).forEach(s => {
      items.push({ id: `venta-${s.id}`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', title: `Venta completada: ${s.patientName}`, desc: `$${s.total.toLocaleString()} — ${s.paymentMethod || ''}`, time: 'Ventas' });
    });
    return items;
  }, [pendingPayments, products, labOrders, sales]);

  const visibleNotifs = notifications.filter(n => !dismissed.has(n.id));
  const unreadCount = visibleNotifs.length;

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {isMobile && mobileOpen && (
          <div className="fixed inset-0 bg-[#0f0a1f]/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="transition-all duration-200 ease-out" style={marginStyle}>
          <header className="h-[64px] border-b flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-6 sticky top-0 z-30" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Abrir menú"
                className="lg:hidden shrink-0 w-10 h-10 rounded-lg bg-[#0f0a1f] hover:bg-[#1a1033] flex items-center justify-center transition-colors"
              >
                <span className="w-5 flex flex-col gap-1.5">
                  <span className={`block h-0.5 bg-white rounded-full transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 bg-white rounded-full transition-all ${mobileOpen ? 'opacity-0' : 'w-3'}`} />
                  <span className={`block h-0.5 bg-white rounded-full transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </span>
              </button>
              <div className="hidden lg:block shrink-0">
                <h1 className="text-[15px] font-bold leading-none tracking-tight whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                <p className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Resumen general del negocio</p>
              </div>
              <div className="lg:hidden flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center shadow shrink-0">
                  <span className="text-white text-xs font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-none truncate" style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'Admin'}</p>
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>opticællen</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center flex-1 max-w-[320px] ml-8 shrink-0">
                <div className="relative flex w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full py-2.5 rounded-lg border border-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:border-[var(--accent)]/20 focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', paddingLeft: '44px', paddingRight: '16px' }}
                  />
                </div>
              </div>
            </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="lg:hidden w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-slate-50" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-slate-50 relative" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <Bell className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2" style={{ borderColor: 'var(--bg-primary)' }}>{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-12 w-[380px] max-h-[480px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Notificaciones</h3>
                        <span className="text-[11px] font-semibold text-slate-400">{unreadCount} nuevas</span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {visibleNotifs.length === 0 ? (
                          <div className="p-8 text-center">
                            <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-400">Todo al día</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {visibleNotifs.map(n => {
                              const Icon = n.icon;
                              return (
                                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors">
                                  <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <Icon className={`w-4 h-4 ${n.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-800 leading-tight">{n.title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                  </div>
                                  <button onClick={() => setDismissed(prev => new Set(prev).add(n.id))} className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {visibleNotifs.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                          <button onClick={() => setDismissed(new Set(notifications.map(n => n.id)))} className="w-full text-center text-[11px] font-semibold text-[var(--accent)] hover:underline">
                            Marcar todo como leído
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button className="hidden sm:flex w-10 h-10 rounded-lg border items-center justify-center hover:bg-slate-50" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <Maximize2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center shadow ring-2 ring-[var(--accent-light)]">
                    <span className="text-white text-xs font-bold">{user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('') || 'AR'}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="hidden lg:block min-w-0">
                  <p className="text-sm font-semibold leading-none truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Admin Ruiz'}</p>
                  <p className="text-[11px] capitalize truncate" style={{ color: 'var(--text-secondary)' }}>{user?.role === 'admin' ? 'Administrador' : user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-7 xl:p-8 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </main>

          {isMobile && <MobileBottomNav onMenuOpen={() => setMobileOpen(true)} />}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
