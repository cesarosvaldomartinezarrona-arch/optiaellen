import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Eye, Calendar, Stethoscope, X, FileDown, Printer, Check, Glasses, Scissors as Treatment, Sparkles } from 'lucide-react';
import type { Prescription, EyeData, SelectedLens, Treatment as TreatmentType } from '../types';
import { availableLenses, availableTreatments } from '../data/mockData';
import jsPDF from 'jspdf';

const emptyEye: EyeData = { sph: '', cyl: '', axis: '', prisma: '', add: '', dp: '', av: '' };

function buildTicketHTML(opticsName: string, rx: Prescription): string {
  return `<!DOCTYPE html>
<html><head><title>Ticket Receta</title>
<style>
  @page { size: 80mm auto; margin: 2mm; }
  body { font-family: 'Courier New', monospace; font-size: 11px; width: 76mm; margin: 0; padding: 2mm; color: #000; }
  .center { text-align: center; } .bold { font-weight: bold; } .big { font-size: 14px; } .small { font-size: 9px; }
  table { width: 100%; border-collapse: collapse; } td { padding: 1px 2px; } .right { text-align: right; }
  .line { border-top: 1px dashed #000; margin: 3px 0; } .dbl { border-top: 2px solid #000; margin: 3px 0; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style></head><body>
  <div class="center bold big">${opticsName}</div>
  <div class="center small">Ver bien es vivir mejor</div>
  <div class="center small">RECETA OPTOMÉTRICA</div>
  <div class="dbl"></div>
  <table>
    <tr><td class="bold">Receta:</td><td class="right">${rx.id}</td></tr>
    <tr><td class="bold">Fecha:</td><td class="right">${rx.date}</td></tr>
    <tr><td class="bold">Paciente:</td><td class="right">${rx.patientName}</td></tr>
    <tr><td class="bold">Doctor:</td><td class="right">${rx.doctor}</td></tr>
  </table>
  <div class="line"></div>
  <div class="center bold">--- OJO DERECHO (OD) ---</div>
  <table>
    <tr><td class="bold">Esfera:</td><td class="right">${rx.rightEye.sph || '—'}</td></tr>
    <tr><td class="bold">Cilindro:</td><td class="right">${rx.rightEye.cyl || '—'}</td></tr>
    <tr><td class="bold">Eje:</td><td class="right">${rx.rightEye.axis || '—'}</td></tr>
    <tr><td class="bold">Prisma:</td><td class="right">${rx.rightEye.prisma || '—'}</td></tr>
    <tr><td class="bold">Adición:</td><td class="right">${rx.rightEye.add || '—'}</td></tr>
    <tr><td class="bold">DP:</td><td class="right">${rx.rightEye.dp || '—'}</td></tr>
    <tr><td class="bold">Agudeza:</td><td class="right">${rx.rightEye.av || '—'}</td></tr>
  </table>
  <div class="line"></div>
  <div class="center bold">--- OJO IZQUIERDO (OI) ---</div>
  <table>
    <tr><td class="bold">Esfera:</td><td class="right">${rx.leftEye.sph || '—'}</td></tr>
    <tr><td class="bold">Cilindro:</td><td class="right">${rx.leftEye.cyl || '—'}</td></tr>
    <tr><td class="bold">Eje:</td><td class="right">${rx.leftEye.axis || '—'}</td></tr>
    <tr><td class="bold">Prisma:</td><td class="right">${rx.leftEye.prisma || '—'}</td></tr>
    <tr><td class="bold">Adición:</td><td class="right">${rx.leftEye.add || '—'}</td></tr>
    <tr><td class="bold">DP:</td><td class="right">${rx.leftEye.dp || '—'}</td></tr>
    <tr><td class="bold">Agudeza:</td><td class="right">${rx.leftEye.av || '—'}</td></tr>
  </table>
  <div class="line"></div>
  ${rx.selectedLenses && rx.selectedLenses.length > 0 ? `
  <div class="bold">Lentes Seleccionados:</div>
  ${rx.selectedLenses.map(l => `<div class="small">${l.name} (${l.brand}) x${l.quantity} — $${(l.price * l.quantity).toLocaleString()}</div>`).join('')}
  <div class="bold right">Subtotal Lentes: $${rx.totalLenses.toLocaleString()}</div>
  ` : ''}
  ${rx.treatments && rx.treatments.length > 0 ? `
  <div class="bold">Tratamientos:</div>
  ${rx.treatments.map(t => `<div class="small">${t.name} — $${t.price.toLocaleString()}</div>`).join('')}
  <div class="bold right">Subtotal Tratamientos: $${rx.totalTreatments.toLocaleString()}</div>
  ` : ''}
  ${(rx.totalLenses > 0 || rx.totalTreatments > 0) ? `
  <div class="line"></div>
  <div class="bold big right">TOTAL: $${rx.grandTotal.toLocaleString()}</div>
  ` : ''}
  <div class="line"></div>
  <div class="bold">Notas:</div><div class="small">${rx.recommendations || '—'}</div>
  <div class="bold">Obs:</div><div class="small">${rx.observations || '—'}</div>
  <div class="dbl"></div>
  <div class="center small">${opticsName} — ${rx.doctor}</div>
  <div class="center small">${new Date().toLocaleString('es-MX')}</div>
  <div class="dbl"></div><br/>
</body></html>`;
}

function openTicketWindow(html: string) {
  const w = window.open('', '_blank', 'width=300,height=600');
  if (!w) { alert('Permita ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400);
}

function generatePDF(opticsName: string, rx: Prescription) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 14, 46); doc.rect(0, 0, pageW, 42, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.text(opticsName, pageW / 2, 18, { align: 'center' });
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Ver bien es vivir mejor', pageW / 2, 25, { align: 'center' });
  doc.setFontSize(10); doc.text('Receta / Examen Optométrico', pageW / 2, 35, { align: 'center' });
  doc.setFillColor(248, 250, 252); doc.roundedRect(15, 48, pageW - 30, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240); doc.roundedRect(15, 48, pageW - 30, 28, 3, 3, 'S');
  doc.setTextColor(30, 41, 59); doc.setFontSize(10);
  doc.setFont('helvetica', 'bold'); doc.text('Paciente: ', 22, 58);
  doc.setFont('helvetica', 'normal'); doc.text(rx.patientName, 48, 58);
  doc.setFont('helvetica', 'bold'); doc.text('Fecha: ', 22, 66);
  doc.setFont('helvetica', 'normal'); doc.text(rx.date, 42, 66);
  doc.setFont('helvetica', 'bold'); doc.text('Doctor: ', 110, 58);
  doc.setFont('helvetica', 'normal'); doc.text(rx.doctor, 132, 58);
  const eyeY = 84; const colW = (pageW - 40) / 2;
  const drawEyeData = (x: number, title: string, data: EyeData) => {
    doc.setFillColor(124, 58, 237); doc.roundedRect(x, eyeY, colW, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(title, x + colW / 2, eyeY + 5.5, { align: 'center' });
    doc.setFillColor(255, 255, 255); doc.setDrawColor(226, 232, 240); doc.roundedRect(x, eyeY + 10, colW, 58, 2, 2, 'FD');
    const fields: [string, string][] = [['Esfera', data.sph], ['Cilindro', data.cyl], ['Eje', data.axis], ['Prisma', data.prisma], ['Adición', data.add], ['DP', data.dp], ['Agudeza', data.av]];
    fields.forEach(([label, value], i) => {
      const fy = eyeY + 18 + i * 7;
      doc.setTextColor(100, 116, 139); doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.text(label, x + 5, fy);
      doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.text(value || '—', x + colW - 5, fy, { align: 'right' });
    });
  };
  drawEyeData(15, 'Ojo Derecho (OD)', rx.rightEye);
  drawEyeData(20 + colW, 'Ojo Izquierdo (OI)', rx.leftEye);

  let yPos = eyeY + 76;
  if (rx.selectedLenses && rx.selectedLenses.length > 0) {
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, yPos, pageW - 30, 8 + rx.selectedLenses.length * 7, 3, 3, 'FD');
    doc.setTextColor(30, 41, 59); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('Lentes Seleccionados:', 22, yPos + 7);
    rx.selectedLenses.forEach((l, i) => {
      doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
      doc.text(`${l.name} (${l.brand}) x${l.quantity} — $${(l.price * l.quantity).toLocaleString()}`, 22, yPos + 14 + i * 7);
    });
    yPos += 12 + rx.selectedLenses.length * 7;
  }
  if (rx.treatments && rx.treatments.length > 0) {
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, yPos, pageW - 30, 8 + rx.treatments.length * 7, 3, 3, 'FD');
    doc.setTextColor(30, 41, 59); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('Tratamientos:', 22, yPos + 7);
    rx.treatments.forEach((t, i) => {
      doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
      doc.text(`${t.name} — $${t.price.toLocaleString()}`, 22, yPos + 14 + i * 7);
    });
    yPos += 12 + rx.treatments.length * 7;
  }
  if (rx.grandTotal > 0) {
    doc.setFillColor(124, 58, 237); doc.roundedRect(15, yPos, pageW - 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: $${rx.grandTotal.toLocaleString()}`, pageW - 20, yPos + 7, { align: 'right' });
    yPos += 16;
  }
  doc.setFillColor(26, 14, 46); doc.rect(0, 270, pageW, 27, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8);
  doc.text(`${opticsName} — ${rx.doctor}`, pageW / 2, 280, { align: 'center' });
  doc.save(`Receta_${rx.patientName.replace(/\s+/g, '_')}_${rx.id}.pdf`);
}

export default function Recetas() {
  const { prescriptions, setPrescriptions, patients, opticsName } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [activeTab, setActiveTab] = useState<'todas' | 'vigentes' | 'pasadas'>('todas');
  const [newRx, setNewRx] = useState({
    patientId: '', doctor: 'Dr. Elena Ruiz', status: 'Vigente' as Prescription['status'],
    rightEye: { ...emptyEye }, leftEye: { ...emptyEye }, recommendations: '', observations: '',
    selectedLenses: [] as SelectedLens[], treatments: [] as TreatmentType[],
  });

  const filtered = prescriptions.filter(rx => {
    if (activeTab === 'vigentes') return rx.status === 'Vigente';
    if (activeTab === 'pasadas') return rx.status === 'Vencida' || rx.status === 'Pendiente';
    return true;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'Vigente': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Vencida': return 'bg-red-50 text-red-700 border border-red-200';
      case 'Pendiente': return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const toggleLens = (lens: SelectedLens) => {
    setNewRx(prev => {
      const exists = prev.selectedLenses.find(l => l.id === lens.id);
      if (exists) return { ...prev, selectedLenses: prev.selectedLenses.filter(l => l.id !== lens.id) };
      return { ...prev, selectedLenses: [...prev.selectedLenses, { ...lens }] };
    });
  };

  const toggleTreatment = (treatment: TreatmentType) => {
    setNewRx(prev => {
      const exists = prev.treatments.find(t => t.id === treatment.id);
      if (exists) return { ...prev, treatments: prev.treatments.filter(t => t.id !== treatment.id) };
      return { ...prev, treatments: [...prev.treatments, { ...treatment }] };
    });
  };

  const calcTotals = () => {
    const totalLenses = newRx.selectedLenses.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const totalTreatments = newRx.treatments.reduce((sum, t) => sum + t.price, 0);
    return { totalLenses, totalTreatments, grandTotal: totalLenses + totalTreatments };
  };

  const handleAdd = () => {
    if (!newRx.patientId) return;
    const patient = patients.find(p => p.id === newRx.patientId);
    const totals = calcTotals();
    const rx: Prescription = {
      id: `R${String(prescriptions.length + 1).padStart(3, '0')}`, patientId: newRx.patientId,
      patientName: patient?.name || '', date: new Date().toISOString().split('T')[0],
      doctor: newRx.doctor, status: newRx.status,
      rightEye: newRx.rightEye, leftEye: newRx.leftEye,
      recommendations: newRx.recommendations, observations: newRx.observations,
      selectedLenses: newRx.selectedLenses, treatments: newRx.treatments,
      ...totals,
    };
    setPrescriptions([...prescriptions, rx]);
    setShowModal(false);
    setNewRx({ patientId: '', doctor: 'Dr. Elena Ruiz', status: 'Vigente', rightEye: { ...emptyEye }, leftEye: { ...emptyEye }, recommendations: '', observations: '', selectedLenses: [], treatments: [] });
  };

  const EyeForm = ({ label, data, onChange, readonly = false }: { label: string; data: EyeData; onChange: (d: EyeData) => void; readonly?: boolean }) => {
    const isOD = label.includes('OD');
    return (
      <div className="bg-[#fafaf8] rounded-lg border border-slate-200/70 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200/60">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${isOD ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-white' : 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white'}`}>
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#1e3a6e] leading-none">{label}</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{isOD ? 'Ojo Derecho' : 'Ojo Izquierdo'}</p>
          </div>
          <div className={`ml-auto w-2 h-2 rounded-full ${isOD ? 'bg-[var(--accent)]' : 'bg-[#2563eb]'} animate-pulse`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Esfera (SPH)</label>
            <input type="text" value={data.sph} onChange={e => onChange({ ...data, sph: e.target.value })} readOnly={readonly}
              placeholder="+0.00"
              className={`w-full px-4 py-3.5 rounded-lg border text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-800 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] shadow-sm'}`} />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Cilindro (CYL)</label>
            <input type="text" value={data.cyl} onChange={e => onChange({ ...data, cyl: e.target.value })} readOnly={readonly}
              placeholder="-0.00"
              className={`w-full px-4 py-3.5 rounded-lg border text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-800 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] shadow-sm'}`} />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Eje (AXIS)</label>
            <input type="text" value={data.axis} onChange={e => onChange({ ...data, axis: e.target.value })} readOnly={readonly}
              placeholder="0 - 180"
              className={`w-full px-4 py-3.5 rounded-lg border text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-800 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] shadow-sm'}`} />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Prisma</label>
            <input type="text" value={data.prisma} onChange={e => onChange({ ...data, prisma: e.target.value })} readOnly={readonly}
              placeholder="0.00"
              className={`w-full px-4 py-3.5 rounded-lg border text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-800 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] shadow-sm'}`} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-[12px] font-bold text-slate-700 mb-2">Adición (ADD)</label>
          <input type="text" value={data.add} onChange={e => onChange({ ...data, add: e.target.value })} readOnly={readonly}
            placeholder="+0.00"
            className={`w-full px-4 py-3.5 rounded-lg border text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-800 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] shadow-sm'}`} />
        </div>
        {/* DP y AV como campos secundarios colapsables */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/40">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">DP (mm)</label>
            <input type="text" value={data.dp} onChange={e => onChange({ ...data, dp: e.target.value })} readOnly={readonly}
              placeholder="32"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-700 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)]'}`} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agudeza Visual</label>
            <input type="text" value={data.av} onChange={e => onChange({ ...data, av: e.target.value })} readOnly={readonly}
              placeholder="20/20"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${readonly ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-slate-200 text-slate-700 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)]'}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Recetas</h1>
          <p className="text-slate-500 text-sm mt-1">Exámenes optométricos, lentes y tratamientos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[#5b21b6] text-white px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[rgba(var(--accent-rgb),0.25)] hover:shadow-[rgba(var(--accent-rgb),0.40)] hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Nuevo Examen
        </button>
      </div>

      <div className="flex gap-1 bg-white rounded-lg p-1.5 border border-slate-200/60 w-fit shadow-sm">
        {(['todas', 'vigentes', 'pasadas'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-[var(--accent)] text-white shadow-md shadow-[rgba(var(--accent-rgb),0.25)]' : 'text-slate-500 hover:bg-slate-50'}`}>
            {tab === 'todas' ? 'Todas' : tab === 'vigentes' ? 'Vigentes' : 'Pasadas'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(rx => (
          <div key={rx.id} className="bg-white rounded-lg border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--accent)] bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">{rx.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor(rx.status)}`}>{rx.status}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-3 group-hover:text-[var(--accent)] transition-colors">{rx.patientName}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500"><Calendar className="w-4 h-4 text-slate-400" />{rx.date}</div>
                <div className="flex items-center gap-2 text-slate-500"><Stethoscope className="w-4 h-4 text-slate-400" />{rx.doctor}</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-lg p-3.5 text-center border border-purple-100/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OD</p>
                  <p className="text-lg font-extrabold text-[var(--accent)] mt-1">{rx.rightEye.sph || '—'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rx.rightEye.cyl && `CYL ${rx.rightEye.cyl}`} {rx.rightEye.prisma && rx.rightEye.prisma !== '0.00' ? `· Prisma ${rx.rightEye.prisma}` : ''}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50/50 rounded-lg p-3.5 text-center border border-blue-100/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OI</p>
                  <p className="text-lg font-extrabold text-[#2563eb] mt-1">{rx.leftEye.sph || '—'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rx.leftEye.cyl && `CYL ${rx.leftEye.cyl}`} {rx.leftEye.prisma && rx.leftEye.prisma !== '0.00' ? `· Prisma ${rx.leftEye.prisma}` : ''}</p>
                </div>
              </div>
              {rx.grandTotal > 0 && (
                <div className="mt-3 bg-gradient-to-r from-purple-50 to-slate-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex justify-between text-xs text-slate-500">
                    {rx.totalLenses > 0 && <span>Lentes: ${rx.totalLenses.toLocaleString()}</span>}
                    {rx.totalTreatments > 0 && <span>Tratamientos: ${rx.totalTreatments.toLocaleString()}</span>}
                  </div>
                  <p className="text-base font-extrabold text-[var(--accent)] mt-1">Total: ${rx.grandTotal.toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 p-3 bg-slate-50/30 flex gap-2">
              <button onClick={() => setViewPrescription(rx)} className="flex-1 flex items-center justify-center gap-2 text-[var(--accent)] hover:text-white hover:bg-[var(--accent)] text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all">
                <Eye className="w-4 h-4" /> Ver
              </button>
              <button onClick={() => generatePDF(opticsName, rx)} className="flex-1 flex items-center justify-center gap-2 text-emerald-600 hover:text-white hover:bg-emerald-500 text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all">
                <FileDown className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => openTicketWindow(buildTicketHTML(opticsName, rx))} className="flex-1 flex items-center justify-center gap-2 text-amber-600 hover:text-white hover:bg-amber-500 text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all">
                <Printer className="w-4 h-4" /> Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Detail Modal */}
      {viewPrescription && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f9fb] rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/60">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[var(--accent)]" /> Receta {viewPrescription.id}</h2>
                <p className="text-sm text-slate-500">{viewPrescription.patientName} — {viewPrescription.date} · {viewPrescription.doctor}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => generatePDF(opticsName, viewPrescription)} className="hidden sm:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md">
                  <FileDown className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => openTicketWindow(buildTicketHTML(opticsName, viewPrescription))} className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md">
                  <Printer className="w-4 h-4" /> Ticket
                </button>
                <button onClick={() => setViewPrescription(null)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EyeForm label="Refracción Final (OD)" data={viewPrescription.rightEye} onChange={() => {}} readonly />
                <EyeForm label="Refracción Final (OI)" data={viewPrescription.leftEye} onChange={() => {}} readonly />
              </div>
              {viewPrescription.selectedLenses && viewPrescription.selectedLenses.length > 0 && (
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Glasses className="w-4 h-4 text-[var(--accent)]" /> Lentes Seleccionados</h4>
                  <div className="space-y-2">
                    {viewPrescription.selectedLenses.map(l => (
                      <div key={l.id} className="flex justify-between items-center bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{l.name}</p>
                          <p className="text-xs text-slate-400">{l.brand} · {l.type} · Cant: {l.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-[var(--accent)]">${(l.price * l.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-500">Subtotal Lentes:</span>
                    <span className="text-sm font-bold text-slate-900">${viewPrescription.totalLenses.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {viewPrescription.treatments && viewPrescription.treatments.length > 0 && (
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Treatment className="w-4 h-4 text-[var(--accent)]" /> Tratamientos</h4>
                  <div className="space-y-2">
                    {viewPrescription.treatments.map(t => (
                      <div key={t.id} className="flex justify-between items-center bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.description}</p>
                        </div>
                        <span className="text-sm font-bold text-[var(--accent)]">${t.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-500">Subtotal Tratamientos:</span>
                    <span className="text-sm font-bold text-slate-900">${viewPrescription.totalTreatments.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {viewPrescription.grandTotal > 0 && (
                <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] rounded-lg p-5 text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.20)]">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold">TOTAL ESTIMADO</span>
                    <span className="text-2xl font-extrabold">${viewPrescription.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Recomendaciones</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{viewPrescription.recommendations || 'Sin notas.'}</p>
                </div>
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Observaciones</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{viewPrescription.observations || 'Sin observaciones.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f9fb] rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/60">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[var(--accent)]" /> Nuevo Examen Optométrico</h2>
                <p className="text-xs text-slate-400 mt-1">Complete los datos de refracción final para cada ojo</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Patient & Doctor */}
              <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Paciente *</label>
                    <select value={newRx.patientId} onChange={e => setNewRx({ ...newRx, patientId: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] font-medium">
                      <option value="">Seleccionar paciente</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Doctor</label>
                    <input type="text" value={newRx.doctor} onChange={e => setNewRx({ ...newRx, doctor: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] font-medium" />
                  </div>
                </div>
              </div>

              {/* Eye Data - Modern Refraction Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EyeForm label="Refracción Final (OD)" data={newRx.rightEye} onChange={d => setNewRx({ ...newRx, rightEye: d })} />
                <EyeForm label="Refracción Final (OI)" data={newRx.leftEye} onChange={d => setNewRx({ ...newRx, leftEye: d })} />
              </div>

              {/* Lenses Selection */}
              <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-200/60 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Glasses className="w-4 h-4 text-[var(--accent)]" /> Seleccionar Lentes</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableLenses.map(lens => {
                    const isSelected = newRx.selectedLenses.some(l => l.id === lens.id);
                    return (
                      <button key={lens.id} onClick={() => toggleLens(lens)}
                        className={`text-left p-3.5 rounded-lg border-2 transition-all ${isSelected ? 'border-[var(--accent)] bg-purple-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{lens.name}</span>
                          {isSelected && <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                        </div>
                        <p className="text-[10px] text-slate-400">{lens.brand} · {lens.type}</p>
                        <p className="text-sm font-extrabold text-[var(--accent)] mt-1.5">${lens.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">x{lens.quantity}</span></p>
                      </button>
                    );
                  })}
                </div>
                {newRx.selectedLenses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                    <span className="text-sm font-semibold text-slate-500">Subtotal Lentes:</span>
                    <span className="text-sm font-bold text-[var(--accent)]">${calcTotals().totalLenses.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Treatments Selection */}
              <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-200/60 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Treatment className="w-4 h-4 text-[var(--accent)]" /> Seleccionar Tratamientos</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableTreatments.map(treatment => {
                    const isSelected = newRx.treatments.some(t => t.id === treatment.id);
                    return (
                      <button key={treatment.id} onClick={() => toggleTreatment(treatment)}
                        className={`text-left p-3.5 rounded-lg border-2 transition-all ${isSelected ? 'border-[var(--accent)] bg-purple-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{treatment.name}</span>
                          {isSelected && <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                        </div>
                        <p className="text-[10px] text-slate-400">{treatment.description}</p>
                        <p className="text-sm font-extrabold text-[var(--accent)] mt-1.5">${treatment.price.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
                {newRx.treatments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                    <span className="text-sm font-semibold text-slate-500">Subtotal Tratamientos:</span>
                    <span className="text-sm font-bold text-[var(--accent)]">${calcTotals().totalTreatments.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              {(newRx.selectedLenses.length > 0 || newRx.treatments.length > 0) && (
                <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] rounded-lg p-5 text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.20)]">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold">TOTAL ESTIMADO</span>
                    <span className="text-2xl font-extrabold">${calcTotals().grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Recomendaciones</label>
                  <textarea value={newRx.recommendations} onChange={e => setNewRx({ ...newRx, recommendations: e.target.value })} rows={3} placeholder="Notas clínicas y recomendaciones..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] resize-none placeholder:text-slate-300" />
                </div>
                <div className="bg-white rounded-lg p-5 border border-slate-200/60 shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Observaciones</label>
                  <textarea value={newRx.observations} onChange={e => setNewRx({ ...newRx, observations: e.target.value })} rows={3} placeholder="Observaciones adicionales..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent-rgb),0.20)] focus:border-[var(--accent)] resize-none placeholder:text-slate-300" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200/60 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleAdd} className="px-8 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.25)] hover:shadow-[rgba(var(--accent-rgb),0.40)] hover:-translate-y-0.5 transition-all">Guardar Examen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
