import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Search, Bell, Maximize2, LayoutDashboard, Users, ShoppingCart, Package, Menu } from 'lucide-react';

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
              {active && <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] rounded-lg shadow-lg shadow-purple-500/20" />}
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState('');

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

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>
      <div className="min-h-screen bg-[#f1f0ff]">
        {isMobile && mobileOpen && (
          <div className="fixed inset-0 bg-[#0f0a1f]/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="transition-all duration-200 ease-out" style={marginStyle}>
          <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-6 sticky top-0 z-30">
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
                <h1 className="text-[15px] font-bold text-slate-900 leading-none tracking-tight whitespace-nowrap">Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Resumen general del negocio</p>
              </div>
              <div className="lg:hidden flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow shrink-0">
                  <span className="text-white text-xs font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-none truncate">{user?.name?.split(' ')[0] || 'Admin'}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">opticællen</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center flex-1 max-w-[320px] ml-6 shrink-0">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-11 pr-4 py-2.5 bg-[#f1f0ff] rounded-lg border border-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#7c3aed]/20 focus:ring-2 focus:ring-[#7c3aed]/10 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="lg:hidden w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <Search className="w-4 h-4 text-slate-600" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 relative">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <button className="hidden sm:flex w-10 h-10 rounded-lg bg-white border border-slate-200 items-center justify-center hover:bg-slate-50">
                <Maximize2 className="w-4 h-4 text-slate-600" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-slate-200">
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow ring-2 ring-purple-100">
                    <span className="text-white text-xs font-bold">{user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('') || 'AR'}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="hidden lg:block min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-none truncate max-w-[140px]">{user?.name || 'Admin Ruiz'}</p>
                  <p className="text-[11px] text-slate-500 capitalize truncate">{user?.role === 'admin' ? 'Administrador' : user?.role}</p>
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
