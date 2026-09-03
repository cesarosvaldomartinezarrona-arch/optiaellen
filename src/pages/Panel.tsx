import { useApp } from '../context/AppContext';
import { DollarSign, UserCheck, FlaskConical, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Panel() {
  const { sales, patients, labOrders, products } = useApp();

  const totalPatients = patients.length;
  const labPending = labOrders.filter(l => l.status !== 'Listo').length;
  const lowStock = products.filter(p => p.stock < 10).length;
  const recentSales = [...sales].reverse().slice(0, 6);

  const last7Days = [
    { name: 'Lun', ventas: 2780 },
    { name: 'Mar', ventas: 3180 },
    { name: 'Mie', ventas: 4100 },
    { name: 'Jue', ventas: 3600 },
    { name: 'Vie', ventas: 4280 },
    { name: 'Sab', ventas: 5200 },
    { name: 'Dom', ventas: 3900 },
  ];

  const categoryData = [
    { name: 'Monturas', value: 42, color: 'var(--accent)' },
    { name: 'Cristales', value: 28, color: '#f59e0b' },
    { name: 'Contacto', value: 18, color: '#10b981' },
    { name: 'Accesorios', value: 12, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats - exact like image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* VENTAS DEL DIA */}
        <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="h-1 bg-[var(--accent)]" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">VENTAS DEL DIA</p>
              <div className="w-8 h-8 rounded-lg bg-[#ede9fe] flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[var(--accent)]" strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">${(4280).toLocaleString()}</p>
            <p className="text-[13px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">↑ 12.5% vs ayer</p>
          </div>
        </div>
        {/* PACIENTES ATENDIDOS */}
        <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">PACIENTES ATENDIDOS</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">{totalPatients || 18}</p>
            <p className="text-[13px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">↑ 3 mas que ayer</p>
          </div>
        </div>
        {/* ORDENES DE LAB */}
        <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="h-1 bg-amber-400" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">ORDENES DE LAB</p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-amber-500" strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">{labPending || 7}</p>
            <p className="text-[13px] font-semibold text-red-600 mt-2 flex items-center gap-1">↓ 2 pendientes</p>
          </div>
        </div>
        {/* STOCK BAJO */}
        <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="h-1 bg-red-500" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">STOCK BAJO</p>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">{lowStock || 4}</p>
            <p className="text-[13px] font-semibold text-red-600 mt-2 flex items-center gap-1">↓ Requiere reposicion</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-12">
        <div className="xl:col-span-2 bg-white rounded-lg border border-slate-200/70 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Ventas Ultimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={last7Days} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="ventasFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={52} tickFormatter={(v) => `$${(v/1000).toFixed(0)},000`} domain={[0, 6000]} ticks={[0,1000,2000,3000,4000,5000,6000]} />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ stroke: '#e5e7eb', strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="ventas" stroke="var(--accent)" strokeWidth={2.5} fill="url(#ventasFill)" dot={{ r: 3.5, fill: 'var(--accent)', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Categorias Vendidas</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={78} outerRadius={118} dataKey="value" strokeWidth={0} paddingAngle={0}>
                  {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, '']} contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden mt-10">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Actividad Reciente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f7ff] border-b border-slate-200">
                {['FECHA', 'TIPO', 'DESCRIPCION', 'CLIENTE', 'MONTO', 'ESTADO'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-3.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">Sin actividad reciente</td></tr>
              ) : recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap font-medium">{sale.createdAt}</td>
                  <td className="px-6 py-4"><span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">Venta</span></td>
                  <td className="px-6 py-4 text-sm text-slate-700 max-w-[260px] leading-snug" title={sale.items.map(i => i.product.name).join(', ')}>{sale.items.map(i => i.product.name).join(', ')}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{sale.patientName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${sale.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      sale.status === 'Pagado' || sale.status === 'Entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      sale.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>{sale.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
