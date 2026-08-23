import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Banknote, Building2, Wallet, Check, ArrowRight, Printer } from 'lucide-react';
import type { PaymentMethod } from '../types';

function buildSaleTicketHTML(opticsName: string, data: {
  saleId: string; patientName: string; items: { name: string; qty: number; price: number }[];
  subtotal: number; iva: number; total: number; method: string; date: string;
}): string {
  const line = '─'.repeat(32);
  void line;
  const doubleLine = '═'.repeat(32);
  void doubleLine;
  const itemsHTML = data.items.map(i =>
    `<tr><td>${i.name}</td><td class="right">${i.qty}x</td><td class="right">$${(i.price * i.qty).toLocaleString()}</td></tr>`
  ).join('');
  return `<!DOCTYPE html>
<html><head><title>Ticket Venta</title>
<style>
  @page { size: 80mm auto; margin: 2mm; }
  body { font-family: 'Courier New', monospace; font-size: 11px; width: 76mm; margin: 0; padding: 2mm; color: #000; }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .big { font-size: 14px; }
  .small { font-size: 9px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 1px 2px; }
  .right { text-align: right; }
  .line { border-top: 1px dashed #000; margin: 3px 0; }
  .dbl { border-top: 2px solid #000; margin: 3px 0; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style></head><body>
  <div class="center bold big">${opticsName}</div>
  <div class="center small">Ver bien es vivir mejor</div>
  <div class="center small">TICKET DE VENTA</div>
  <div class="dbl"></div>
  <table>
    <tr><td class="bold">Venta:</td><td class="right">${data.saleId}</td></tr>
    <tr><td class="bold">Fecha:</td><td class="right">${data.date}</td></tr>
    <tr><td class="bold">Cliente:</td><td class="right">${data.patientName}</td></tr>
    <tr><td class="bold">Pago:</td><td class="right">${data.method}</td></tr>
  </table>
  <div class="line"></div>
  <div class="bold">Artículos:</div>
  <table>
    <tr><td class="bold small">Producto</td><td class="right bold small">Cant</td><td class="right bold small">Subtotal</td></tr>
    ${itemsHTML}
  </table>
  <div class="line"></div>
  <table>
    <tr><td class="bold">Subtotal:</td><td class="right">$${data.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td></tr>
    <tr><td class="bold">IVA (16%):</td><td class="right">$${data.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td></tr>
    <tr><td class="bold big">TOTAL:</td><td class="right bold big">$${data.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td></tr>
  </table>
  <div class="dbl"></div>
  <div class="center small">¡Gracias por su compra!</div>
  <div class="center small">${new Date().toLocaleString('es-MX')}</div>
  <div class="dbl"></div>
  <br/>
</body></html>`;
}

function openTicketWindow(html: string) {
  const w = window.open('', '_blank', 'width=300,height=600');
  if (!w) { alert('Permita ventanas emergentes para imprimir'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

export default function Cobrar() {
  const { pendingPayments, setPendingPayments, setSales, opticsName, sales } = useApp();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({ method: 'Efectivo' as PaymentMethod, cashAmount: '', cardReference: '', partialAmount: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastPaidSaleId, setLastPaidSaleId] = useState<string | null>(null);

  const methods = [
    { id: 'Efectivo', label: 'Efectivo', icon: Banknote, color: 'from-emerald-500 to-emerald-600' },
    { id: 'Tarjeta Débito', label: 'Tarjeta Débito', icon: CreditCard, color: 'from-blue-500 to-blue-600' },
    { id: 'Tarjeta Crédito', label: 'Tarjeta Crédito', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
    { id: 'Transferencia', label: 'Transferencia', icon: Building2, color: 'from-amber-500 to-orange-500' },
    { id: 'Anticipo', label: 'Anticipo / Apartado', icon: Wallet, color: 'from-pink-500 to-rose-500' },
  ];

  const selected = pendingPayments.find(p => p.id === selectedPayment);
  const cashGiven = parseFloat(paymentData.cashAmount) || 0;
  const change = cashGiven - (selected?.pending || 0);

  const handleProcessPayment = () => {
    if (!selected) return;
    setProcessingId(selected.id);
    const paidSaleId = selected.saleId;
    setTimeout(() => {
      if (paymentData.method === 'Anticipo') {
        const partialPaid = parseFloat(paymentData.partialAmount) || 0;
        setPendingPayments(prev => prev.map(p => p.id === selected.id ? { ...p, paid: p.paid + partialPaid, pending: p.pending - partialPaid, status: (p.pending - partialPaid <= 0 ? 'Pendiente' : 'Parcial') as any } : p));
      } else {
        setPendingPayments(prev => prev.map(p => p.id === selected.id ? { ...p, paid: p.total, pending: 0, status: 'Pagado' as any } : p).filter(p => p.id !== selected.id));
        setSales(prev => prev.map(s => s.id === paidSaleId ? { ...s, status: 'Pagado', paymentMethod: paymentData.method, paymentDate: new Date().toISOString().split('T')[0] } : s));
      }
      setProcessingId(null);
      setLastPaidSaleId(paidSaleId);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setSelectedPayment(null); setPaymentData({ method: 'Efectivo', cashAmount: '', cardReference: '', partialAmount: '' }); setLastPaidSaleId(null); }, 5000);
    }, 1000);
  };

  const handlePrintSaleTicket = () => {
    if (!lastPaidSaleId) return;
    const sale = sales.find(s => s.id === lastPaidSaleId);
    if (!sale) return;
    const html = buildSaleTicketHTML(opticsName, {
      saleId: sale.id,
      patientName: sale.patientName,
      items: sale.items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
      subtotal: sale.subtotal,
      iva: sale.tax,
      total: sale.total,
      method: paymentData.method,
      date: new Date().toLocaleString('es-MX'),
    });
    openTicketWindow(html);
  };

  const statusColor = (s: string) => s === 'Pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cobrar</h1>
        <p className="text-slate-500 text-sm mt-1">Gestión de cobros y pagos pendientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pagos Pendientes</h3>
          {pendingPayments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3"><Check className="w-7 h-7 text-emerald-600" /></div>
              <p className="text-sm font-medium text-slate-500">No hay pagos pendientes</p>
            </div>
          ) : pendingPayments.map(p => (
            <div key={p.id} onClick={() => { setSelectedPayment(p.id); setPaymentData({ method: 'Efectivo', cashAmount: '', cardReference: '', partialAmount: '' }); }}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selectedPayment === p.id ? 'border-[#7c3aed] shadow-lg shadow-purple-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{p.patientName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Venta: {p.saleId}</p>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Total:</span><span className="font-bold text-slate-800">${p.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
              {p.paid > 0 && <div className="flex justify-between text-sm"><span className="text-slate-500">Pagado:</span><span className="font-bold text-emerald-600">${p.paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>}
              <div className="flex justify-between text-sm border-t border-slate-100 mt-2 pt-2">
                <span className="text-slate-500 font-semibold">Pendiente:</span>
                <span className="font-bold text-red-600">${p.pending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Procesar Pago — {selected.patientName}</h3>
                <p className="text-sm text-slate-500 mt-1">Monto a cobrar: <span className="font-bold text-[#7c3aed] text-base">${selected.pending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Método de Pago</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {methods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setPaymentData({ ...paymentData, method: m.id as PaymentMethod })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentData.method === m.id ? 'border-[#7c3aed] bg-purple-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {paymentData.method === 'Efectivo' && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Efectivo Recibido</label>
                    <input type="number" value={paymentData.cashAmount} onChange={e => setPaymentData({ ...paymentData, cashAmount: e.target.value })}
                      placeholder="0.00" className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-sm text-slate-500 font-medium">Cambio / Vuelto:</span>
                    <span className={`text-xl font-extrabold ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>${change.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}

              {(paymentData.method === 'Tarjeta Débito' || paymentData.method === 'Tarjeta Crédito') && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Referencia / Número de Voucher</label>
                  <input type="text" value={paymentData.cardReference} onChange={e => setPaymentData({ ...paymentData, cardReference: e.target.value })}
                    placeholder="Ingrese referencia del voucher" className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              )}

              {paymentData.method === 'Transferencia' && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Número de Transferencia / Folio</label>
                  <input type="text" value={paymentData.cardReference} onChange={e => setPaymentData({ ...paymentData, cardReference: e.target.value })}
                    placeholder="Ingrese folio de transferencia" className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              )}

              {paymentData.method === 'Anticipo' && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Monto del Anticipo</label>
                    <input type="number" value={paymentData.partialAmount} onChange={e => setPaymentData({ ...paymentData, partialAmount: e.target.value })}
                      placeholder="0.00" className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Saldo restante:</span>
                    <span className="font-bold text-red-600">${(selected.pending - (parseFloat(paymentData.partialAmount) || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}

              <button onClick={handleProcessPayment} disabled={processingId === selected.id}
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                {processingId === selected.id ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Procesar Pago <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><CreditCard className="w-8 h-8 text-slate-300" /></div>
              <p className="text-slate-500 font-medium">Selecciona un pago para procesar</p>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border border-slate-200/80 max-w-sm w-full">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-emerald-600" /></div>
            <h3 className="text-lg font-bold text-slate-900">Pago Procesado</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">El pago se ha registrado correctamente</p>
            <div className="flex gap-3">
              <button onClick={handlePrintSaleTicket}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-amber-500/25">
                <Printer className="w-4 h-4" /> Imprimir Ticket
              </button>
              <button onClick={() => { setShowSuccess(false); setSelectedPayment(null); setPaymentData({ method: 'Efectivo', cashAmount: '', cardReference: '', partialAmount: '' }); setLastPaidSaleId(null); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
