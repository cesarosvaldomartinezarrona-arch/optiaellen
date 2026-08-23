import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, FileText, Phone, Mail, Calendar, X } from 'lucide-react';
import type { Patient } from '../types';

export default function Clientes() {
  const { patients, setPatients } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', dni: '', phone: '', email: '', dateOfBirth: '', address: '' });

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.dni.includes(search) || p.phone.includes(search) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.dni) return;
    const patient: Patient = { id: `P${String(patients.length + 1).padStart(3, '0')}`, ...newPatient, registrationDate: new Date().toISOString().split('T')[0] };
    setPatients([...patients, patient]);
    setNewPatient({ name: '', dni: '', phone: '', email: '', dateOfBirth: '', address: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Gestión de pacientes de la óptica</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
          <Plus className="w-4 h-4" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre, DNI, teléfono..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50/80">
              {['ID', 'Nombre', 'DNI', 'Teléfono', 'Email', 'Registro', 'Acciones'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-[#7c3aed]">{patient.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#a855f7]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#7c3aed]">{patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 font-mono">{patient.dni}</td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Phone className="w-3.5 h-3.5" />{patient.phone}</div></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1.5 text-sm text-slate-500 truncate max-w-[180px]"><Mail className="w-3.5 h-3.5 flex-shrink-0" />{patient.email}</div></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Calendar className="w-3.5 h-3.5" />{patient.registrationDate}</div></td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1.5 text-[#7c3aed] hover:text-[#5b21b6] text-sm font-semibold transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg">
                      <FileText className="w-4 h-4" /> Receta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(patient => (
          <div key={patient.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#a855f7]/10 flex items-center justify-center">
                <span className="text-xs font-bold text-[#7c3aed]">{patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p>
                <p className="text-[11px] text-slate-400">{patient.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{patient.phone}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" />{patient.registrationDate}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">DNI: {patient.dni}</span>
              <button className="flex items-center gap-1.5 text-[#7c3aed] text-xs font-semibold bg-purple-50 px-3 py-1.5 rounded-lg">
                <FileText className="w-3.5 h-3.5" /> Receta
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-slate-900">Nuevo Paciente</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nombre completo *</label>
                <input type="text" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">DNI/Cédula *</label>
                  <input type="text" value={newPatient.dni} onChange={e => setNewPatient({ ...newPatient, dni: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Teléfono</label>
                  <input type="text" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Fecha de Nacimiento</label>
                  <input type="date" value={newPatient.dateOfBirth} onChange={e => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Dirección</label>
                  <input type="text" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 sm:p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleAddPatient} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
