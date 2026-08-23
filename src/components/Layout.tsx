import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarWidth, setSidebarWidth] = useState(260);

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

  const formatDate = (date: Date) => {
    const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Sidebar />
      <div className="transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">Sistema activo</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm text-slate-400 font-mono tabular-nums">{formatDate(currentTime)}</span>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">Administrador</p>
                <p className="text-[10px] text-slate-400">admin@optiaellen.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
