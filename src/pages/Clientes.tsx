import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, FileText, Phone, Calendar, X, ChevronDown, ChevronUp, User, MapPin, Briefcase, ClipboardList, Eye } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Gestión de pacientes de la óptica</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/30 hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre, teléfono o oficio..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" />
        </div>
      </div>

      {/* Patient cards */}
      <div className="space-y-5">
        {filtered.map(patient => {
          const isExpanded = expandedCard === patient.id;
          return (
            <div key={patient.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed]/15 to-[#a855f7]/10 flex items-center justify-center flex-shrink-0 border border-purple-100/50">
                    <span className="text-sm font-bold text-[#7c3aed]">{patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{patient.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{patient.phone}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{patient.age} años</span>
                      {patient.occupation && <span className="text-[#7c3aed] font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">{patient.occupation}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 truncate">{patient.reasonForVisit}</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                  <button onClick={() => setExpandedCard(isExpanded ? null : patient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-100">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? 'Ocultar' : 'Ver más'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-purple-50 text-[#7c3aed] text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-100">
                    <FileText className="w-3.5 h-3.5" /> Receta
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-5 border-t border-slate-100 bg-[#f8f7ff]/60 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Fecha nacimiento</span> <span className="text-slate-700 font-medium">{patient.dateOfBirth || '—'}</span></div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Domicilio</span> <span className="text-slate-700 font-medium">{patient.address || '—'}</span></div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Utiliza lentes</span> <span className="text-slate-700 font-medium">{patient.usesGlasses ? 'Sí' : 'No'}</span></div>
                    {patient.usesGlasses && <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Opinión de lentes</span> <span className="text-slate-700 font-medium">{patient.howFeelsWithGlasses || '—'}</span></div>}
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Motivo</span> <span className="text-slate-700 font-medium">{patient.reasonForVisit || '—'}</span></div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Molestias</span> <span className="text-slate-700 font-medium">{patient.discomforts || '—'}</span></div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Enfermedades</span> <span className="text-slate-700 font-medium">{patient.hasIllness || '—'}</span></div>
                    {patient.otherInfo && <div className="bg-white rounded-xl p-3 border border-slate-100"><span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-1">Otros</span> <span className="text-slate-700 font-medium">{patient.otherInfo}</span></div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nuevo Paciente</h2>
                <p className="text-xs text-slate-400 mt-1">Complete la información del paciente</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Datos Personales */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/20 flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Datos Personales</h3>
                  <div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Nombre completo *</label>
                  <input type="text" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: María González" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Edad *</label>
                    <input type="number" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Fecha de nacimiento</label>
                    <input type="date" value={newPatient.dateOfBirth} onChange={e => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" />
                  </div>
                </div>
              </div>

              {/* Contacto y Ubicación */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/20 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Contacto y Ubicación</h3>
                  <div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Teléfono *</label>
                  <input type="tel" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: 55 1234 5678" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Domicilio</label>
                  <input type="text" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Calle, número, colonia..." />
                </div>
              </div>

              {/* Información Profesional */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/20 flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Información Profesional</h3>
                  <div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Oficio</label>
                  <input type="text" value={newPatient.occupation} onChange={e => setNewPatient({ ...newPatient, occupation: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: Contadora, Maestro, Estudiante..." />
                </div>
              </div>

              {/* Detalle de Consulta */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/20 flex-shrink-0">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Detalle de Consulta</h3>
                  <div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Motivo de revisión</label>
                  <input type="text" value={newPatient.reasonForVisit} onChange={e => setNewPatient({ ...newPatient, reasonForVisit: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: Dolor de cabeza, revisión anual..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Molestias</label>
                  <input type="text" value={newPatient.discomforts} onChange={e => setNewPatient({ ...newPatient, discomforts: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: Visión borrosa, ojos rojos..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Padece alguna enfermedad</label>
                  <input type="text" value={newPatient.hasIllness} onChange={e => setNewPatient({ ...newPatient, hasIllness: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: Diabetes, Hipertensión, Ninguna..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Otros</label>
                  <input type="text" value={newPatient.otherInfo} onChange={e => setNewPatient({ ...newPatient, otherInfo: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Información adicional relevante" />
                </div>
              </div>

              {/* Lentes */}
              <div className="space-y-6 bg-[#f8f7ff] rounded-2xl p-6 sm:p-8 border border-purple-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/20 flex-shrink-0">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Lentes</h3>
                  <div className="flex-1 h-px bg-purple-100 ml-2" />
                </div>
                <div className="flex items-center gap-6 bg-white rounded-2xl p-4 border border-slate-200/60">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider flex-1">Utiliza lentes</label>
                  <button type="button" onClick={() => setNewPatient({ ...newPatient, usesGlasses: !newPatient.usesGlasses })}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${newPatient.usesGlasses ? 'bg-[#7c3aed]' : 'bg-slate-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${newPatient.usesGlasses ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-sm font-semibold min-w-[28px] ${newPatient.usesGlasses ? 'text-[#7c3aed]' : 'text-slate-400'}`}>{newPatient.usesGlasses ? 'Sí' : 'No'}</span>
                </div>
                {newPatient.usesGlasses && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Cómo se siente con sus lentes</label>
                    <input type="text" value={newPatient.howFeelsWithGlasses} onChange={e => setNewPatient({ ...newPatient, howFeelsWithGlasses: e.target.value })} className="w-full px-4 py-3.5 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" placeholder="Ej: Bien, no se siente cómodo, necesita nuevos..." />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-2xl text-sm font-medium text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">Cancelar</button>
              <button onClick={handleAddPatient} className="px-8 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
