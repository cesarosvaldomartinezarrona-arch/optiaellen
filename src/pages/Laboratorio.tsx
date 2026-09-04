import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ChevronRight, Clock, User, Calendar, FlaskConical, CheckCircle2, Scissors, Sparkles, Layers, ShieldCheck, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

const phases = [
  { name: 'Recibido', icon: FlaskConical, color: 'text-blue-600 bg-blue-100 border-blue-200' },
  { name: 'Cortando', icon: Scissors, color: 'text-amber-600 bg-amber-100 border-amber-200' },
  { name: 'Puliendo', icon: Sparkles, color: 'text-purple-600 bg-purple-100 border-purple-200' },
  { name: 'Montando', icon: Layers, color: 'text-indigo-600 bg-indigo-100 border-indigo-200' },
  { name: 'Control', icon: ShieldCheck, color: 'text-orange-600 bg-orange-100 border-orange-200' },
  { name: 'Listo', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 border-emerald-200' },
];

export default function Laboratorio() {
  const { labOrders, setLabOrders, patients, opticsName } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ patientId: '', products: '', operator: 'Juan Taller', examName: '', baseType: '' });

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
      examName: newOrder.examName, baseType: newOrder.baseType,
    }]);
    setShowModal(false);
    setNewOrder({ patientId: '', products: '', operator: 'Juan Taller', examName: '', baseType: '' });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const colW = (pageW - margin * 2) / 2;
    const headerH = 25;
    const rowH = 38;
    const startY = headerH + 5;
    const perPage = 6;

    const drawHeader = () => {
      doc.setFillColor(15, 10, 31);
      doc.rect(0, 0, pageW, headerH, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(opticsName || 'Óptica', margin, 10);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Ver bien es vivir mejor', margin, 15);
      doc.setFontSize(9);
      doc.text(`Órdenes de Laboratorio — ${new Date().toLocaleDateString('es-MX')}`, margin, 21);
      doc.setFontSize(8);
      doc.text(`Total: ${labOrders.length} órdenes`, pageW - margin, 10, { align: 'right' });
    };

    drawHeader();

    labOrders.forEach((order, i) => {
      const posInPage = i % perPage;
      if (posInPage === 0 && i > 0) {
        doc.addPage();
        drawHeader();
      }
      const col = posInPage % 2;
      const row = Math.floor(posInPage / 2);
      const x = margin + col * colW;
      const y = startY + row * rowH;

      doc.setDrawColor(220, 220, 230);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, colW - 4, rowH - 4, 2, 2, 'S');

      doc.setFillColor(248, 245, 255);
      doc.roundedRect(x, y, colW - 4, 8, 2, 2, 'F');
      doc.setTextColor(100, 80, 180);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(order.id, x + 3, y + 5.5);

      doc.setTextColor(40, 40, 50);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(order.patientName, x + 3, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 90);
      doc.text(`Examen: ${order.examName || '—'}`, x + 3, y + 19.5);
      doc.text(`Base: ${order.baseType || '—'}`, x + 3, y + 24);
      doc.text(`Trabajo: ${order.products}`, x + 3, y + 28.5);

      doc.setFontSize(6);
      doc.setTextColor(120, 120, 130);
      doc.text(`Inicio: ${order.startDate}  |  Entrega: ${order.estimatedDelivery}`, x + 3, y + 33);
    });

    doc.save(`laboratorio_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Laboratorio</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Seguimiento de órdenes de taller</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm">
            <FileDown className="w-4 h-4" /> Descargar PDF
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[#5b21b6] text-white px-5 sm:px-6 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-[rgba(var(--accent-rgb),0.25)]">
            <Plus className="w-4 h-4" /> Nueva Orden
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {labOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 sm:gap-4 mb-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-[var(--accent)]">{order.id}</span>
                  <span className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold ${order.phase === 6 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{order.status}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{order.patientName}</h3>
              </div>
              {order.phase < 6 && (
                <button onClick={() => handleAdvance(order.id)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-purple-50 hover:bg-purple-100 text-[var(--accent)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors border border-purple-200 flex-shrink-0">
                  Avanzar <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 leading-relaxed">{order.products}</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-5 sm:mb-7 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2"><User className="w-4 h-4 sm:w-4 sm:h-4 text-slate-400" />{order.operator}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 sm:w-4 sm:h-4 text-slate-400" />{order.startDate}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 sm:w-4 sm:h-4 text-slate-400" />{order.estimatedDelivery}</div>
            </div>
            {/* Phase progress - scrollable on mobile */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 rounded-lg p-4 sm:p-6 border border-slate-100 overflow-x-auto">
              {phases.map((phase, idx) => {
                const PhaseIcon = phase.icon;
                const isCompleted = order.phase > idx;
                const isCurrent = order.phase === idx + 1;
                return (
                  <div key={phase.name} className="flex-1 min-w-[60px] sm:min-w-[64px] flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all border-2 ${
                      isCompleted ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md shadow-[rgba(var(--accent-rgb),0.30)]' :
                      isCurrent ? `${phase.color} ring-2 sm:ring-4 ring-[var(--accent-light)]` :
                      'bg-white text-slate-300 border-slate-200'
                    }`}>
                      <PhaseIcon className="w-5 h-5 sm:w-5 sm:h-5" />
                    </div>
                    <p className={`text-center text-[9px] sm:text-[10px] font-bold tracking-wide ${isCurrent ? 'text-[var(--accent)]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>{phase.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Nueva Orden</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><span className="text-slate-500 text-lg">&times;</span></button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Paciente *</label>
                <select value={newOrder.patientId} onChange={e => setNewOrder({ ...newOrder, patientId: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]">
                  <option value="">Seleccionar paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Examen de la vista *</label>
                <input type="text" value={newOrder.examName} onChange={e => setNewOrder({ ...newOrder, examName: e.target.value })}
                  placeholder="Ej: Examen Visual Completo" className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Tipo de base *</label>
                <select value={newOrder.baseType} onChange={e => setNewOrder({ ...newOrder, baseType: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]">
                  <option value="">Seleccionar tipo</option>
                  {['Monofocal', 'Bifocal', 'Progresivo', 'Antirreflejante', 'Blue Light', 'Fotocromático', 'Policarbonato', 'Alto Índice'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Productos / Trabajo *</label>
                <input type="text" value={newOrder.products} onChange={e => setNewOrder({ ...newOrder, products: e.target.value })}
                  placeholder="Ej: Montura X + Cristal Progresivo" className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Operador</label>
                <input type="text" value={newOrder.operator} onChange={e => setNewOrder({ ...newOrder, operator: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]" />
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 sm:p-8 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-6 py-3.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleAddOrder} className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.25)]">Crear Orden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
