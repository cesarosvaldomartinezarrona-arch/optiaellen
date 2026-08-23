import { useState } from 'react';
import { User, Bell, Palette, Shield, Database, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Configuracion() {
  const { opticsName, setOpticsName } = useApp();
  const [activeTab, setActiveTab] = useState('Perfil de Usuario');
  const [showSaved, setShowSaved] = useState(false);

  const [form, setForm] = useState({
    name: 'Administrador',
    email: 'admin@optiaellen.com',
    phone: '+52 55 1234 5678',
    role: 'Administrador General',
    optica: opticsName,
    address: 'Av. Principal 123, Centro, CDMX',
  });

  const tabs = [
    { icon: User, label: 'Perfil de Usuario' },
    { icon: Bell, label: 'Notificaciones' },
    { icon: Palette, label: 'Apariencia' },
    { icon: Shield, label: 'Seguridad' },
    { icon: Database, label: 'Base de Datos' },
  ];

  const handleSave = () => {
    setOpticsName(form.optica);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Ajustes generales del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu lateral */}
        <div className="space-y-1.5">
          {tabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button key={item.label} onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'
                }`}>
                <Icon className="w-5 h-5" />{item.label}
              </button>
            );
          })}
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8">{activeTab}</h2>

          {activeTab === 'Perfil de Usuario' && (
            <div className="space-y-6">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <span className="text-2xl font-bold text-white">AD</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{form.name}</h3>
                  <p className="text-sm text-slate-500">{form.email}</p>
                  <button className="text-xs text-[#7c3aed] font-bold mt-1 hover:text-[#5b21b6] transition-colors">Cambiar foto</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nombre</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Rol</label>
                  <input type="text" value={form.role} disabled
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-400 cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nombre de la Óptica</label>
                <input type="text" value={form.optica} onChange={e => update('optica', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Dirección</label>
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button onClick={handleSave}
                  className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  {showSaved ? <><Check className="w-4 h-4" /> Guardado</> : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notificaciones' && (
            <div className="space-y-5">
              {[
                { label: 'Nueva venta registrada', desc: 'Recibir notificación cuando se complete una venta', on: true },
                { label: 'Laboratorio listo', desc: 'Alertar cuando una orden esté lista para entregar', on: true },
                { label: 'Stock bajo', desc: 'Notificar cuando un producto tenga menos de 10 unidades', on: false },
                { label: 'Pago pendiente', desc: 'Recordatorio de pagos pendientes por cobrar', on: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${item.on ? 'bg-[#7c3aed]' : 'bg-slate-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.on ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Apariencia' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-800 mb-3">Tema de color</p>
                <div className="flex gap-3">
                  {['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706'].map(color => (
                    <button key={color} className="w-10 h-10 rounded-xl border-2 border-slate-200 hover:border-slate-400 transition-colors shadow-sm"
                      style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-3">Modo oscuro</p>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7c3aed] text-white shadow-md">Claro</button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border border-slate-200">Oscuro</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Seguridad' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Contraseña Actual</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nueva Contraseña</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Confirmar Contraseña</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button onClick={handleSave}
                  className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  {showSaved ? <><Check className="w-4 h-4" /> Actualizada</> : 'Actualizar Contraseña'}
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'Base de Datos') && (
            <div className="space-y-5">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1">Exportar Datos</p>
                <p className="text-xs text-slate-400 mb-3">Descarga una copia de seguridad de todos los datos del sistema.</p>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7c3aed] text-white shadow-md hover:shadow-lg transition-all">Exportar Backup</button>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1">Limpiar Caché</p>
                <p className="text-xs text-slate-400 mb-3">Elimina datos temporales almacenados en el navegador.</p>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">
                  {showSaved ? '¡Limpiado!' : 'Limpiar Caché'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notificación de éxito */}
      {showSaved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl shadow-emerald-500/30 flex items-center gap-2 text-sm font-semibold z-50 animate-in slide-in-from-bottom-4">
          <Check className="w-4 h-4" /> Cambios guardados correctamente
        </div>
      )}
    </div>
  );
}
