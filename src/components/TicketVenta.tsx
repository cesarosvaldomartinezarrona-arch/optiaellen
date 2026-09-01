import { useState, useMemo } from 'react';
import { Printer, RotateCcw, Save, X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import SignaturePad from './SignaturePad';

export interface TicketVentaData {
  recepcionista: string;
  folio: string;
  fechaVenta: string;
  sucursal: string;
  rfc: string;
  regimenFiscal: string;
  direccionSucursal: string;
  optometrista: string;
  paciente: string;
  fechaNacimiento: string;
  calle: string;
  colonia: string;
  ocupacion: string;
  descripcionProducto: string;
  tratamientos: string;
  armazon: string;
  graduacion: {
    od: { dnpL: string; dnpC: string; alt: string; esfera: string; cilindro: string; ejeAdd: string };
    oi: { dnpL: string; dnpC: string; alt: string; esfera: string; cilindro: string; ejeAdd: string };
  };
  observaciones: string;
  detalle: { descripcion: string; precioUnitario: number; descuento: number; iva: number; importe: number; precioFinal: number }[];
  totales: { subtotal: number; descuento: number; iva: number; total: number };
  pago: {
    estatus: string;
    formaPago: string;
    exento: string;
    pagoTotalEmpresa: number;
    pagoCliente: number;
    universidad: string;
  };
  son: string;
  fechaRecoge: string;
  horaRecoge: string;
}

export const defaultData: TicketVentaData = {
  recepcionista: '',
  folio: '',
  fechaVenta: new Date().toISOString().split('T')[0],
  sucursal: '',
  rfc: '',
  regimenFiscal: '',
  direccionSucursal: '',
  optometrista: '',
  paciente: '',
  fechaNacimiento: '',
  calle: '',
  colonia: '',
  ocupacion: '',
  descripcionProducto: '',
  tratamientos: '',
  armazon: '',
  graduacion: {
    od: { dnpL: '', dnpC: '', alt: '', esfera: '', cilindro: '', ejeAdd: '' },
    oi: { dnpL: '', dnpC: '', alt: '', esfera: '', cilindro: '', ejeAdd: '' },
  },
  observaciones: 'Sin observaciones',
  detalle: [{ descripcion: '', precioUnitario: 0, descuento: 0, iva: 0, importe: 0, precioFinal: 0 }],
  totales: { subtotal: 0, descuento: 0, iva: 0, total: 0 },
  pago: { estatus: 'Adeudo', formaPago: '—', exento: 'Sin exento', pagoTotalEmpresa: 0, pagoCliente: 0, universidad: '' },
  son: '',
  fechaRecoge: '',
  horaRecoge: '',
};

function numberToWords(n: number): string {
  if (n === 0) return 'CERO PESOS 00/100 M.N.';
  const ones = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE', 'VEINTIÚN', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE'];
  const tens = ['', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const intPart = Math.floor(n);
  const decPart = Math.round((n - intPart) * 100);
  let result = '';

  if (intPart === 100) { result = 'CIEN'; }
  else if (intPart > 0) {
    const h = Math.floor(intPart / 100);
    const r = intPart % 100;
    if (h > 0) result += hundreds[h];
    if (r > 0) {
      if (result) result += ' ';
      if (r <= 29) result += ones[r];
      else {
        const t = Math.floor(r / 10);
        const u = r % 10;
        result += tens[t];
        if (u > 0) result += ' Y ' + ones[u];
      }
    }
  }

  result += ' PESOS';
  result += ' ' + String(decPart).padStart(2, '0') + '/100 M.N.';
  return result;
}

function formatDateLong(d: string): string {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

interface TicketVentaProps {
  data?: TicketVentaData;
  onClose?: () => void;
}

export default function TicketVenta({ data: initialData, onClose }: TicketVentaProps) {
  const { patients, prescriptions, sales, products, opticsName, rfc: rfcCtx, regimenFiscal: regimenCtx, direccionSucursal: dirSucCtx } = useApp();
  const { user } = useAuth();

  // Generar folio automático
  const nextFolio = useMemo(() => {
    const num = sales.length + 1;
    return `V${String(num).padStart(4, '0')}`;
  }, [sales]);

  const [data, setData] = useState<TicketVentaData>(() => {
    if (initialData) return initialData;
    return {
      ...defaultData,
      folio: nextFolio,
      recepcionista: user?.name ?? '',
      sucursal: opticsName ?? '',
      rfc: rfcCtx ?? '',
      regimenFiscal: regimenCtx ?? '',
      direccionSucursal: dirSucCtx ?? '',
    };
  });

  const [searchPatient, setSearchPatient] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.phone.includes(searchPatient) ||
    p.id.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const update = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Selector de paciente: auto-llena datos + último examen
  const handlePatientSelect = (patientId: string) => {
    if (!patientId) {
      setData(prev => ({
        ...prev,
        paciente: '',
        fechaNacimiento: '',
        calle: '',
        colonia: '',
        ocupacion: '',
        graduacion: defaultData.graduacion,
        descripcionProducto: '',
        tratamientos: '',
      }));
      return;
    }
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const patientRx = prescriptions
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    let baseMica = '';
    if (patientRx?.selectedLenses?.length) {
      baseMica = patientRx.selectedLenses.map(l => `${l.name} ${l.brand} ${l.type}`).join(' + ');
    }

    let tratamientosStr = '';
    if (patientRx?.treatments?.length) {
      tratamientosStr = patientRx.treatments.map(t => t.name).join(', ');
    }

    // Try to parse colonia from address
    const addrParts = (patient.address || '').split(',');
    const coloniaFromAddr = addrParts.length > 1 ? addrParts[1]?.trim() : '';

    setData(prev => ({
      ...prev,
      paciente: patient.name.toUpperCase(),
      fechaNacimiento: patient.dateOfBirth || '',
      calle: patient.address || '',
      colonia: prev.colonia || coloniaFromAddr,
      ocupacion: patient.occupation || '',
      graduacion: patientRx ? {
        od: {
          dnpL: patientRx.rightEye.dp || '',
          dnpC: '',
          alt: '',
          esfera: patientRx.rightEye.sph || '',
          cilindro: patientRx.rightEye.cyl || '',
          ejeAdd: patientRx.rightEye.axis ? `${patientRx.rightEye.axis}°` : '',
        },
        oi: {
          dnpL: patientRx.leftEye.dp || '',
          dnpC: '',
          alt: '',
          esfera: patientRx.leftEye.sph || '',
          cilindro: patientRx.leftEye.cyl || '',
          ejeAdd: patientRx.leftEye.axis ? `${patientRx.leftEye.axis}°` : '',
        },
      } : prev.graduacion,
      descripcionProducto: baseMica || prev.descripcionProducto,
      tratamientos: tratamientosStr || prev.tratamientos,
    }));
  };

  const updateGrad = (ojo: 'od' | 'oi', field: string, value: string) => {
    setData(prev => ({
      ...prev,
      graduacion: { ...prev.graduacion, [ojo]: { ...prev.graduacion[ojo], [field]: value } },
    }));
  };

  const updatePago = (field: string, value: string | number) => {
    setData(prev => ({ ...prev, pago: { ...prev.pago, [field]: value } }));
  };

  const updateDetalle = (idx: number, field: string, value: string | number) => {
    setData(prev => {
      const detalle = [...prev.detalle];
      detalle[idx] = { ...detalle[idx], [field]: value };
      const subtotal = detalle.reduce((s, d) => s + (d.precioUnitario * (1 - d.descuento / 100)), 0);
      const descuentoTotal = detalle.reduce((s, d) => s + d.precioUnitario * (d.descuento / 100), 0);
      const ivaTotal = detalle.reduce((s, d) => {
        const base = d.precioUnitario * (1 - d.descuento / 100);
        return s + base * 0.16;
      }, 0);
      const total = subtotal + ivaTotal;
      return {
        ...prev,
        detalle,
        totales: { subtotal: Math.round(subtotal * 100) / 100, descuento: Math.round(descuentoTotal * 100) / 100, iva: Math.round(ivaTotal * 100) / 100, total: Math.round(total * 100) / 100 },
        pago: { ...prev.pago, pagoCliente: Math.round(total * 100) / 100 },
        son: numberToWords(Math.round(total * 100) / 100),
      };
    });
  };

  const addDetalle = () => {
    setData(prev => ({
      ...prev,
      detalle: [...prev.detalle, { descripcion: '', precioUnitario: 0, descuento: 0, iva: 0, importe: 0, precioFinal: 0 }],
    }));
  };

  const removeDetalle = (idx: number) => {
    setData(prev => {
      const detalle = prev.detalle.filter((_, i) => i !== idx);
      return { ...prev, detalle };
    });
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    setData({ ...defaultData });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-w-full print:border-none">

        {/* Header sticky */}
        <div className="bg-gradient-to-r from-[#3a0d6d] via-[#5b1a9e] to-[#7c3aed] px-6 py-4 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg shrink-0">
              <span className="text-[#4a148c] font-extrabold text-sm">SD</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-extrabold">Ticket de Venta</h2>
              <p className="text-white/50 text-[10px] mt-0.5">{opticsName ?? 'Salud Digna'} — Formulario de registro con firma digital</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full border border-white/30 text-white text-[9px] font-bold tracking-widest uppercase hidden sm:block">
              Nota de Venta
            </span>
            {onClose && (
              <button onClick={onClose} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ml-2">
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Header para impresión */}
        <div className="hidden print:block bg-gradient-to-r from-[#3a0d6d] via-[#5b1a9e] to-[#7c3aed] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
              <span className="text-[#4a148c] font-extrabold text-sm">SD</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-extrabold">Ticket de Venta</h2>
              <p className="text-white/50 text-[10px]">{opticsName ?? 'Salud Digna'} — Formulario de registro con firma digital</p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full border border-white/30 text-white text-[9px] font-bold tracking-widest uppercase">Nota de Venta</span>
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* DATOS DE VENTA */}
          <Section title="Datos de Venta">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InputField label="Recepcionista" value={data.recepcionista} onChange={v => update('recepcionista', v)} />
              <InputField label="Folio de Venta" value={data.folio} onChange={v => update('folio', v)} />
              <InputField label="Fecha de Venta" value={data.fechaVenta} onChange={v => update('fechaVenta', v)} type="date" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <InputField label="Sucursal" value={data.sucursal} onChange={v => update('sucursal', v)} />
              <InputField label="RFC" value={data.rfc} onChange={v => update('rfc', v)} />
              <InputField label="Régimen Fiscal" value={data.regimenFiscal} onChange={v => update('regimenFiscal', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Optometrista" value={data.optometrista} onChange={v => update('optometrista', v)} />
              <InputField label="Dirección Sucursal" value={data.direccionSucursal} onChange={v => update('direccionSucursal', v)} />
            </div>
          </Section>

          {/* DATOS DEL PACIENTE */}
          <Section title="Datos del Paciente">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Buscar Paciente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input type="text" placeholder="Nombre, teléfono o ID del paciente..." value={searchPatient} onChange={e => setSearchPatient(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" />
              </div>
              {searchPatient && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-lg">
                  {filteredPatients.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-slate-400">No se encontraron pacientes</p>
                  ) : (
                    filteredPatients.map(p => (
                      <button key={p.id} onClick={() => { handlePatientSelect(p.id); setSearchPatient(''); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-purple-50 border-b border-slate-100 last:border-0 transition-colors">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.id} · {p.phone} · {p.occupation || '—'}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Paciente" value={data.paciente} onChange={v => update('paciente', v)} />
              <InputField label="Fecha de Nacimiento" value={data.fechaNacimiento} onChange={v => update('fechaNacimiento', v)} type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Calle" value={data.calle} onChange={v => update('calle', v)} />
              <InputField label="Colonia" value={data.colonia} onChange={v => update('colonia', v)} />
            </div>
            <div className="mt-4">
              <InputField label="Ocupación" value={data.ocupacion} onChange={v => update('ocupacion', v)} />
            </div>
          </Section>

          {/* BASE / MICA */}
          <Section title="Base / Mica">
            <InputField label="Descripción (Lente)" value={data.descripcionProducto} onChange={v => update('descripcionProducto', v)} />
            <div className="mt-4">
              <InputField label="Tratamientos" value={data.tratamientos} onChange={v => update('tratamientos', v)} />
            </div>
            <div className="mt-4">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Armazón (Inventario)</label>
              <select value={data.armazon} onChange={e => update('armazon', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all">
                <option value="">— Seleccionar armazón —</option>
                {products.filter(p => p.category === 'Monturas').map(p => (
                  <option key={p.id} value={`${p.name} ${p.model} ${p.brand ?? ''}`.trim()}>
                    {p.name} {p.model} {p.brand ? `(${p.brand})` : ''} — ${p.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          {/* ESPECIFICACIONES */}
          <Section title="Especificaciones">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-3 py-2.5 text-center font-bold text-[11px] tracking-wide" colSpan={6}>Ojo Derecho</th>
                    <th className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-3 py-2.5 text-center font-bold text-[11px] tracking-wide" colSpan={6}>Ojo Izquierdo</th>
                  </tr>
                  <tr className="bg-slate-50">
                    {['DNP (L)', 'DNP (C)', 'ALT', 'Esfera', 'Cilindro', 'Eje / ADD'].map(h => (
                      <th key={`h-${h}`} className="px-2 py-2 text-center font-bold text-slate-500 text-[10px] uppercase">{h}</th>
                    ))}
                    {['DNP (L)', 'DNP (C)', 'ALT', 'Esfera', 'Cilindro', 'Eje / ADD'].map(h => (
                      <th key={`i-${h}`} className="px-2 py-2 text-center font-bold text-slate-500 text-[10px] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    {(['dnpL', 'dnpC', 'alt', 'esfera', 'cilindro', 'ejeAdd'] as const).map(f => (
                      <td key={`od-${f}`} className="px-1 py-1">
                        <input type="text" value={data.graduacion.od[f]} onChange={e => updateGrad('od', f, e.target.value)}
                          className="w-full text-center py-1.5 px-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                      </td>
                    ))}
                    {(['dnpL', 'dnpC', 'alt', 'esfera', 'cilindro', 'ejeAdd'] as const).map(f => (
                      <td key={`oi-${f}`} className="px-1 py-1">
                        <input type="text" value={data.graduacion.oi[f]} onChange={e => updateGrad('oi', f, e.target.value)}
                          className="w-full text-center py-1.5 px-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* OBSERVACIONES */}
          <Section title="Observaciones">
            <textarea value={data.observaciones} onChange={e => update('observaciones', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] resize-none transition-all" />
          </Section>

          {/* DETALLE DE VENTA */}
          <Section title="Detalle de Venta">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed]">
                    <th className="px-4 py-2.5 text-left font-bold text-white text-[10px] uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">P. Unitario</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Descuento</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">IVA</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Importe</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">P. Final</th>
                    <th className="px-2 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.detalle.map((d, i) => {
                    const base = d.precioUnitario * (1 - d.descuento / 100);
                    const iva = Math.round(base * 0.16 * 100) / 100;
                    const final_ = Math.round((base + iva) * 100) / 100;
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-2 py-1.5">
                          <input type="text" value={d.descripcion} onChange={e => updateDetalle(i, 'descripcion', e.target.value)}
                            className="w-full py-1 px-2 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={d.precioUnitario || ''} onChange={e => updateDetalle(i, 'precioUnitario', parseFloat(e.target.value) || 0)}
                            className="w-full py-1 px-2 text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={d.descuento || ''} onChange={e => updateDetalle(i, 'descuento', parseFloat(e.target.value) || 0)}
                            className="w-full py-1 px-2 text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-slate-600 font-medium">${iva.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-xs text-slate-600 font-medium">${base.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-xs font-bold text-slate-800">${final_.toLocaleString()}</td>
                        <td className="px-2 py-1.5 text-center">
                          {data.detalle.length > 1 && (
                            <button onClick={() => removeDetalle(i)} className="text-slate-300 hover:text-red-400 transition-colors text-sm">✕</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={addDetalle}
              className="mt-3 text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors">
              + Agregar producto
            </button>
          </Section>

          {/* TOTALES */}
          <Section title="Totales">
            <div className="flex justify-end">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold text-slate-800">${data.totales.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Descuento</span>
                  <span className="font-bold text-slate-800">${data.totales.descuento.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">IVA (16%)</span>
                  <span className="font-bold text-slate-800">${data.totales.iva.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between items-center bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-4 py-2.5 rounded-lg">
                  <span className="font-bold text-sm">Total</span>
                  <span className="font-extrabold text-lg">${data.totales.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>

          {/* INFORMACIÓN DE PAGO */}
          <Section title="Información de Pago">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estatus</label>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-amber-700 uppercase">{data.pago.estatus}</span>
                </div>
              </div>
              <InputField label="Forma de Pago" value={data.pago.formaPago} onChange={v => updatePago('formaPago', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Exento" value={data.pago.exento} onChange={v => updatePago('exento', v)} />
              <InputField label="Pago Total Empresa" value={`$${data.pago.pagoTotalEmpresa.toLocaleString()}`} onChange={() => {}} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pago Cliente</label>
                <div className="px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg text-sm font-bold text-[#7c3aed]">
                  ${data.pago.pagoCliente.toLocaleString()}
                </div>
              </div>
              <InputField label="Universidad" value={data.pago.universidad} onChange={v => updatePago('universidad', v)} />
            </div>
          </Section>

          {/* MONTO EN LETRAS + FECHA RECOGE */}
          <div className="space-y-3">
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500">Son: </span>
              <span className="text-xs font-semibold text-slate-700 italic">{data.son || 'UN MIL DOSCIENTOS OCHENTA Y CINCO PESOS 00/100 M.N.'}</span>
            </div>
            <div className="px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-sm text-slate-600">
                Su lente solicitado podrá recogerlo a partir del día <strong className="text-[#7c3aed]">{data.fechaRecoge ? formatDateLong(data.fechaRecoge) : '24-MAY-2026'}</strong>, después de las <strong className="text-[#7c3aed]">{data.horaRecoge || '09:40'}</strong> hrs.
              </p>
            </div>
          </div>

          {/* FIRMAS DIVIDER */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px border-t-2 border-dashed border-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Firmas</span>
            <div className="flex-1 h-px border-t-2 border-dashed border-slate-300" />
          </div>

          {/* FIRMAS DIGITALES */}
          <Section title="Firmas Digitales">
            <div className="grid grid-cols-2 gap-5">
              <SignaturePad
                label="Firma de Responsable Sanitario"
                name="JUANA GUADALUPE ALVARADO OLALDE"
                cedula="Cédula: 4019233 — Vigencia: 05/24/2026"
                onSign={() => {}}
              />
              <SignaturePad
                label="Firma de Optometrista"
                name={data.optometrista || 'VICTOR ALFONSO RAMIREZ REYES'}
                cedula="Cédula: * 3 0 6 7 4 8 7 2 *"
                onSign={() => {}}
              />
            </div>
          </Section>

          {/* FOOTER LEGAL */}
          <div className="pt-4 space-y-3">
            <div className="bg-[#f8f7fc] border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <strong className="text-slate-600">Salud Digna A.C.</strong> con domicilio fiscal en calle Francisco Villa #113 Sur, Colonia Centro, C.P. 80000, Culiacán Sinaloa, México; utilizará sus datos personales aquí recabados con fines dirigidos a la prestación de los servicios que ofrece. Para mayor información acerca del tratamiento y de los derechos que puede hacer valer, puede acceder al aviso de privacidad en <a href="https://salud-digna.org/aviso-de-privacidad/" className="text-[#7c3aed] underline hover:text-[#6d28d9]" target="_blank" rel="noreferrer">https://salud-digna.org/aviso-de-privacidad/</a>
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Términos y condiciones de promociones: Desde este momento, y por un plazo de 30 días siguientes a la que se haya realizado la venta de la presente oferta comercial, Salud Digna concede al comprador el beneficio de adquirir a mitad de precio un segundo modelo. Aplican restricciones. Visita la página <a href="https://lentes.salud-digna.org/terminos-y-condiciones/" className="text-[#7c3aed] underline hover:text-[#6d28d9]" target="_blank" rel="noreferrer">https://lentes.salud-digna.org/terminos-y-condiciones/</a>
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>667 758 0094</span>
                  <span>667 758 0670</span>
                  <span>55 3956 6729</span>
                </div>
                <span className="text-[10px] text-slate-400">L-V 8:00 a.m. - 6:00 p.m. | S 9:00 a.m. - 2:00 p.m.</span>
                <a href="https://www.salud-digna.org" className="text-[10px] text-[#7c3aed] font-semibold hover:underline" target="_blank" rel="noreferrer">www.salud-digna.org</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer sticky */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 flex items-center justify-between no-print">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] rounded-lg text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              <Save className="w-4 h-4" /> Guardar Ticket
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .fixed { position: static !important; background: none !important; backdrop-filter: none !important; }
          .fixed > div { max-height: none !important; overflow: visible !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; width: 100% !important; }
          @page { size: letter; margin: 12mm 15mm; }
          input, textarea, select { border: none !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }
          canvas { border: 1px solid #ccc !important; }
          .bg-slate-50 { background: #f8f8f8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-gradient-to-r { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-\\[\\#4a148c\\] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-\\[\\#7c3aed\\] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
    </div>
  );
}
