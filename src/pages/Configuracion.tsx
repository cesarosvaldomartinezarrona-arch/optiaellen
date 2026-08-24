import { useState } from 'react';
import { User, Bell, Palette, Shield, Database, Check, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export default function Configuracion() {
  const { opticsName, setOpticsName } = useApp();
  const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Perfil de Usuario');
  const [showSaved, setShowSaved] = useState(false);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ username: '', name: '', role: 'comprador' as UserRole, password: '' });

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
    { icon: Users, label: 'Usuarios' },
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

  const openAddUser = () => {
    setEditingUserId(null);
    setUserForm({ username: '', name: '', role: 'comprador', password: '' });
    setShowUserModal(true);
  };

  const openEditUser = (u: { id: string; username: string; name: string; role: UserRole }) => {
    setEditingUserId(u.id);
    setUserForm({ username: u.username, name: u.name, role: u.role, password: '' });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!userForm.username || !userForm.name) return;
    if (editingUserId) {
      const updateData: Partial<any> = { username: userForm.username, name: userForm.name, role: userForm.role };
      if (userForm.password) updateData.password = userForm.password;
      updateUser(editingUserId, updateData);
    } else {
      if (!userForm.password) return;
      addUser(userForm);
    }
    setShowUserModal(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) return;
    deleteUser(id);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Ajustes generales del sistema</p>
      </div>

      {/* Mobile tab selector */}
      <div className="lg:hidden">
        <button onClick={() => setMobileTabOpen(!mobileTabOpen)}
          className="w-full flex items-center justify-between bg-white rounded-lg border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700">
          <span>{activeTab}</span>
          <svg className={`w-4 h-4 transition-transform ${mobileTabOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {mobileTabOpen && (
          <div className="mt-3 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
            {tabs.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.label} onClick={() => { setActiveTab(item.label); setMobileTabOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all ${activeTab === item.label ? 'bg-purple-50 text-[#7c3aed]' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon className="w-4 h-4" />{item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block space-y-2">
          {tabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button key={item.label} onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25' : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'
                }`}>
                <Icon className="w-5 h-5" />{item.label}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200/80 shadow-sm p-6 sm:p-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 sm:mb-10">{activeTab}</h2>

          {activeTab === 'Perfil de Usuario' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-5 sm:gap-6 mb-8 sm:mb-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <span className="text-xl sm:text-2xl font-bold text-white">AD</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{form.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{form.email}</p>
                  <button className="text-xs text-[#7c3aed] font-bold mt-2 hover:text-[#5b21b6] transition-colors">Cambiar foto</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nombre</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Rol</label>
                  <input type="text" value={form.role} disabled
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-400 cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nombre de la Óptica</label>
                <input type="text" value={form.optica} onChange={e => update('optica', e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Dirección</label>
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>

              <div className="flex justify-end pt-6 sm:pt-8 border-t border-slate-100">
                <button onClick={handleSave}
                  className="px-7 sm:px-8 py-3.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 flex items-center gap-2">
                  {showSaved ? <><Check className="w-4 h-4" /> Guardado</> : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Usuarios' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Gestiona los usuarios y roles del sistema</p>
                <button onClick={openAddUser}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md flex items-center gap-2 hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" /> Nuevo Usuario
                </button>
              </div>

              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${u.role === 'admin' ? 'bg-gradient-to-br from-[#7c3aed] to-[#6d28d9]' : 'bg-slate-200'}`}>
                        <span className="text-sm font-bold text-white">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">@{u.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : u.role === 'optometrista_gerente' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        {u.role === 'admin' ? 'Administrador' : u.role === 'optometrista_gerente' ? 'Optometrista Gerente' : 'Vendedor'}
                      </span>
                      {u.id !== currentUser?.id && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditUser(u)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] text-slate-400 font-medium">Tú</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notificaciones' && (
            <div className="space-y-5 sm:space-y-6">
              {[
                { label: 'Nueva venta registrada', desc: 'Recibir notificación cuando se complete una venta', on: true },
                { label: 'Laboratorio listo', desc: 'Alertar cuando una orden esté lista para entregar', on: true },
                { label: 'Stock bajo', desc: 'Notificar cuando un producto tenga menos de 10 unidades', on: false },
                { label: 'Pago pendiente', desc: 'Recordatorio de pagos pendientes por cobrar', on: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-5 sm:p-6 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${item.on ? 'bg-[#7c3aed]' : 'bg-slate-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.on ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Apariencia' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-sm font-bold text-slate-800 mb-4">Tema de color</p>
                <div className="flex gap-4">
                  {['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706'].map(color => (
                    <button key={color} className="w-11 h-11 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-colors shadow-sm"
                      style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-4">Modo oscuro</p>
                <div className="flex gap-4">
                  <button className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#7c3aed] text-white shadow-md">Claro</button>
                  <button className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border border-slate-200">Oscuro</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Seguridad' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Contraseña Actual</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nueva Contraseña</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Confirmar Contraseña</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button onClick={handleSave}
                  className="px-7 sm:px-8 py-3.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 flex items-center gap-2">
                  {showSaved ? <><Check className="w-4 h-4" /> Actualizada</> : 'Actualizar Contraseña'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Base de Datos' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1.5">Exportar Datos</p>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Descarga una copia de seguridad de todos los datos del sistema.</p>
                <button className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#7c3aed] text-white shadow-md hover:shadow-lg transition-all">Exportar Backup</button>
              </div>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-1.5">Limpiar Caché</p>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Elimina datos temporales almacenados en el navegador.</p>
                <button onClick={handleSave} className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">
                  {showSaved ? '¡Limpiado!' : 'Limpiar Caché'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl border border-slate-200/80">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editingUserId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button onClick={() => setShowUserModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nombre *</label>
                <input type="text" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Usuario *</label>
                <input type="text" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Nombre de usuario" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Rol *</label>
                <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]">
                  <option value="admin">Administrador</option>
                  <option value="optometrista_gerente">Optometrista Gerente</option>
                  <option value="comprador">Vendedor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  {editingUserId ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
                </label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
              <button onClick={() => setShowUserModal(false)} className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">Cancelar</button>
              <button onClick={handleSaveUser} className="px-7 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/30 transition-all">
                {editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-lg shadow-xl shadow-emerald-500/30 flex items-center gap-2 text-sm font-semibold z-50">
          <Check className="w-4 h-4" /> Cambios guardados correctamente
        </div>
      )}
    </div>
  );
}
