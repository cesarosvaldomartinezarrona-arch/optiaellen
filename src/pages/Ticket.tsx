import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TicketVenta, { defaultData, type TicketVentaData } from "../components/TicketVenta";
import { useApp } from "../context/AppContext";
import { FileText } from "lucide-react";
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
      cantidad: qty,
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
    sucursal: opticsName,
    rfc: defaultData.rfc,
    regimenFiscal: defaultData.regimenFiscal,
    direccionSucursal: defaultData.direccionSucursal,
    telefonoOptica: defaultData.telefonoOptica,
    redesSociales: defaultData.redesSociales,
    cedula: defaultData.cedula,
    licenciatura: defaultData.licenciatura,
    optometrista: defaultData.optometrista,
    paciente: sale.patientName.toUpperCase(),
    telefonoCliente: defaultData.telefonoCliente,
    emailCliente: defaultData.emailCliente,
    rfcCliente: defaultData.rfcCliente,
    fechaNacimiento: defaultData.fechaNacimiento,
    calle: defaultData.calle,
    colonia: defaultData.colonia,
    ocupacion: defaultData.ocupacion,
    tipoLente: defaultData.tipoLente,
    materialLente: defaultData.materialLente,
    descripcionProducto: sale.items.map(it => `${it.product.name} ${it.product.model}`).join(", "),
    tratamientos: defaultData.tratamientos,
    armazon: defaultData.armazon,
    colorArmazon: defaultData.colorArmazon,
    graduacion: defaultData.graduacion,
    observaciones: "Sin observaciones",
    detalle: detalle.length ? detalle : defaultData.detalle,
    totales: { subtotal, descuento: discount, iva, total: totalFinal },
    anticipo: defaultData.anticipo,
    saldoPendiente: totalFinal - defaultData.anticipo,
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
    fechaEntrega: defaultData.fechaEntrega,
    condicionesEntrega: defaultData.condicionesEntrega,
    garantiaMicas: defaultData.garantiaMicas,
    garantiaArmazon: defaultData.garantiaArmazon,
    coberturaGarantia: defaultData.coberturaGarantia,
    condicionesCambio: defaultData.condicionesCambio,
    politicaCancelacion: defaultData.politicaCancelacion,
  };
}

export default function TicketPage() {
  const { sales, opticsName } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const saleParam = searchParams.get("sale");

  const [selectedSaleId, setSelectedSaleId] = useState<string>(saleParam ?? "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (saleParam && sales.find(s => s.id === saleParam)) {
      setSelectedSaleId(saleParam);
      setShowModal(true);
    }
  }, [saleParam, sales]);

  const sale = sales.find((s) => s.id === selectedSaleId);
  const ticketData = sale ? saleToTicketData(sale, opticsName) : defaultData;

  const handleClose = () => {
    setShowModal(false);
    setSearchParams({});
    navigate('/ticket');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--accent)]" /> Nota de Venta
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Formulario detallado para entregar al cliente · Selecciona una venta o llena manualmente
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedSaleId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSaleId(val);
              if (val) {
                setSearchParams({ sale: val });
              } else {
                setSearchParams({});
              }
            }}
            className="flex-1 sm:w-64 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
          >
            <option value="">— Llenar manualmente —</option>
            {sales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.patientName} (${s.total.toLocaleString()})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[#5b21b6] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-[rgba(var(--accent-rgb),0.25)] whitespace-nowrap"
          >
            <FileText className="w-4 h-4" /> Abrir Formulario
          </button>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Última venta</p>
          <p className="text-lg font-extrabold text-[var(--accent)] mt-1">{sales[0]?.id ?? '—'}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sales[0]?.patientName ?? 'Sin ventas'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total ventas</p>
          <p className="text-lg font-extrabold text-emerald-600 mt-1">{sales.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">registros</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tickets</p>
          <p className="text-lg font-extrabold text-amber-600 mt-1">{sales.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">notas generadas</p>
        </div>
      </div>

      {/* Modal Ticket de Venta */}
      {showModal && (
        <TicketVenta
          data={ticketData}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
