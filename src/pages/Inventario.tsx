import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, AlertTriangle, Edit2, Trash2, X, Save } from 'lucide-react';
import type { ProductCategory } from '../types';

const categoryColors: Record<ProductCategory, string> = {
  'Monturas': 'bg-purple-50 text-purple-700 border border-purple-200',
  'Lentes de Contacto': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Cristales': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Accesorios': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export default function Inventario() {
  const { products, setProducts } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', model: '', category: 'Monturas' as ProductCategory, price: '', stock: '', brand: '', type: '' });
  const [editForm, setEditForm] = useState({ name: '', model: '', category: '' as ProductCategory, price: '', stock: '', brand: '', type: '' });

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'Todos' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, {
      id: `PRD${String(products.length + 1).padStart(3, '0')}`, name: newProduct.name, model: newProduct.model,
      category: newProduct.category, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0, brand: newProduct.brand, type: newProduct.type,
    }]);
    setShowAddModal(false);
    setNewProduct({ name: '', model: '', category: 'Monturas', price: '', stock: '', brand: '', type: '' });
  };

  const startEdit = (id: string) => {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    setEditProduct(id);
    setEditForm({ name: p.name, model: p.model, category: p.category, price: String(p.price), stock: String(p.stock), brand: p.brand || '', type: p.type || '' });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    setProducts(products.map(p => p.id === editProduct ? {
      ...p, name: editForm.name, model: editForm.model, category: editForm.category,
      price: parseFloat(editForm.price) || p.price, stock: parseInt(editForm.stock) || p.stock,
      brand: editForm.brand, type: editForm.type,
    } : p));
    setEditProduct(null);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const ProductForm = ({ form, setForm, onSave, onCancel, title }: {
    form: typeof newProduct; setForm: any; onSave: () => void; onCancel: () => void; title: string;
  }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nombre *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Modelo</label>
              <input type="text" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]">
                {(['Monturas', 'Lentes de Contacto', 'Cristales', 'Accesorios'] as ProductCategory[]).map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Marca</label>
              <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Precio *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tipo</label>
            <input type="text" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Acetato, Metal, Diario..." /></div>
        </div>
        <div className="flex justify-end gap-3 p-5 sm:p-6 border-t border-slate-100">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
          <button onClick={onSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 flex items-center gap-2"><Save className="w-4 h-4" /> Guardar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Inventario</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Control de productos y stock</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/25">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-3 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
          <p className="text-xl sm:text-3xl font-extrabold text-[#7c3aed] mt-1 sm:mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-2xl p-3 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor</p>
          <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-1 sm:mt-2">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-3 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Bajo</p>
          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2"><AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" /><p className="text-xl sm:text-3xl font-extrabold text-red-600">{lowStockCount}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Todos', 'Monturas', 'Lentes', 'Cristales', 'Accesorios'].map((cat, i) => {
              const full = ['Todos', 'Monturas', 'Lentes de Contacto', 'Cristales', 'Accesorios'][i];
              return (
                <button key={cat} onClick={() => setFilterCategory(full as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterCategory === full ? 'bg-[#7c3aed] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50/80">
              {['ID', 'Producto', 'Modelo', 'Categoría', 'Precio', 'Stock', 'Acciones'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-[#7c3aed]">{product.id}</td>
                  <td className="px-5 py-3">
                    <div><span className="text-sm font-bold text-slate-800">{product.name}</span>
                    {product.brand && <span className="text-xs text-slate-400 ml-2">({product.brand})</span>}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{product.model}</td>
                  <td className="px-5 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${categoryColors[product.category]}`}>{product.category}</span></td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-900">${product.price.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>{product.stock}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(product.id)} className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] hover:bg-purple-100 flex items-center justify-center transition-colors border border-purple-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors border border-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{product.model}</p>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ml-2 ${categoryColors[product.category]}`}>{product.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#7c3aed]">${product.price.toLocaleString()}</span>
              <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>Stock: {product.stock}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <button onClick={() => startEdit(product.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-semibold hover:bg-purple-100 transition-colors"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
              <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <ProductForm form={newProduct} setForm={setNewProduct} onSave={handleAdd} onCancel={() => setShowAddModal(false)} title="Nuevo Producto" />}
      {editProduct && <ProductForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={() => setEditProduct(null)} title="Editar Producto" />}

      {showSaved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl shadow-emerald-500/30 flex items-center gap-2 text-sm font-semibold z-50">
          <Save className="w-4 h-4" /> Producto actualizado
        </div>
      )}
    </div>
  );
}
