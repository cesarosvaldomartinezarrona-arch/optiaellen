import { useState } from "react";
import TicketVenta, { defaultData, type TicketVentaData } from "../components/TicketVenta";
import { useApp } from "../context/AppContext";
import type { Sale } from "../types";

function saleToTicketData(sale: Sale, opticsName: string): TicketVentaData {
  // Map sale / mock to ticket structure — fallback to defaults for missing fields
  const subtotal = sale.subtotal;
  const discount = sale.discount;
  const iva = sale.tax;
  const total = sale.total;

  // Build detalle from sale items
  const detalle = sale.items.map((it) => {
    const unit = it.product.price;
    const qty = it.quantity;
    const importe = unit * qty;
    // distribute discount proportionally roughly
    const disc = sale.discount ? Math.round((importe / subtotal) * sale.discount * 100) / 100 : 0;
    const base = importe - disc;
    const ivaLine = Math.round(base * 0.16 * 100) / 100;
    return {
      descripcion: it.product.name,
      subtitulo: `${it.product.model} · ${it.product.brand ?? ""} x${qty}`.trim(),
      precioUnitario: unit,
      descuento: disc,
      iva: ivaLine,
      importe: base,
      precioFinal: base + ivaLine,
    };
  });

  return {
    folio: sale.id.replace("V", "SD-2025-"),
    fecha: new Date(sale.createdAt).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " — 10:42 AM",
    sucursal: `${opticsName} Centro — Óptica`,
    vendedor: "Dra. Elena Ruiz — Optometrista",
    tipoVenta: sale.status === "Pendiente" ? "Crédito" : "Contado",
    paciente: {
      nombre: sale.patientName.toUpperCase(),
      edad: defaultData.paciente.edad,
      fechaNacimiento: defaultData.paciente.fechaNacimiento,
      telefono: defaultData.paciente.telefono,
      correo: defaultData.paciente.correo,
      direccion: defaultData.paciente.direccion,
      ocupacion: defaultData.paciente.ocupacion,
    },
    producto: defaultData.producto,
    graduacion: defaultData.graduacion,
    detalle: detalle.length ? detalle : defaultData.detalle,
    totales: {
      subtotal,
      descuento: discount,
      iva,
      total,
    },
    pago: {
      metodo: sale.paymentMethod ?? "Pendiente",
      referencia: "—",
      anticipo: sale.status === "Pagado" || sale.status === "Entregado" ? total : 0,
      saldo: sale.status === "Pagado" || sale.status === "Entregado" ? 0 : total,
      fechaPago: sale.paymentDate
        ? new Date(sale.paymentDate).toLocaleDateString("es-MX")
        : new Date().toLocaleDateString("es-MX"),
    },
  };
}

export default function TicketPage() {
  const { sales, opticsName } = useApp();
  const [selectedSaleId, setSelectedSaleId] = useState<string>(sales[0]?.id ?? "");

  const sale = sales.find((s) => s.id === selectedSaleId) ?? sales[0];
  const ticketData = sale ? saleToTicketData(sale, opticsName) : defaultData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Ticket de Venta — Formato Óptico</h1>
          <p className="text-sm text-slate-500 mt-1">
            Vista previa pixel-perfect · Salud Digna — Formulario con firma digital · Selecciona una venta real
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">
            Venta
          </label>
          <select
            value={selectedSaleId}
            onChange={(e) => setSelectedSaleId(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4a148c]/20 focus:border-[#4a148c]"
          >
            {sales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.patientName} (${s.total.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ticket render — sin padding extra del Layout */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-7 xl:-mx-8">
        <TicketVenta data={ticketData} opticsName={opticsName} />
      </div>
    </div>
  );
}
