import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, ShoppingCart, Plus, Minus, Trash2, Tag, Grid3X3, X } from 'lucide-react';
import type { ProductCategory } from '../types';

const categories: ProductCategory[] = ['Monturas', 'Lentes de Contacto', 'Cristales', 'Accesorios'];

export default function Ventas() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Todos' || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const subtotal = cartTotal();
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Punto de Venta</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Selecciona productos y procesa ventas</p>
      </div>

      <div className="flex gap-4 sm:gap-6 min-h-[calc(100vh-180px)]">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all shadow-sm" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {['Todos', ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(product => (
              <div key={product.id} className="bg-white rounded-lg border border-slate-200/80 p-3 sm:p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                onClick={() => addToCart(product)}>
                <div className="w-full h-20 sm:h-28 bg-gradient-to-br from-purple-50 to-slate-50 rounded-lg flex items-center justify-center mb-2 sm:mb-3 border border-slate-100 group-hover:border-purple-200 transition-colors">
                  <Grid3X3 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-200 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{product.name}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">{product.model}</p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <span className="text-base sm:text-lg font-extrabold text-[#7c3aed]">${product.price.toLocaleString()}</span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${product.stock < 10 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-500 px-1.5 sm:px-2 py-0.5 rounded-md font-medium">{product.category}</span>
                  {product.brand && <span className="text-[9px] sm:text-[10px] bg-purple-50 text-[#7c3aed] px-1.5 sm:px-2 py-0.5 rounded-md font-medium">{product.brand}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop cart */}
        <div className="hidden lg:flex w-[320px] xl:w-[360px] flex-shrink-0 bg-white rounded-lg border border-slate-200/80 shadow-sm flex-col sticky top-20 h-fit max-h-[calc(100vh-120px)]">
          <CartContent cart={cart} subtotal={subtotal} iva={iva} total={total} onNavigate={navigate} onClear={clearCart} onRemove={removeFromCart} onUpdateQty={updateCartQuantity} />
        </div>
      </div>

      {/* Mobile cart button */}
      {cart.length > 0 && (
        <button
          onClick={() => setMobileCartOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white px-5 py-3 rounded-full shadow-xl shadow-purple-500/30 flex items-center gap-2 font-bold text-sm"
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length} · ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </button>
      )}

      {/* Mobile cart drawer */}
      {mobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Carrito ({cart.length})</h3>
              <button onClick={() => setMobileCartOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <CartContent cart={cart} subtotal={subtotal} iva={iva} total={total} onNavigate={(path) => { setMobileCartOpen(false); navigate(path); }} onClear={clearCart} onRemove={removeFromCart} onUpdateQty={updateCartQuantity} />
          </div>
        </div>
      )}
    </div>
  );
}

function CartContent({ cart, subtotal, iva, total, onNavigate, onClear, onRemove, onUpdateQty }: {
  cart: any[]; subtotal: number; iva: number; total: number; onNavigate: (path: string) => void; onClear: () => void; onRemove: (id: string) => void; onUpdateQty: (id: string, qty: number) => void;
}) {
  return (
    <>
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-md shadow-purple-500/25">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Carrito</h3>
            <p className="text-xs text-slate-400">{cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-[150px]">
        {cart.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Carrito vacío</p>
            <p className="text-xs text-slate-300 mt-1">Haz clic en un producto</p>
          </div>
        ) : cart.map(item => (
          <div key={item.product.id} className="bg-slate-50 rounded-lg p-3 flex gap-3 border border-slate-100">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{item.product.name}</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{item.product.model}</p>
              <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); onUpdateQty(item.product.id, item.quantity - 1); }}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                    <Minus className="w-3 h-3 text-slate-500" />
                  </button>
                  <span className="text-xs sm:text-sm font-bold w-6 sm:w-7 text-center text-slate-800">{item.quantity}</span>
                  <button onClick={(e) => { e.stopPropagation(); onUpdateQty(item.product.id, item.quantity + 1); }}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                    <Plus className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#7c3aed]">${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onRemove(item.product.id); }}
              className="text-slate-300 hover:text-red-500 transition-colors self-start mt-1 p-1 rounded-lg hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="p-4 sm:p-5 border-t border-slate-100 space-y-3 bg-slate-50/50 rounded-b-2xl">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-700">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">IVA (16%)</span><span className="font-semibold text-slate-700">${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
          <div className="flex justify-between text-lg font-extrabold border-t border-slate-200 pt-3"><span className="text-slate-900">Total</span><span className="text-[#7c3aed]">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
          <button onClick={() => onNavigate('/cobrar')} className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3 sm:py-3.5 rounded-lg font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
            Ir a Cobrar
          </button>
          <button onClick={onClear} className="w-full text-red-500 py-2 rounded-lg font-medium text-xs hover:bg-red-50 transition-colors">
            Vaciar Carrito
          </button>
        </div>
      )}
    </>
  );
}
