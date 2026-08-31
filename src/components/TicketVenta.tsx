import { Printer, Download } from 'lucide-react';

export interface TicketVentaData {
  folio: string;
  fecha: string;
  sucursal: string;
  vendedor: string;
  tipoVenta: string;
  paciente: {
    nombre: string;
    edad: string;
    fechaNacimiento: string;
    telefono: string;
    correo: string;
    direccion: string;
    ocupacion: string;
  };
  producto: {
    nombre: string;
    marca: string;
    modelo: string;
    color: string;
    material: string;
  };
  graduacion: {
    od: { esfera: string; cilindro: string; eje: string; add: string; prisma: string; dnp: string; alt: string };
    oi: { esfera: string; cilindro: string; eje: string; add: string; prisma: string; dnp: string; alt: string };
  };
  detalle: { descripcion: string; subtitulo?: string; precioUnitario: number; descuento: number; iva: number; importe: number; precioFinal: number }[];
  totales: { subtotal: number; descuento: number; iva: number; total: number };
  pago: { metodo: string; referencia: string; anticipo: number; saldo: number; fechaPago: string };
}

export const defaultData: TicketVentaData = {
  folio: 'SD-2025-001847',
  fecha: '15/01/2025 — 10:42 AM',
  sucursal: 'OptiÆllen Centro — Óptica',
  vendedor: 'Dra. Elena Ruiz — Optometrista',
  tipoVenta: 'Contado',
  paciente: {
    nombre: 'MAURA MANELI PEREZ PELAEZ',
    edad: '34 años',
    fechaNacimiento: '12/03/1990',
    telefono: '+52 55 1234 5678',
    correo: 'maura.perez@email.com',
    direccion: 'Av. Reforma 456, Col. Centro, CDMX',
    ocupacion: 'Ingeniera Industrial',
  },
  producto: {
    nombre: 'Montura Ray-Ban Wayfarer',
    marca: 'Ray-Ban',
    modelo: 'RB2140',
    color: 'Negro',
    material: 'Acetato',
  },
  graduacion: {
    od: { esfera: '-2.50', cilindro: '-0.75', eje: '180°', add: '—', prisma: '—', dnp: '32.5', alt: '18' },
    oi: { esfera: '-2.25', cilindro: '-0.50', eje: '175°', add: '—', prisma: '—', dnp: '31', alt: '18' },
  },
  detalle: [
    { descripcion: 'Montura Ray-Ban Wayfarer RB2140', subtitulo: 'Acetato · Negro', precioUnitario: 2800, descuento: 200, iva: 416, importe: 2600, precioFinal: 3016 },
    { descripcion: 'Cristal Antirreflejante 1.67', subtitulo: 'Alto Índice · Essilor', precioUnitario: 1500, descuento: 0, iva: 240, importe: 1500, precioFinal: 1740 },
  ],
  totales: { subtotal: 4300, descuento: 200, iva: 656, total: 4756 },
  pago: { metodo: 'Efectivo', referencia: '—', anticipo: 4756, saldo: 0, fechaPago: '15/01/2025' },
};

export default function TicketVenta({ data = defaultData, opticsName }: { data?: TicketVentaData; opticsName?: string }) {
  const d = data;
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f0f0f0] print:bg-white" style={{ backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      {/* Controles */}
      <div className="no-print flex items-center justify-center gap-4 py-6">
        <button onClick={handlePrint}
          className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 transition-all">
          <Printer className="w-4 h-4" /> Imprimir Ticket
        </button>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" /> Descargar PDF
        </button>
      </div>

      {/* Ticket */}
      <div className="max-w-[800px] mx-auto mb-10 bg-white rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden print:shadow-none print:rounded-none print:max-w-full print:mx-0">

        {/* Cabecera */}
        <div className="bg-[#4a148c] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#4a148c] font-extrabold text-sm">SD</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold tracking-tight">Ticket de Venta</h1>
              <p className="text-white/50 text-[11px] mt-0.5">{opticsName ?? 'OptiÆllen'} — Formulario de registro con firma digital</p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full border border-white/30 text-white text-[10px] font-bold tracking-wider uppercase">
            Ticket de Venta
          </span>
        </div>

        <div className="p-8 space-y-8">

          {/* DATOS DE VENTA */}
          <Section title="Datos de Venta">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Folio" value={d.folio} />
              <Field label="Fecha de Emisión" value={d.fecha} />
              <Field label="Tipo de Venta" value={d.tipoVenta} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Field label="Sucursal" value={d.sucursal} />
              <Field label="Vendedor" value={d.vendedor} />
            </div>
          </Section>

          {/* DATOS DEL PACIENTE */}
          <Section title="Datos del Paciente">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre Completo" value={d.paciente.nombre} />
              <Field label="Edad" value={d.paciente.edad} />
              <Field label="Fecha de Nacimiento" value={d.paciente.fechaNacimiento} />
              <Field label="Teléfono" value={d.paciente.telefono} />
              <Field label="Correo Electrónico" value={d.paciente.correo} />
              <Field label="Ocupación" value={d.paciente.ocupacion} />
            </div>
            <div className="mt-4">
              <Field label="Dirección" value={d.paciente.direccion} />
            </div>
          </Section>

          {/* PRODUCTO */}
          <Section title="Descripción del Producto">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Producto" value={d.producto.nombre} />
              <Field label="Marca" value={d.producto.marca} />
              <Field label="Modelo" value={d.producto.modelo} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Field label="Color" value={d.producto.color} />
              <Field label="Material" value={d.producto.material} />
            </div>
          </Section>

          {/* GRADUACIÓN */}
          <Section title="Especificaciones de Graduación">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="bg-[#4a148c] text-white px-4 py-2.5 text-left font-bold" colSpan={1}></th>
                    <th className="bg-[#6a1b9a] text-white px-4 py-2.5 text-center font-bold" colSpan={3}>Ojo Derecho (OD)</th>
                    <th className="bg-[#6a1b9a] text-white px-4 py-2.5 text-center font-bold" colSpan={3}>Ojo Izquierdo (OI)</th>
                  </tr>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-left font-bold text-slate-500 uppercase tracking-wider">Parámetro</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">DNP</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">ALT</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Prisma</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">DNP</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">ALT</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Prisma</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-semibold text-slate-600">Distancia</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.od.dnp}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.od.alt}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.od.prisma}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.oi.dnp}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.oi.alt}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800">{d.graduacion.oi.prisma}</td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full text-xs border-t border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-left font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Esfera</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Cilindro</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Eje</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Esfera</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Cilindro</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500">Eje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-semibold text-slate-600">Graduación</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.od.esfera}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.od.cilindro}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.od.eje}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.oi.esfera}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.oi.cilindro}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium">{d.graduacion.oi.eje}</td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full text-xs border-t border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-left font-bold text-slate-500 uppercase tracking-wider">Adición</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500" colSpan={3}>ADD OD</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-500" colSpan={3}>ADD OI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-semibold text-slate-600">Progresivo</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium" colSpan={3}>{d.graduacion.od.add}</td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-medium" colSpan={3}>{d.graduacion.oi.add}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* DESGLOSE */}
          <Section title="Detalle de Venta">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#4a148c]">
                    <th className="px-4 py-2.5 text-left font-bold text-white">Descripción</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white">P. Unitario</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white">Desc.</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white">IVA</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white">Importe</th>
                    <th className="px-3 py-2.5 text-right font-bold text-white">P. Final</th>
                  </tr>
                </thead>
                <tbody>
                  {d.detalle.map((p, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="text-slate-700 font-medium">{p.descripcion}</p>
                        {p.subtitulo && <p className="text-[10px] text-slate-400 mt-0.5">{p.subtitulo}</p>}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600">${p.precioUnitario.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-red-500">-${p.descuento.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-slate-600">${p.iva.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-slate-600">${p.importe.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-bold text-slate-800">${p.precioFinal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end mt-4">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-medium text-slate-700">${d.totales.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Descuento:</span>
                  <span className="font-medium text-red-500">-${d.totales.descuento.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>IVA (16%):</span>
                  <span className="font-medium text-slate-700">${d.totales.iva.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between items-center bg-[#4a148c] text-white px-5 py-3 rounded-lg">
                  <span className="font-bold text-sm">TOTAL</span>
                  <span className="font-extrabold text-lg">${d.totales.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>

          {/* PAGO */}
          <Section title="Información de Pago">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Método de Pago" value={d.pago.metodo} />
              <Field label="Referencia" value={d.pago.referencia} />
              <Field label="Fecha de Pago" value={d.pago.fechaPago} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Field label="Anticipo" value={`$${d.pago.anticipo.toLocaleString()}`} />
              <Field label="Saldo Pendiente" value={`$${d.pago.saldo.toLocaleString()}`} />
            </div>
          </Section>

          {/* FIRMAS */}
          <Section title="Firmas Digitales">
            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <div className="h-20 flex items-center justify-center mb-3">
                  <div className="w-48 border-b-2 border-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Firma de Responsable Sanitario</p>
                <p className="text-[10px] text-slate-400 mt-1">Lic. Sanitaria: XXXX-XXXX</p>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <div className="h-20 flex items-center justify-center mb-3">
                  <div className="w-48 border-b-2 border-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Firma de Optometrista</p>
                <p className="text-[10px] text-slate-400 mt-1">Cédula Profesional: XXXXXXX</p>
              </div>
            </div>
          </Section>

          {/* FOOTER */}
          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 leading-relaxed max-w-lg mx-auto">
              Este documento es un comprobante de venta válido. Los datos aquí registrados son confidenciales y están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Para consultas o aclaraciones, comuníquese a nuestro centro de atención. La graduación aquí especificada es vigente por un periodo de 12 meses a partir de la fecha de emisión. {opticsName ?? 'OptiÆllen'} © 2025. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[11px] font-bold text-[#4a148c] uppercase tracking-widest whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 font-medium">
        {value}
      </div>
    </div>
  );
}
