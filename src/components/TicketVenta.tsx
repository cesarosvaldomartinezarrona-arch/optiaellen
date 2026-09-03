import { useState, useMemo, useRef } from 'react';
import { Printer, RotateCcw, Save, X, FileDown, Eye, Search, Edit2 } from 'lucide-react';
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
  telefonoOptica: string;
  redesSociales: string;
  cedula: string;
  licenciatura: string;
  optometrista: string;
  paciente: string;
  telefonoCliente: string;
  emailCliente: string;
  rfcCliente: string;
  fechaNacimiento: string;
  calle: string;
  colonia: string;
  ocupacion: string;
  tipoLente: string;
  materialLente: string;
  descripcionProducto: string;
  tratamientos: string;
  armazon: string;
  colorArmazon: string;
  graduacion: {
    od: { dnpL: string; dnpC: string; alt: string; esfera: string; cilindro: string; eje: string; adicion: string; prisma: string };
    oi: { dnpL: string; dnpC: string; alt: string; esfera: string; cilindro: string; eje: string; adicion: string; prisma: string };
  };
  observaciones: string;
  detalle: { descripcion: string; cantidad: number; precioUnitario: number; descuento: number; iva: number; importe: number; precioFinal: number }[];
  totales: { subtotal: number; descuento: number; iva: number; total: number };
  anticipo: number;
  saldoPendiente: number;
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
  fechaEntrega: string;
  condicionesEntrega: string;
  garantiaMicas: string;
  garantiaArmazon: string;
  coberturaGarantia: string;
  condicionesCambio: string;
  politicaCancelacion: string;
}

export const defaultData: TicketVentaData = {
  recepcionista: '',
  folio: '',
  fechaVenta: new Date().toISOString().split('T')[0],
  sucursal: '',
  rfc: '',
  regimenFiscal: '',
  direccionSucursal: '',
  telefonoOptica: '',
  redesSociales: '',
  cedula: '',
  licenciatura: '',
  optometrista: '',
  paciente: '',
  telefonoCliente: '',
  emailCliente: '',
  rfcCliente: '',
  fechaNacimiento: '',
  calle: '',
  colonia: '',
  ocupacion: '',
  tipoLente: '',
  materialLente: '',
  descripcionProducto: '',
  tratamientos: '',
  armazon: '',
  colorArmazon: '',
  graduacion: {
    od: { dnpL: '', dnpC: '', alt: '', esfera: '', cilindro: '', eje: '', adicion: '', prisma: '' },
    oi: { dnpL: '', dnpC: '', alt: '', esfera: '', cilindro: '', eje: '', adicion: '', prisma: '' },
  },
  observaciones: 'Sin observaciones',
  detalle: [{ descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0, iva: 0, importe: 0, precioFinal: 0 }],
  totales: { subtotal: 0, descuento: 0, iva: 0, total: 0 },
  anticipo: 0,
  saldoPendiente: 0,
  pago: { estatus: 'Adeudo', formaPago: '—', exento: 'Sin exento', pagoTotalEmpresa: 0, pagoCliente: 0, universidad: '' },
  son: '',
  fechaRecoge: '',
  fechaEntrega: '',
  condicionesEntrega: '',
  garantiaMicas: '8 meses',
  garantiaArmazon: '6 meses',
  coberturaGarantia: '',
  condicionesCambio: '',
  politicaCancelacion: '',
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

interface TicketVentaProps {
  data?: TicketVentaData;
  onClose?: () => void;
}

export default function TicketVenta({ data: initialData, onClose }: TicketVentaProps) {
  const { patients, prescriptions, sales, products, opticsName, rfc: rfcCtx, regimenFiscal: regimenCtx, direccionSucursal: dirSucCtx, cedula: cedulaCtx, licenciatura: licenciaturaCtx } = useApp();
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
      cedula: cedulaCtx ?? '',
      licenciatura: licenciaturaCtx ?? '',
    };
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const [searchPatient, setSearchPatient] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.phone.includes(searchPatient) ||
    p.id.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const update = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientSelect = (patientId: string) => {
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
    const addrParts = (patient.address || '').split(',');
    const coloniaFromAddr = addrParts.length > 1 ? addrParts[1]?.trim() : '';
    setData(prev => ({
      ...prev,
      paciente: patient.name.toUpperCase(),
      telefonoCliente: patient.phone || '',
      emailCliente: patient.email || '',
      fechaNacimiento: patient.dateOfBirth || '',
      calle: patient.address || '',
      colonia: prev.colonia || coloniaFromAddr,
      ocupacion: patient.occupation || '',
      graduacion: patientRx ? {
        od: { dnpL: patientRx.rightEye.dp || '', dnpC: '', alt: '', esfera: patientRx.rightEye.sph || '', cilindro: patientRx.rightEye.cyl || '', eje: patientRx.rightEye.axis || '', adicion: patientRx.rightEye.add || '', prisma: patientRx.rightEye.prisma || '' },
        oi: { dnpL: patientRx.leftEye.dp || '', dnpC: '', alt: '', esfera: patientRx.leftEye.sph || '', cilindro: patientRx.leftEye.cyl || '', eje: patientRx.leftEye.axis || '', adicion: patientRx.leftEye.add || '', prisma: patientRx.leftEye.prisma || '' },
      } : prev.graduacion,
      descripcionProducto: baseMica || prev.descripcionProducto,
      tratamientos: tratamientosStr || prev.tratamientos,
    }));
    setSearchPatient('');
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
      const subtotal = detalle.reduce((s, d) => s + (d.precioUnitario * d.cantidad * (1 - d.descuento / 100)), 0);
      const descuentoTotal = detalle.reduce((s, d) => s + d.precioUnitario * d.cantidad * (d.descuento / 100), 0);
      const ivaTotal = detalle.reduce((s, d) => {
        const base = d.precioUnitario * d.cantidad * (1 - d.descuento / 100);
        return s + base * 0.16;
      }, 0);
      const total = subtotal + ivaTotal;
      const anticipo = prev.anticipo;
      return {
        ...prev,
        detalle,
        totales: { subtotal: Math.round(subtotal * 100) / 100, descuento: Math.round(descuentoTotal * 100) / 100, iva: Math.round(ivaTotal * 100) / 100, total: Math.round(total * 100) / 100 },
        saldoPendiente: Math.round((total - anticipo) * 100) / 100,
        pago: { ...prev.pago, pagoCliente: Math.round(total * 100) / 100 },
        son: numberToWords(Math.round(total * 100) / 100),
      };
    });
  };

  const addDetalle = () => {
    setData(prev => ({
      ...prev,
      detalle: [...prev.detalle, { descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0, iva: 0, importe: 0, precioFinal: 0 }],
    }));
  };

  const removeDetalle = (idx: number) => {
    setData(prev => {
      const detalle = prev.detalle.filter((_, i) => i !== idx);
      return { ...prev, detalle };
    });
  };

  const handlePrint = () => window.print();

  const generatePdf = async (): Promise<Blob | null> => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const content = modalRef.current?.querySelector('.overflow-y-auto') as HTMLElement;
      if (!content) return null;
      const prevOverflow = content.style.overflow;
      const prevMaxHeight = content.style.maxHeight;
      content.style.overflow = 'visible';
      content.style.maxHeight = 'none';
      const canvas = await html2canvas(content, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      content.style.overflow = prevOverflow;
      content.style.maxHeight = prevMaxHeight;
      const imgW = 215.9;
      const imgH = (canvas.height * imgW) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'letter');
      const imgData = canvas.toDataURL('image/png');
      let y = 0;
      const pageH = 279.4;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH);
        y += pageH;
      }
      return pdf.output('blob');
    } catch (e) {
      console.error('Error generando PDF:', e);
      return null;
    }
  };

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    const blob = await generatePdf();
    setGeneratingPdf(false);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket-${data.folio || 'venta'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewPdf = async () => {
    setGeneratingPdf(true);
    const blob = await generatePdf();
    setGeneratingPdf(false);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePrintThermal = () => {
    const w = window.open('', '_blank', 'width=400,height=800');
    if (!w) return;
    const det = data.detalle.filter(d => d.descripcion);
    const totalCalc = data.totales.total;
    w.document.write(`<!DOCTYPE html><html><head><title>Ticket ${data.folio}</title>
<style>
  @page { size: 80mm auto; margin: 2mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 11px; width: 76mm; color: #000; }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .line { border-top: 1px dashed #000; margin: 3px 0; }
  .line2 { border-top: 2px solid #000; margin: 3px 0; }
  table { width: 100%; border-collapse: collapse; }
  td, th { padding: 1px 0; font-size: 10px; }
  .right { text-align: right; }
  .small { font-size: 9px; }
</style></head><body>
<div class="center bold" style="font-size:14px">${data.sucursal || 'OPTICA'}</div>
<div class="center small">${data.direccionSucursal || ''}</div>
<div class="center small">Tel: ${data.telefonoOptica || ''}</div>
<div class="center small">RFC: ${data.rfc || ''}</div>
<div class="line2"></div>
<div class="center bold" style="font-size:12px">TICKET DE VENTA</div>
<div class="line"></div>
<table><tr><td class="small">Folio:</td><td class="right bold">${data.folio || '—'}</td></tr>
<tr><td class="small">Fecha:</td><td class="right">${data.fechaVenta || '—'}</td></tr>
<tr><td class="small">Recepcionista:</td><td class="right">${data.recepcionista || '—'}</td></tr></table>
<div class="line"></div>
<div class="bold small">DATOS DEL CLIENTE</div>
<table><tr><td class="small">Nombre:</td><td class="right">${data.paciente || '—'}</td></tr>
<tr><td class="small">Telefono:</td><td class="right">${data.telefonoCliente || '—'}</td></tr>
${data.rfcCliente ? `<tr><td class="small">RFC:</td><td class="right">${data.rfcCliente}</td></tr>` : ''}</table>
<div class="line"></div>
<div class="bold small">GRADUACION</div>
<table>
<tr><td class="small bold">OD:</td><td class="small right">ESF ${data.graduacion.od.esfera || '—'} | CIL ${data.graduacion.od.cilindro || '—'} | EJE ${data.graduacion.od.eje || '—'} | ADD ${data.graduacion.od.adicion || '—'}</td></tr>
<tr><td class="small bold">OI:</td><td class="small right">ESF ${data.graduacion.oi.esfera || '—'} | CIL ${data.graduacion.oi.cilindro || '—'} | EJE ${data.graduacion.oi.eje || '—'} | ADD ${data.graduacion.oi.adicion || '—'}</td></tr>
</table>
${data.tipoLente || data.materialLente ? `<div class="small">Lente: ${data.tipoLente || ''} ${data.materialLente || ''}</div>` : ''}
${data.tratamientos ? `<div class="small">Tratamientos: ${data.tratamientos}</div>` : ''}
${data.armazon ? `<div class="small">Armazon: ${data.armazon}</div>` : ''}
<div class="line"></div>
<div class="bold small">DETALLE</div>
<table>${det.map(d => `<tr><td class="small">${d.descripcion} ${d.cantidad > 1 ? 'x' + d.cantidad : ''}</td><td class="right small">$${d.precioFinal.toLocaleString()}</td></tr>`).join('')}</table>
<div class="line2"></div>
<table>
<tr><td class="bold">SUBTOTAL</td><td class="right bold">$${data.totales.subtotal.toLocaleString()}</td></tr>
${data.totales.descuento > 0 ? `<tr><td class="small">DESCUENTO</td><td class="right small">-$${data.totales.descuento.toLocaleString()}</td></tr>` : ''}
<tr><td class="small">IVA (16%)</td><td class="right small">$${data.totales.iva.toLocaleString()}</td></tr>
<tr><td class="bold" style="font-size:13px">TOTAL</td><td class="right bold" style="font-size:13px">$${totalCalc.toLocaleString()}</td></tr>
</table>
${data.anticipo > 0 ? `<div class="line"></div><table>
<tr><td class="small">ANTICIPO</td><td class="right small">$${data.anticipo.toLocaleString()}</td></tr>
<tr><td class="bold">SALDO</td><td class="right bold">$${data.saldoPendiente.toLocaleString()}</td></tr></table>` : ''}
<div class="line"></div>
<table><tr><td class="small">Pago:</td><td class="right small">${data.pago.formaPago}</td></tr>
<tr><td class="small">Estatus:</td><td class="right small">${data.pago.estatus}</td></tr></table>
<div class="line"></div>
${data.garantiaMicas ? `<div class="small">Garantia micas: ${data.garantiaMicas}</div>` : ''}
${data.garantiaArmazon ? `<div class="small">Garantia armazon: ${data.garantiaArmazon}</div>` : ''}
${data.fechaEntrega ? `<div class="small">Entrega estimada: ${data.fechaEntrega}</div>` : ''}
<div class="line"></div>
<div class="center small">!Gracias por su compra!</div>
<div class="center small">${data.sucursal || ''}</div>
<div class="line2"></div>
</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  const handleReset = () => {
    setData({ ...defaultData });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-w-full print:border-none">

        {/* Header sticky */}
        <div className="shrink-0 no-print">
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="OptiÆllen" className="w-14 h-14 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div>
                <h2 className="text-xl font-extrabold text-[#7c3aed] tracking-tight">{opticsName ?? 'OptiÆllen'}</h2>
                <p className="text-slate-400 text-[11px]">Ver bien es vivir mejor</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">TICKET DE VENTA</h1>
                <span className="inline-block mt-1 px-3 py-1 bg-[#7c3aed] text-white text-[9px] font-bold tracking-widest uppercase rounded">Copia Cliente</span>
              </div>
              {onClose && (
                <button onClick={onClose} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="bg-white px-6 py-2.5 flex items-center gap-6 border-b border-slate-100 text-xs text-slate-600">
            <span><strong>Recepcionista:</strong> {data.recepcionista || '—'}</span>
            <span><strong>Dirección:</strong> {data.direccionSucursal || '—'}</span>
          </div>
          <div className="bg-white px-6 py-2 flex items-center gap-6 border-b border-slate-100 text-xs text-slate-600">
            <span><strong>Cédula:</strong> {data.cedula || '—'}</span>
            <span><strong>Licenciado en Optometría:</strong> {data.licenciatura || '—'}</span>
          </div>
          <div className="h-1 bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed]" />
        </div>

        {/* Header para impresión */}
        <div className="hidden print:block shrink-0">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="OptiÆllen" className="w-14 h-14 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div>
                <h2 className="text-xl font-extrabold text-[#7c3aed] tracking-tight">{opticsName ?? 'OptiÆllen'}</h2>
                <p className="text-slate-400 text-[11px]">Ver bien es vivir mejor</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">TICKET DE VENTA</h1>
              <span className="inline-block mt-1 px-3 py-1 bg-[#7c3aed] text-white text-[9px] font-bold tracking-widest uppercase rounded">Copia Cliente</span>
            </div>
          </div>
          <div className="px-6 py-2.5 flex items-center gap-6 border-b border-slate-100 text-xs text-slate-600">
            <span><strong>Recepcionista:</strong> {data.recepcionista || '—'}</span>
            <span><strong>Dirección:</strong> {data.direccionSucursal || '—'}</span>
          </div>
          <div className="px-6 py-2 flex items-center gap-6 border-b border-slate-100 text-xs text-slate-600">
            <span><strong>Cédula:</strong> {data.cedula || '—'}</span>
            <span><strong>Licenciado en Optometría:</strong> {data.licenciatura || '—'}</span>
          </div>
          <div className="h-1 bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed]" />
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">

          {/* DATOS DE VENTA */}
          <Section title="Datos de la Óptica">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <InputField label="Nombre Comercial" value={data.sucursal} onChange={v => update('sucursal', v)} />
              <InputField label="Folio de Venta" value={data.folio} onChange={v => update('folio', v)} />
              <InputField label="Fecha y Hora" value={data.fechaVenta} onChange={v => update('fechaVenta', v)} type="date" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
              <InputField label="Razón Social" value={data.recepcionista} onChange={v => update('recepcionista', v)} />
              <InputField label="RFC" value={data.rfc} onChange={v => update('rfc', v)} />
              <InputField label="Régimen Fiscal" value={data.regimenFiscal} onChange={v => update('regimenFiscal', v)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Domicilio Fiscal" value={data.direccionSucursal} onChange={v => update('direccionSucursal', v)} />
              <InputField label="Teléfono / WhatsApp" value={data.telefonoOptica} onChange={v => update('telefonoOptica', v)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Redes Sociales" value={data.redesSociales} onChange={v => update('redesSociales', v)} placeholder="@usuario, URL..." />
              <InputField label="Optometrista" value={data.optometrista} onChange={v => update('optometrista', v)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Cédula Profesional" value={data.cedula} onChange={v => update('cedula', v)} />
              <InputField label="Licenciado en Optometría" value={data.licenciatura} onChange={v => update('licenciatura', v)} />
            </div>
          </Section>

          {/* DATOS DEL PACIENTE */}
          <Section title="Datos del Paciente">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Buscar Paciente</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input type="text" placeholder="Nombre, teléfono o ID del paciente..." value={searchPatient} onChange={e => setSearchPatient(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" />
              </div>
              {searchPatient && (
                <div className="mt-1 max-h-36 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-lg">
                  {filteredPatients.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-slate-400">No se encontraron pacientes</p>
                  ) : (
                    filteredPatients.map(p => (
                      <button key={p.id} onClick={() => handlePatientSelect(p.id)}
                        className="w-full text-left px-3 py-2 hover:bg-purple-50 border-b border-slate-100 last:border-0 transition-colors">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.id} · {p.phone}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Paciente" value={data.paciente} onChange={v => update('paciente', v)} />
              <InputField label="Fecha de Nacimiento" value={data.fechaNacimiento} onChange={v => update('fechaNacimiento', v)} type="date" />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Teléfono" value={data.telefonoCliente} onChange={v => update('telefonoCliente', v)} />
              <InputField label="Correo Electrónico" value={data.emailCliente} onChange={v => update('emailCliente', v)} placeholder="Opcional" />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Calle" value={data.calle} onChange={v => update('calle', v)} />
              <InputField label="Colonia" value={data.colonia} onChange={v => update('colonia', v)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Ocupación" value={data.ocupacion} onChange={v => update('ocupacion', v)} />
              <InputField label="RFC Cliente (facturación)" value={data.rfcCliente} onChange={v => update('rfcCliente', v)} placeholder="Solo si factura" />
            </div>
          </Section>

          {/* BASE / MICA */}
          <Section title="Lente y Armazón">
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Tipo de Lente" value={data.tipoLente} onChange={v => update('tipoLente', v)} placeholder="Monofocal, Bifocal, Progresivo..." />
              <InputField label="Material / Índice" value={data.materialLente} onChange={v => update('materialLente', v)} placeholder="1.50, 1.60, 1.67, 1.74..." />
            </div>
            <div className="mt-6">
              <InputField label="Descripción (Lente)" value={data.descripcionProducto} onChange={v => update('descripcionProducto', v)} />
            </div>
            <div className="mt-6">
              <InputField label="Tratamientos" value={data.tratamientos} onChange={v => update('tratamientos', v)} placeholder="Antirreflejante, Fotocromático, Filtro UV..." />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Armazón (Inventario)</label>
                <select value={data.armazon} onChange={e => update('armazon', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]">
                  <option value="">— Seleccionar armazón —</option>
                  {products.filter(p => p.category === 'Monturas').map(p => (
                    <option key={p.id} value={`${p.name} ${p.model} ${p.brand ?? ''}`.trim()}>
                      {p.name} {p.model} {p.brand ? `(${p.brand})` : ''} — ${p.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <InputField label="Color / Talla Armazón" value={data.colorArmazon} onChange={v => update('colorArmazon', v)} />
            </div>
          </Section>

          {/* ESPECIFICACIONES */}
          <Section title="Graduación">
            <div className="overflow-hidden rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-3 py-2.5 text-center font-bold text-xs tracking-wide" colSpan={8}>Ojo Derecho (OD)</th>
                    <th className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] text-white px-3 py-2.5 text-center font-bold text-xs tracking-wide" colSpan={8}>Ojo Izquierdo (OI)</th>
                  </tr>
                  <tr className="bg-slate-50">
                    {['DP', 'ALT', 'Esfera', 'Cilindro', 'Eje', 'Adición', 'Prisma', 'DNP(C)'].map(h => (
                      <th key={`h-${h}`} className="px-2 py-2.5 text-center font-bold text-slate-500 text-[10px] uppercase">{h}</th>
                    ))}
                    {['DP', 'ALT', 'Esfera', 'Cilindro', 'Eje', 'Adición', 'Prisma', 'DNP(C)'].map(h => (
                      <th key={`i-${h}`} className="px-2 py-2.5 text-center font-bold text-slate-500 text-[10px] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    {(['dnpL', 'alt', 'esfera', 'cilindro', 'eje', 'adicion', 'prisma', 'dnpC'] as const).map(f => (
                      <td key={`od-${f}`} className="px-1.5 py-1.5">
                        <input type="text" value={data.graduacion.od[f]} onChange={e => updateGrad('od', f, e.target.value)}
                          className="w-full text-center py-2 px-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-sm font-semibold text-slate-700 outline-none transition-all" />
                      </td>
                    ))}
                    {(['dnpL', 'alt', 'esfera', 'cilindro', 'eje', 'adicion', 'prisma', 'dnpC'] as const).map(f => (
                      <td key={`oi-${f}`} className="px-1.5 py-1.5">
                        <input type="text" value={data.graduacion.oi[f]} onChange={e => updateGrad('oi', f, e.target.value)}
                          className="w-full text-center py-2 px-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-sm font-semibold text-slate-700 outline-none transition-all" />
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
              className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] resize-none placeholder:text-slate-400" />
          </Section>

          {/* DETALLE DE VENTA */}
          <Section title="Detalle de Venta">
            <div className="overflow-hidden rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed]">
                    <th className="px-4 py-2.5 text-left font-bold text-white text-[10px] uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-2.5 text-center font-bold text-white text-[10px] uppercase tracking-wider">Cant.</th>
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
                    const base = d.precioUnitario * d.cantidad * (1 - d.descuento / 100);
                    const iva = Math.round(base * 0.16 * 100) / 100;
                    const final_ = Math.round((base + iva) * 100) / 100;
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-2 py-1.5">
                          <input type="text" value={d.descripcion} onChange={e => updateDetalle(i, 'descripcion', e.target.value)}
                            className="w-full py-1 px-2 bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" value={d.cantidad || ''} onChange={e => updateDetalle(i, 'cantidad', parseInt(e.target.value) || 1)} min={1}
                            className="w-full py-1 px-2 text-center bg-transparent border border-transparent hover:border-slate-200 focus:border-[#7c3aed] focus:bg-white rounded text-xs text-slate-700 font-medium outline-none transition-all" />
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
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Anticipo</span>
                  <span className="font-bold text-emerald-600">${data.anticipo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Saldo Pendiente</span>
                  <span className="font-bold text-amber-600">${data.saldoPendiente.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>

          {/* INFORMACIÓN DE PAGO */}
          <Section title="Información de Pago">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estatus</label>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-amber-700 uppercase">{data.pago.estatus}</span>
                </div>
              </div>
              <InputField label="Forma de Pago" value={data.pago.formaPago} onChange={v => updatePago('formaPago', v)} />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <InputField label="Anticipo" value={data.anticipo ? `$${data.anticipo}` : ''} onChange={v => {
                const val = parseFloat(v.replace(/[$,]/g, '')) || 0;
                setData(prev => ({ ...prev, anticipo: val, saldoPendiente: Math.round((prev.totales.total - val) * 100) / 100 }));
              }} placeholder="$0.00" />
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Saldo Pendiente</label>
                <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm font-bold text-amber-700">
                  ${data.saldoPendiente.toLocaleString()}
                </div>
              </div>
              <InputField label="Exento" value={data.pago.exento} onChange={v => updatePago('exento', v)} />
            </div>
          </Section>

          {/* MONTO EN LETRAS + FECHA RECOGE */}
          <div className="space-y-3">
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500">Son: </span>
              <span className="text-xs font-semibold text-slate-700 italic">{data.son || 'UN MIL DOSCIENTOS OCHENTA Y CINCO PESOS 00/100 M.N.'}</span>
            </div>
          </div>

          {/* ENTREGA Y GARANTÍA */}
          <Section title="Entrega y Garantía">
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Fecha Estimada de Entrega" value={data.fechaEntrega} onChange={v => update('fechaEntrega', v)} type="date" />
              <InputField label="Condiciones de Entrega" value={data.condicionesEntrega} onChange={v => update('condicionesEntrega', v)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField label="Garantía de Micas" value={data.garantiaMicas} onChange={v => update('garantiaMicas', v)} placeholder="Ej: 8 meses" />
              <InputField label="Garantía de Armazón" value={data.garantiaArmazon} onChange={v => update('garantiaArmazon', v)} placeholder="Ej: 6 meses" />
            </div>
            <div className="mt-6">
              <InputField label="Qué cubre y qué no cubre la garantía" value={data.coberturaGarantia} onChange={v => update('coberturaGarantia', v)} />
            </div>
            <div className="mt-6">
              <InputField label="Condiciones para Cambios / Adaptación" value={data.condicionesCambio} onChange={v => update('condicionesCambio', v)} />
            </div>
            <div className="mt-6">
              <InputField label="Política de Cancelación o Devolución" value={data.politicaCancelacion} onChange={v => update('politicaCancelacion', v)} />
            </div>
          </Section>

          {/* FIRMAS DIVIDER */}
          <div className="flex items-center gap-6 py-1">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button onClick={handleViewPdf} disabled={generatingPdf}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">
              <Eye className="w-4 h-4" /> {generatingPdf ? 'Generando...' : 'Ver PDF'}
            </button>
            <button onClick={handleDownloadPdf} disabled={generatingPdf}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">
              <FileDown className="w-4 h-4" /> {generatingPdf ? 'Generando...' : 'Descargar PDF'}
            </button>
            <button onClick={handlePrintThermal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-all">
              <Printer className="w-4 h-4" /> Térmica
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Edit2 className="w-4 h-4" /> Editar Datos
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5b1a9e] to-[#7c3aed] rounded-lg text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
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
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" />
    </div>
  );
}
