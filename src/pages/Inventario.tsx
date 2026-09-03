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

type ProductFormData = {
  name: string; model: string; category: ProductCategory;
  price: string; cost: string; stock: string;
  brand: string; type: string; color: string;
};

function ProductForm({ form, setForm, onSave, onCancel, title }: {
  form: ProductFormData; setForm: (f: ProductFormData) => void;
  onSave: () => void; onCancel: () => void; title: string;
}) {
  const update = (field: keyof ProductFormData, value: string) => setForm({ ...form, [field]: value });
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onCancel} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-slate-200" /> Información general
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Nombre *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="Ej: Gafas Urban Chic" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Modelo</label>
                <input type="text" value={form.model} onChange={e => update('model', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="Ej: UC-2024" /></div>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-slate-200" /> Clasificación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Categoría</label>
                <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]">
                  {(['Monturas', 'Lentes de Contacto', 'Cristales', 'Accesorios'] as ProductCategory[]).map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Marca</label>
                <input type="text" value={form.brand} onChange={e => update('brand', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="Ej: Ray-Ban" /></div>
            </div>
            <div className="mt-6"><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Tipo</label>
              <input type="text" value={form.type} onChange={e => update('type', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="Ej: Acetato, Metal, Diario..." /></div>
            <div className="mt-6"><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Color de armazón / montura</label>
              <input type="text" value={form.color} onChange={e => update('color', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="Ej: Negro, Carey, Dorado..." /></div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-slate-200" /> Detalles comerciales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Costo Real</label>
                <input type="number" value={form.cost} onChange={e => update('cost', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="0.00" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Precio de Venta *</label>
                <input type="number" value={form.price} onChange={e => update('price', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="0.00" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Stock</label>
                <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" placeholder="0" /></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <button onClick={onCancel} className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">Cancelar</button>
          <button onClick={onSave} className="px-7 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.25)] hover:shadow-[rgba(var(--accent-rgb),0.30)] transition-all">Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function Inventario() {
  const { products, setProducts } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', model: '', category: 'Monturas' as ProductCategory, price: '', cost: '', stock: '', brand: '', type: '', color: '' });
  const [editForm, setEditForm] = useState({ name: '', model: '', category: '' as ProductCategory, price: '', cost: '', stock: '', brand: '', type: '', color: '' });

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
      category: newProduct.category, price: parseFloat(newProduct.price), cost: parseFloat(newProduct.cost) || 0, stock: parseInt(newProduct.stock) || 0, brand: newProduct.brand, type: newProduct.type, color: newProduct.color,
    }]);
    setShowAddModal(false);
    setNewProduct({ name: '', model: '', category: 'Monturas', price: '', cost: '', stock: '', brand: '', type: '', color: '' });
  };

  const startEdit = (id: string) => {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    setEditProduct(id);
    setEditForm({ name: p.name, model: p.model, category: p.category, price: String(p.price), cost: String(p.cost || ''), stock: String(p.stock), brand: p.brand || '', type: p.type || '', color: p.color || '' });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    setProducts(products.map(p => p.id === editProduct ? {
      ...p, name: editForm.name, model: editForm.model, category: editForm.category,
      price: parseFloat(editForm.price) || p.price, cost: parseFloat(editForm.cost) || 0, stock: parseInt(editForm.stock) || p.stock,
      brand: editForm.brand, type: editForm.type, color: editForm.color,
    } : p));
    setEditProduct(null);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Inventario</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Control de productos y stock</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[#5b21b6] text-white px-5 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-[rgba(var(--accent-rgb),0.25)]">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider lg:p-[2px]">Total</p>
          <p className="text-xl sm:text-3xl font-extrabold text-[var(--accent)] mt-2 sm:mt-3">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider lg:p-[2px]">Valor</p>
          <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-2 sm:mt-3">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider lg:p-[2px]">Stock Bajo</p>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3"><AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" /><p className="text-xl sm:text-3xl font-extrabold text-red-600">{lowStockCount}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/80 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] placeholder:text-slate-400" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 lg:p-[2px]">
            {['Todos', 'Monturas', 'Lentes', 'Cristales', 'Accesorios'].map((cat, i) => {
              const full = ['Todos', 'Monturas', 'Lentes de Contacto', 'Cristales', 'Accesorios'][i];
              return (
                <button key={cat} onClick={() => setFilterCategory(full as any)}
                  className={`px-4 py-2.5 lg:px-[18px] lg:py-[12px] lg:m-[2px] rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterCategory === full ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
                  <span className="lg:p-[2px]">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50/80">
              {['ID', 'Producto', 'Modelo', 'Categoría', 'Precio', 'Stock', 'Acciones'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[var(--accent)]">{product.id}</td>
                  <td className="px-6 py-4">
                    <div><span className="text-sm font-bold text-slate-800">{product.name}</span>
                    {product.brand && <span className="text-xs text-slate-400 ml-2">({product.brand})</span>}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.model}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${categoryColors[product.category]}`}>{product.category}</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>{product.stock}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(product.id)} className="w-9 h-9 rounded-lg bg-purple-50 text-[var(--accent)] hover:bg-purple-100 flex items-center justify-center transition-colors border border-purple-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors border border-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-lg border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-1">{product.model}</p>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ml-3 ${categoryColors[product.category]}`}>{product.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-[var(--accent)]">${product.price.toLocaleString()}</span>
              <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>Stock: {product.stock}</span>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => startEdit(product.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-purple-50 text-[var(--accent)] text-xs font-semibold hover:bg-purple-100 transition-colors"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
              <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <ProductForm form={newProduct} setForm={setNewProduct} onSave={handleAdd} onCancel={() => setShowAddModal(false)} title="Nuevo Producto" />}
      {editProduct && <ProductForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={() => setEditProduct(null)} title="Editar Producto" />}

      {showSaved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-lg shadow-xl shadow-emerald-500/30 flex items-center gap-2 text-sm font-semibold z-50">
          <Save className="w-4 h-4" /> Producto actualizado
        </div>
      )}
    </div>
  );
}
