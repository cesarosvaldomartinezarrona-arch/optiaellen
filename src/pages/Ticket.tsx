import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TicketVenta, { defaultData, type TicketVentaData } from "../components/TicketVenta";
import { useApp } from "../context/AppContext";
import type { Sale } from "../types";

function saleToTicketData(sale: Sale, opticsName: string): TicketVentaData {
  const subtotal = sale.subtotal;
  const discount = sale.discount;
  const iva = sale.tax;
  const total = sale.total;

  const detalle = sale.items.map((it) => {
    const unit = it.product.price;
    const qty = it.quantity;
    const importe = unit * qty;
    const disc = sale.discount ? Math.round((importe / subtotal) * sale.discount * 100) / 100 : 0;
    const base = importe - disc;
    const ivaLine = Math.round(base * 0.16 * 100) / 100;
    return {
      descripcion: `${it.product.name} ${it.product.model} ${it.product.brand ?? ""}`.trim(),
      precioUnitario: unit,
      descuento: disc,
      iva: ivaLine,
      importe: base,
      precioFinal: base + ivaLine,
    };
  });

  const totalFinal = detalle.length ? detalle.reduce((s, d) => s + d.precioFinal, 0) : total;

  return {
    recepcionista: defaultData.recepcionista,
    folio: sale.id.replace("V", "SD-2025-"),
    fechaVenta: new Date(sale.createdAt).toISOString().split("T")[0],
    paciente: sale.patientName.toUpperCase(),
    fechaNacimiento: defaultData.fechaNacimiento,
    direccion: defaultData.direccion,
    clinica: opticsName,
    rfc: defaultData.rfc,
    optometrista: defaultData.optometrista,
    trabajo: defaultData.trabajo,
    descripcionProducto: sale.items.map(it => `${it.product.name} ${it.product.model}`).join(", "),
    armazon: defaultData.armazon,
    graduacion: defaultData.graduacion,
    observaciones: "Sin observaciones",
    detalle: detalle.length ? detalle : defaultData.detalle,
    totales: {
      subtotal,
      descuento: discount,
      iva,
      total: totalFinal,
    },
    pago: {
      estatus: sale.status === "Pagado" || sale.status === "Entregado" ? "Pagado" : "Adeudo",
      formaPago: sale.paymentMethod ?? "—",
      exento: "Sin exento",
      pagoTotalEmpresa: 0,
      pagoCliente: sale.status === "Pagado" || sale.status === "Entregado" ? total : 0,
      universidad: "",
    },
    son: defaultData.son,
    fechaRecoge: defaultData.fechaRecoge,
    horaRecoge: defaultData.horaRecoge,
  };
}

export default function TicketPage() {
  const { sales, opticsName } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const saleParam = searchParams.get("sale");

  const [selectedSaleId, setSelectedSaleId] = useState<string>(saleParam ?? sales[0]?.id ?? "");

  useEffect(() => {
    if (saleParam && sales.find(s => s.id === saleParam)) {
      setSelectedSaleId(saleParam);
    }
  }, [saleParam, sales]);

  const sale = sales.find((s) => s.id === selectedSaleId) ?? sales[0];
  const ticketData = sale ? saleToTicketData(sale, opticsName) : defaultData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm no-print">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Nota de Venta — Formato Óptico</h1>
          <p className="text-sm text-slate-500 mt-1">
            Formulario detallado para entregar al cliente · Selecciona una venta o llena manualmente
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">
            Venta
          </label>
          <select
            value={selectedSaleId}
            onChange={(e) => {
              setSelectedSaleId(e.target.value);
              setSearchParams(e.target.value ? { sale: e.target.value } : {});
            }}
            className="flex-1 sm:w-64 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
          >
            <option value="">— Llenar manualmente —</option>
            {sales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.patientName} (${s.total.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="-mx-4 sm:-mx-6 lg:-mx-7 xl:-mx-8">
        <TicketVenta data={ticketData} opticsName={opticsName} />
      </div>
    </div>
  );
}
