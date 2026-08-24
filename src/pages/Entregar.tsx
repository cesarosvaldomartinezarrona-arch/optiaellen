import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Package, CheckCircle2, Phone } from 'lucide-react';

export default function Entregar() {
  const { deliveryOrders, setDeliveryOrders } = useApp();
  const [filter, setFilter] = useState<'todos' | 'Preparando' | 'Listo para entregar'>('todos');

  const filtered = deliveryOrders.filter(d => filter === 'todos' ? d.status !== 'Entregado' : d.status === filter);

  const handleDeliver = (id: string) => {
    setDeliveryOrders(prev => prev.map(d => d.id === id ? { ...d, status: 'Entregado' as const } : d));
  };

  const statusConfig = {
    'Preparando': { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700 border border-amber-200', progress: 50 },
    'Listo para entregar': { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', progress: 80 },
    'Entregado': { bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-600 border border-slate-200', progress: 100 },
  };

  const summaryStats = [
    { label: 'Pendientes', value: deliveryOrders.filter(d => d.status === 'Preparando').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Listos', value: deliveryOrders.filter(d => d.status === 'Listo para entregar').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Entregados', value: deliveryOrders.filter(d => d.status === 'Entregado').length, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Entregar</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Gestión de pedidos y logística de entrega</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {summaryStats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg border border-slate-200/80 p-3 sm:p-5 text-center shadow-sm`}>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['todos', 'Preparando', 'Listo para entregar'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map(order => {
          const config = statusConfig[order.status];
          return (
            <div key={order.id} className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${config.bg}`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-bold text-[#7c3aed] bg-purple-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg">{order.id}</span>
                  <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold ${config.badge}`}>{order.status}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 sm:mb-3">{order.patientName}</h3>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500"><Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" /><span className="truncate">{order.products}</span></div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500"><Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" /><span>{order.patientPhone}</span></div>
                </div>
                <div className="mt-3 sm:mt-4"><div className="h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full transition-all" style={{ width: `${config.progress}%` }} /></div></div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 sm:mt-2">Pedido: {order.saleId} · {order.createdAt}</p>
              </div>
              {order.status !== 'Entregado' && (
                <div className="border-t border-slate-200/50 p-3 bg-white/50">
                  {order.status === 'Listo para entregar' ? (
                    <button onClick={() => handleDeliver(order.id)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition-all">
                      <CheckCircle2 className="w-4 h-4" /> Entregar
                    </button>
                  ) : (
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed">
                      <Truck className="w-4 h-4" /> En Preparación...
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
