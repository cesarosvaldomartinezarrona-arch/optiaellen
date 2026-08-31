import { useState } from 'react';
import { Printer, RotateCcw, Save } from 'lucide-react';
import SignaturePad from './SignaturePad';

export interface TicketVentaData {
  recepcionista: string;
  folio: string;
  fechaVenta: string;
  paciente: string;
  fechaNacimiento: string;
  direccion: string;
  clinica: string;
  rfc: string;
  optometrista: string;
  trabajo: string;
  descripcionProducto: string;
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
  paciente: '',
  fechaNacimiento: '',
  direccion: '',
  clinica: '',
  rfc: '',
  optometrista: '',
  trabajo: '—',
  descripcionProducto: '',
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

export default function TicketVenta({ data: initialData }: { data?: TicketVentaData; opticsName?: string }) {
  const [data, setData] = useState<TicketVentaData>(initialData ?? { ...defaultData });

  const update = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
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
    <div className="min-h-screen bg-[#f0f0f0]" style={{ backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      {/* Title outside ticket */}
      <div className="text-center pt-8 pb-4 no-print">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Ticket de <span className="text-[#7c3aed]">Venta</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Salud Digna — Formulario de registro con firma digital</p>
      </div>

      {/* Ticket card */}
      <div className="print-card max-w-[820px] mx-auto mb-6 bg-white rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.10)] overflow-hidden print:shadow-none print:rounded-none print:max-w-full">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#3a0d6d] via-[#5b1a9e] to-[#7c3aed] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#4a148c] font-extrabold text-base">SD</span>
            </div>
            <div>
              <h2 className="text-white text-xl font-extrabold">Salud Digna</h2>
              <p className="text-white/60 text-[11px] mt-0.5">A.C.</p>
              <p className="text-white/50 text-[10px] mt-0.5">Desde 2015, la principal fuente de lentes para los Mexicanos</p>
            </div>
          </div>
          <span className="px-5 py-2 rounded-full border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase">
            Ticket de Venta
          </span>
        </div>

        <div className="p-8 space-y-7">

          {/* DATOS DE VENTA */}
          <Section title="Datos de Venta">
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Recepcionista" value={data.recepcionista} onChange={v => update('recepcionista', v)} />
              <InputField label="Folio de Venta" value={data.folio} onChange={v => update('folio', v)} />
              <InputField label="Fecha de Venta" value={data.fechaVenta} onChange={v => update('fechaVenta', v)} type="date" />
            </div>
          </Section>

          {/* DATOS DEL PACIENTE */}
          <Section title="Datos del Paciente">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Paciente" value={data.paciente} onChange={v => update('paciente', v)} />
              <InputField label="Fecha de Nacimiento" value={data.fechaNacimiento} onChange={v => update('fechaNacimiento', v)} type="date" />
            </div>
            <div className="mt-4">
              <InputField label="Dirección" value={data.direccion} onChange={v => update('direccion', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Clínica" value={data.clinica} onChange={v => update('clinica', v)} />
              <InputField label="RFC" value={data.rfc} onChange={v => update('rfc', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputField label="Optometrista" value={data.optometrista} onChange={v => update('optometrista', v)} />
              <InputField label="Trabajo" value={data.trabajo} onChange={v => update('trabajo', v)} />
            </div>
          </Section>

          {/* DESCRIPCIÓN DEL PRODUCTO */}
          <Section title="Descripción del Producto">
            <InputField label="Descripción" value={data.descripcionProducto} onChange={v => update('descripcionProducto', v)} />
            <div className="mt-4">
              <InputField label="Armazón" value={data.armazon} onChange={v => update('armazon', v)} />
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
            <textarea value={data.observaciones} onChange={e => update('observaciones', e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] resize-none transition-all" />
          </Section>

          {/* DETALLE DE VENTA */}
          <Section title="Detalle de Venta">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed]">
                    <th className="px-4 py-2.5 text-left font-bold text-white text-[10px] uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Descuento</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">IVA</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Importe</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white text-[10px] uppercase tracking-wider">Precio Final</th>
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
              <div className="w-80 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
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
                <div className="flex justify-between items-center bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-5 py-3 rounded-xl">
                  <span className="font-bold text-sm">Total</span>
                  <span className="font-extrabold text-xl">${data.totales.total.toLocaleString()}</span>
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
          <div className="space-y-4">
            <div className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500">Son: </span>
              <span className="text-xs font-semibold text-slate-700 italic">{data.son || 'UN MIL DOSCIENTOS OCHENTA Y CINCO PESOS 00/100 M.N.'}</span>
            </div>
            <div className="px-5 py-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-sm text-slate-600">
                Su lente solicitado podrá recogerlo a partir del día <strong className="text-[#7c3aed]">{data.fechaRecoge ? formatDateLong(data.fechaRecoge) : '24-MAY-2026'}</strong>, después de las <strong className="text-[#7c3aed]">{data.horaRecoge || '09:40'}</strong> hrs.
              </p>
            </div>
          </div>

          {/* FIRMAS DIVIDER */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px border-t-2 border-dashed border-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Firmas</span>
            <div className="flex-1 h-px border-t-2 border-dashed border-slate-300" />
          </div>

          {/* FIRMAS DIGITALES */}
          <Section title="Firmas Digitales">
            <div className="grid grid-cols-2 gap-6">
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
          <div className="pt-6 space-y-4">
            <div className="bg-[#f8f7fc] border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <strong className="text-slate-600">Salud Digna A.C.</strong> con domicilio fiscal en calle Francisco Villa #113 Sur, Colonia Centro, C.P. 80000, Culiacán Sinaloa, México; utilizará sus datos personales aquí recabados con fines dirigidos a la prestación de los servicios que ofrece. Para mayor información acerca del tratamiento y de los derechos que puede hacer valer, puede acceder al aviso de privacidad en <a href="https://salud-digna.org/aviso-de-privacidad/" className="text-[#7c3aed] underline hover:text-[#6d28d9]" target="_blank" rel="noreferrer">https://salud-digna.org/aviso-de-privacidad/</a>
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Términos y condiciones de promociones: Desde este momento, y por un plazo de 30 días siguientes a la que se haya realizado la venta de la presente oferta comercial, Salud Digna concede al comprador el beneficio de adquirir a mitad de precio un segundo modelo. Aplican restricciones. Visita la página <a href="https://lentes.salud-digna.org/terminos-y-condiciones/" className="text-[#7c3aed] underline hover:text-[#6d28d9]" target="_blank" rel="noreferrer">https://lentes.salud-digna.org/terminos-y-condiciones/</a>
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
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
      </div>

      {/* Bottom actions */}
      <div className="no-print max-w-[820px] mx-auto flex justify-center gap-4 pb-8">
        <button onClick={handleReset}
          className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Printer className="w-4 h-4" /> Imprimir
        </button>
        <button
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] rounded-xl text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          <Save className="w-4 h-4" /> Guardar Ticket
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          @page { size: letter; margin: 12mm 15mm; }
          .print-card { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; }
          .print-card .p-8 { padding: 16px 20px !important; }
          .print-card .space-y-8 > div { margin-bottom: 12px !important; }
          .print-card .space-y-7 > div { margin-bottom: 10px !important; }
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
      <div className="flex items-center gap-3 mb-4">
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
