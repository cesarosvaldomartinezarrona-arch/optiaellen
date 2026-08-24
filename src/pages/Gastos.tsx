import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, DollarSign, Hash, TrendingUp, X } from 'lucide-react';
import type { ExpenseCategory } from '../types';

const categoryColors: Record<ExpenseCategory, string> = {
  'Renta': 'bg-pink-50 text-pink-700 border border-pink-200',
  'Servicios': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Compras': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Nómina': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Insumos': 'bg-purple-50 text-purple-700 border border-purple-200',
};

export default function Gastos() {
  const { expenses, setExpenses } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ concept: '', category: 'Servicios' as ExpenseCategory, amount: '', date: new Date().toISOString().split('T')[0] });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const handleAdd = () => {
    if (!newExpense.concept || !newExpense.amount) return;
    setExpenses([...expenses, { id: `G${String(expenses.length + 1).padStart(3, '0')}`, concept: newExpense.concept, category: newExpense.category, amount: parseFloat(newExpense.amount), date: newExpense.date }]);
    setNewExpense({ concept: '', category: 'Servicios', amount: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  const handleDelete = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const stats = [
    { label: 'Total Gastos', value: `$${totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Mayor Categoría', value: topCategory ? `${topCategory[0]} ($${topCategory[1].toLocaleString()})` : 'N/A', icon: TrendingUp, color: 'text-[#7c3aed]', bg: 'bg-purple-50' },
    { label: 'Transacciones', value: expenses.length, icon: Hash, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Gastos</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Control de gastos operativos</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-5 sm:px-6 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/25">
          <Plus className="w-4 h-4" /> Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg p-5 sm:p-8 border border-slate-200/80 shadow-sm">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-center gap-4 mt-3 sm:mt-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.bg} flex items-center justify-center`}><Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} /></div>
                <p className={`text-lg sm:text-xl font-extrabold ${stat.color} tracking-tight truncate`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100"><h3 className="text-base font-bold text-slate-900">Registro de Gastos</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50/80">
              {['ID', 'Concepto', 'Categoría', 'Monto', 'Fecha', 'Acciones'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#7c3aed]">{expense.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{expense.concept}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${categoryColors[expense.category]}`}>{expense.category}</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{expense.date}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(expense.id)} className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors border border-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white rounded-lg border border-slate-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{expense.concept}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{expense.id} · {expense.date}</p>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ml-3 ${categoryColors[expense.category]}`}>{expense.category}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-lg font-extrabold text-slate-900">${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              <button onClick={() => handleDelete(expense.id)} className="p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Nuevo Gasto</h2>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Concepto *</label>
                <input type="text" value={newExpense.concept} onChange={e => setNewExpense({ ...newExpense, concept: e.target.value })}
                  placeholder="Descripción del gasto" className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Categoría *</label>
                  <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]">
                    {(['Renta', 'Servicios', 'Compras', 'Nómina', 'Insumos'] as ExpenseCategory[]).map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Monto *</label>
                  <input type="number" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00" className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Fecha</label>
                <input type="date" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 sm:p-8 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-6 py-3.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleAdd} className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
