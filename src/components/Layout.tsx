import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect, createContext } from 'react';
import { useAuth } from '../context/AuthContext';

export const SidebarContext = createContext({ mobileOpen: false, setMobileOpen: (_v: boolean) => {} });

export default function Layout() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const formatDate = (date: Date) => {
    const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const marginStyle = isMobile ? { marginLeft: 0 } : { marginLeft: sidebarWidth };

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-[#f1f5f9]">
        {/* Mobile overlay */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <div className="transition-all duration-300" style={marginStyle}>
          <header className="h-14 sm:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <span className="text-xs sm:text-sm text-slate-400 font-mono tabular-nums hidden sm:block">{formatDate(currentTime)}</span>
              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="text-white text-xs font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Administrador'}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'admin'}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-3 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
