import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, FileText, Phone, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Patient } from '../types';

const emptyPatient = {
  name: '', age: '', dateOfBirth: '', address: '', phone: '',
  reasonForVisit: '', discomforts: '', hasIllness: '', otherInfo: '',
  usesGlasses: false, howFeelsWithGlasses: '', occupation: '',
};

export default function Clientes() {
  const { patients, setPatients } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.occupation.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.phone) return;
    const patient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      ...newPatient,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setPatients([...patients, patient]);
    setNewPatient(emptyPatient);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Gestión de pacientes de la óptica</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/25">
          <Plus className="w-4 h-4" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre, teléfono o oficio..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" />
        </div>
      </div>

      {/* Patient cards */}
      <div className="space-y-3">
        {filtered.map(patient => {
          const isExpanded = expandedCard === patient.id;
          return (
            <div key={patient.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#a855f7]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#7c3aed]">{patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{patient.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{patient.age} años</span>
                      {patient.occupation && <span className="text-[#7c3aed] font-medium">{patient.occupation}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{patient.reasonForVisit}</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button onClick={() => setExpandedCard(isExpanded ? null : patient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? 'Ocultar' : 'Ver más'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-semibold hover:bg-purple-100 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Receta
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div><span className="text-slate-400 font-semibold">Fecha nacimiento:</span> <span className="text-slate-700">{patient.dateOfBirth}</span></div>
                    <div><span className="text-slate-400 font-semibold">Domicilio:</span> <span className="text-slate-700">{patient.address}</span></div>
                    <div><span className="text-slate-400 font-semibold">Utiliza lentes:</span> <span className="text-slate-700">{patient.usesGlasses ? 'Sí' : 'No'}</span></div>
                    {patient.usesGlasses && <div><span className="text-slate-400 font-semibold">Opinión de lentes:</span> <span className="text-slate-700">{patient.howFeelsWithGlasses}</span></div>}
                    <div><span className="text-slate-400 font-semibold">Motivo:</span> <span className="text-slate-700">{patient.reasonForVisit}</span></div>
                    <div><span className="text-slate-400 font-semibold">Molestias:</span> <span className="text-slate-700">{patient.discomforts}</span></div>
                    <div><span className="text-slate-400 font-semibold">Enfermedades:</span> <span className="text-slate-700">{patient.hasIllness}</span></div>
                    {patient.otherInfo && <div><span className="text-slate-400 font-semibold">Otros:</span> <span className="text-slate-700">{patient.otherInfo}</span></div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Edad *</label>
                  <input type="number" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Fecha de nacimiento</label>
                  <input type="date" value={newPatient.dateOfBirth} onChange={e => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Teléfono *</label>
                <input type="tel" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Domicilio</label>
                <input type="text" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Oficio</label>
                <input type="text" value={newPatient.occupation} onChange={e => setNewPatient({ ...newPatient, occupation: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Contadora, Maestro, Estudiante..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Motivo de revisión</label>
                <input type="text" value={newPatient.reasonForVisit} onChange={e => setNewPatient({ ...newPatient, reasonForVisit: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Dolor de cabeza, revisión anual..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Molestias</label>
                <input type="text" value={newPatient.discomforts} onChange={e => setNewPatient({ ...newPatient, discomforts: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Visión borrosa, ojos rojos..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Padece alguna enfermedad</label>
                <input type="text" value={newPatient.hasIllness} onChange={e => setNewPatient({ ...newPatient, hasIllness: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Diabetes, Hipertensión, Ninguna..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Otros</label>
                <input type="text" value={newPatient.otherInfo} onChange={e => setNewPatient({ ...newPatient, otherInfo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Información adicional relevante" />
              </div>
              <div className="flex items-center gap-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Utiliza lentes</label>
                <button type="button" onClick={() => setNewPatient({ ...newPatient, usesGlasses: !newPatient.usesGlasses })}
                  className={`w-12 h-6 rounded-full transition-colors ${newPatient.usesGlasses ? 'bg-[#7c3aed]' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${newPatient.usesGlasses ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs text-slate-500">{newPatient.usesGlasses ? 'Sí' : 'No'}</span>
              </div>
              {newPatient.usesGlasses && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Cómo se siente con sus lentes</label>
                  <input type="text" value={newPatient.howFeelsWithGlasses} onChange={e => setNewPatient({ ...newPatient, howFeelsWithGlasses: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="Ej: Bien, no se siente cómodo, necesita nuevos..." />
                </div>
              )}
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
