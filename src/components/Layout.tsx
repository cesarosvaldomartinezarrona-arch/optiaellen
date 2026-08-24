import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Maximize2 } from 'lucide-react';

export const SidebarContext = createContext({ mobileOpen: false, setMobileOpen: (_v: boolean) => {} });

export default function Layout() {
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(240);
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
    const checkSidebar = () => {
      const aside = document.querySelector('aside');
      if (aside) {
        const w = aside.getBoundingClientRect().width;
        setSidebarWidth(Math.round(w));
      }
    };
    checkSidebar();
    const observer = new MutationObserver(checkSidebar);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const marginStyle = isMobile ? { marginLeft: 0 } : { marginLeft: sidebarWidth };

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-[#eef0ff]">
        {/* Mobile overlay */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <div className="transition-all duration-300" style={marginStyle}>
          <header className="h-[64px] bg-white border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden lg:block">
                <h1 className="text-[15px] font-extrabold text-slate-900 leading-none">Dashboard</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">Resumen general del negocio</p>
              </div>
              {/* Search - desktop */}
              <div className="hidden lg:flex items-center flex-1 max-w-md ml-8">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f1f0ff] rounded-xl border border-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#7c3aed]/20 focus:ring-2 focus:ring-[#7c3aed]/10 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <button className="hidden sm:flex w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center hover:bg-slate-50 transition-colors">
                <Maximize2 className="w-4 h-4 text-slate-600" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow">
                  <span className="text-white text-xs font-bold">{user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('') || 'AR'}</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'Admin Ruiz'}</p>
                  <p className="text-[11px] text-slate-400 capitalize">{user?.role === 'admin' ? 'Administrador' : user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
