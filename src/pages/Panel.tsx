import { useApp } from '../context/AppContext';
import { DollarSign, UserCheck, FlaskConical, AlertTriangle } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

export default function Panel() {
  const { sales, patients, labOrders, products } = useApp();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalPatients = patients.length;
  const labPending = labOrders.filter(l => l.status !== 'Listo').length;
  const lowStock = products.filter(p => p.stock < 10).length;
  const recentSales = [...sales].reverse().slice(0, 6);

  // 7 days mock like image
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
    { name: 'Monturas', value: 45, color: '#7c3aed' },
    { name: 'Cristales', value: 25, color: '#f59e0b' },
    { name: 'Contacto', value: 18, color: '#10b981' },
    { name: 'Accesorios', value: 12, color: '#6b7280' },
  ];

  const stats = [
    { label: 'VENTAS DEL DIA', value: `$${(4280).toLocaleString()}`, sub: '↑ 12.5% vs ayer', subColor: 'text-emerald-500', border: 'border-t-[#7c3aed]', icon: DollarSign, iconBg: 'bg-[#ede9fe] text-[#7c3aed]' },
    { label: 'PACIENTES ATENDIDOS', value: '18', sub: '↑ 3 mas que ayer', subColor: 'text-emerald-500', border: 'border-t-emerald-500', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600' },
    { label: 'ORDENES DE LAB', value: '7', sub: '↓ 2 pendientes', subColor: 'text-red-500', border: 'border-t-amber-400', icon: FlaskConical, iconBg: 'bg-amber-50 text-amber-500' },
    { label: 'STOCK BAJO', value: '4', sub: '↓ Requiere reposicion', subColor: 'text-red-500', border: 'border-t-red-500', icon: AlertTriangle, iconBg: 'bg-red-50 text-red-500' },
  ];

  // Use real totals where possible but show image-like values for demo
  const displaySales = totalSales > 0 ? `$${totalSales.toLocaleString('es-MX')}` : stats[0].value;
  const displayPatients = totalPatients || 18;

  return (
    <div className="space-y-6">
      {/* Page title - hidden on desktop shown via header, but keep for mobile */}
      <div className="lg:hidden">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm">Resumen general del negocio</p>
      </div>

      {/* Stats - 4 cards with top border like image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const val = idx === 0 ? displaySales : idx === 1 ? String(displayPatients) : idx === 2 ? String(labPending || 7) : String(lowStock || 4);
          return (
            <div key={stat.label} className={`bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-t-[3px] ${stat.border}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{val}</p>
                <p className={`text-xs font-medium mt-1 ${stat.subColor}`}>{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Line chart - 7 dias */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Ventas Ultimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={last7Days} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)},000`} width={55} />
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Ventas']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="ventas" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorVentas)" dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#7c3aed' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Categorias Vendidas</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={0} strokeWidth={0}>
                {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                <span className="text-[11px] font-medium text-slate-500">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4">
          <h3 className="text-sm font-bold text-slate-900">Actividad Reciente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50">
                {['FECHA', 'TIPO', 'DESCRIPCION', 'CLIENTE', 'MONTO', 'ESTADO'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">Sin actividad reciente</td></tr>
              ) : recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{sale.createdAt}</td>
                  <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">Venta</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[200px]">{sale.items.map(i => i.product.name).join(', ')}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{sale.patientName}</td>
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
