import { useApp } from '../context/AppContext';
import { DollarSign, Users, FlaskConical, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Panel() {
  const { sales, patients, labOrders, products } = useApp();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalPatients = patients.length;
  const labPending = labOrders.filter(l => l.status !== 'Listo').length;
  const lowStock = products.filter(p => p.stock < 10).length;
  const recentSales = [...sales].reverse().slice(0, 5);

  const salesByMonth = [
    { name: 'Oct', total: 18500 },
    { name: 'Nov', total: 24300 },
    { name: 'Dic', total: totalSales },
  ];

  const categoryData = [
    { name: 'Monturas', value: 45, color: '#7c3aed' },
    { name: 'Lentes', value: 25, color: '#a78bfa' },
    { name: 'Cristales', value: 20, color: '#c4b5fd' },
    { name: 'Accesorios', value: 10, color: '#ede9fe' },
  ];

  const stats = [
    { label: 'Ventas Totales', value: `$${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, icon: DollarSign, gradient: 'from-[#7c3aed] to-[#6d28d9]', textColor: 'text-[#7c3aed]', change: '+12.5%', up: true },
    { label: 'Pacientes', value: totalPatients, icon: Users, gradient: 'from-[#059669] to-[#047857]', textColor: 'text-emerald-600', change: '+3 este mes', up: true },
    { label: 'Lab Pendiente', value: labPending, icon: FlaskConical, gradient: 'from-[#d97706] to-[#b45309]', textColor: 'text-amber-600', change: labPending > 0 ? 'Requiere atención' : 'Al día', up: false },
    { label: 'Stock Bajo', value: lowStock, icon: AlertTriangle, gradient: 'from-[#dc2626] to-[#b91c1c]', textColor: 'text-red-600', change: lowStock > 0 ? 'Reponer urgentemente' : 'OK', up: false },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Pagado': case 'Entregado': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Pendiente': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Parcial': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const labStatusColor = (phase: number) => {
    if (phase <= 2) return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (phase <= 4) return 'bg-blue-50 text-blue-700 border border-blue-200';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  const labProgress = (phase: number) => (phase / 6) * 100;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 text-sm mt-1">Resumen general de la operación de la óptica</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#7c3aed]/10 to-[#a855f7]/10 px-4 py-2 rounded-xl border border-purple-200/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-[#7c3aed]">Sistema activo</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-[9px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-lg sm:text-2xl font-extrabold mt-1 ${stat.textColor} tracking-tight`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Ventas Mensuales</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparativa de los últimos 3 meses</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200/50">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByMonth} barCategoryGap="25%">
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']} contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px 16px' }} cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
              <Bar dataKey="total" fill="#7c3aed" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Ventas por Categoría</h3>
          <p className="text-xs text-slate-400 mb-4">Distribución del inventario</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`]} contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <div><p className="text-xs font-semibold text-slate-700">{cat.name}</p><p className="text-[10px] text-slate-400">{cat.value}%</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#7c3aed]/5 to-transparent">
            <h3 className="text-base font-bold text-slate-900">Ventas Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50/80">
                {['ID', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (<th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-bold text-[#7c3aed]">{sale.id}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-800">{sale.patientName}</td>
                    <td className="px-6 py-3.5 text-sm font-bold text-slate-900">${sale.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3.5"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor(sale.status)}`}>{sale.status}</span></td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{sale.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#7c3aed]/5 to-transparent">
            <h3 className="text-base font-bold text-slate-900">Órdenes de Laboratorio</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50/80">
                {['Orden', 'Cliente', 'Progreso', 'Estado'].map(h => (<th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {labOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-bold text-[#7c3aed]">{order.id}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-800">{order.patientName}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full transition-all" style={{ width: `${labProgress(order.phase)}%` }} /></div>
                        <span className="text-xs font-semibold text-slate-500 w-8 text-right">{Math.round(labProgress(order.phase))}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${labStatusColor(order.phase)}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
