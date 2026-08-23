import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ChevronRight, Clock, User, Calendar, FlaskConical, CheckCircle2, Scissors, Sparkles, Layers, ShieldCheck } from 'lucide-react';

const phases = [
  { name: 'Recibido', icon: FlaskConical, color: 'text-blue-600 bg-blue-100 border-blue-200' },
  { name: 'Cortando', icon: Scissors, color: 'text-amber-600 bg-amber-100 border-amber-200' },
  { name: 'Puliendo', icon: Sparkles, color: 'text-purple-600 bg-purple-100 border-purple-200' },
  { name: 'Montando', icon: Layers, color: 'text-indigo-600 bg-indigo-100 border-indigo-200' },
  { name: 'Control', icon: ShieldCheck, color: 'text-orange-600 bg-orange-100 border-orange-200' },
  { name: 'Listo', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 border-emerald-200' },
];

export default function Laboratorio() {
  const { labOrders, setLabOrders, patients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ patientId: '', products: '', operator: 'Juan Taller' });

  const handleAdvance = (orderId: string) => {
    setLabOrders(prev => prev.map(o => o.id === orderId && o.phase < 6 ? { ...o, phase: o.phase + 1, status: phases[o.phase].name as any } : o));
  };

  const handleAddOrder = () => {
    if (!newOrder.patientId || !newOrder.products) return;
    const patient = patients.find(p => p.id === newOrder.patientId);
    setLabOrders([...labOrders, {
      id: `LO${String(labOrders.length + 1).padStart(3, '0')}`, saleId: 'V000', patientName: patient?.name || '',
      products: newOrder.products, status: 'Recibido' as const, operator: newOrder.operator,
      startDate: new Date().toISOString().split('T')[0], estimatedDelivery: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], phase: 1,
    }]);
    setShowModal(false);
    setNewOrder({ patientId: '', products: '', operator: 'Juan Taller' });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Laboratorio</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Seguimiento de órdenes de taller</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/25">
          <Plus className="w-4 h-4" /> Nueva Orden
        </button>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {labOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-[#7c3aed]">{order.id}</span>
                  <span className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${order.phase === 6 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{order.status}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{order.patientName}</h3>
              </div>
              {order.phase < 6 && (
                <button onClick={() => handleAdvance(order.id)}
                  className="flex items-center gap-1 sm:gap-1.5 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-purple-200 flex-shrink-0">
                  Avanzar <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">{order.products}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-5 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />{order.operator}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />{order.startDate}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />{order.estimatedDelivery}</div>
            </div>
            {/* Phase progress - scrollable on mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 overflow-x-auto">
              {phases.map((phase, idx) => {
                const PhaseIcon = phase.icon;
                const isCompleted = order.phase > idx;
                const isCurrent = order.phase === idx + 1;
                return (
                  <div key={phase.name} className="flex-1 min-w-[50px] flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 transition-all border-2 ${
                      isCompleted ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-md shadow-purple-500/30' :
                      isCurrent ? `${phase.color} ring-2 sm:ring-4 ring-purple-100` :
                      'bg-white text-slate-300 border-slate-200'
                    }`}>
                      <PhaseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className={`text-center text-[8px] sm:text-[9px] font-bold ${isCurrent ? 'text-[#7c3aed]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>{phase.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Nueva Orden</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><span className="text-slate-500 text-lg">&times;</span></button>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Paciente *</label>
                <select value={newOrder.patientId} onChange={e => setNewOrder({ ...newOrder, patientId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]">
                  <option value="">Seleccionar paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Productos / Trabajo *</label>
                <input type="text" value={newOrder.products} onChange={e => setNewOrder({ ...newOrder, products: e.target.value })}
                  placeholder="Ej: Montura X + Cristal Progresivo" className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Operador</label>
                <input type="text" value={newOrder.operator} onChange={e => setNewOrder({ ...newOrder, operator: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 sm:p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleAddOrder} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25">Crear Orden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
