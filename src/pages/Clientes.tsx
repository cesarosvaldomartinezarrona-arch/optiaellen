import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, FileText, Phone, Calendar, X, ChevronDown, ChevronUp, User, MapPin, Briefcase, ClipboardList, Eye, Mail, MessageCircle, History, TrendingUp, Stethoscope, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { Patient, Prescription } from '../types';

const emptyPatient = {
  name: '', age: '', dateOfBirth: '', address: '', phone: '', email: '',
  reasonForVisit: '', discomforts: '', hasIllness: '', otherInfo: '',
  usesGlasses: false, howFeelsWithGlasses: '', occupation: '', biography: '',
};

export default function Clientes() {
  const { patients, setPatients, prescriptions } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [bioPatient, setBioPatient] = useState<Patient | null>(null);
  const [bioTab, setBioTab] = useState<'bio' | 'recetas' | 'evolucion'>('bio');
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForPatient, setExamForPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.email.toLowerCase().includes(search.toLowerCase()) || p.occupation.toLowerCase().includes(search.toLowerCase())
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

  const getPatientPrescriptions = (patientId: string) => prescriptions.filter(r => r.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const getLastVisit = (patientId: string, regDate: string) => {
    const rxs = getPatientPrescriptions(patientId);
    if (rxs.length > 0) return rxs[0].date;
    return regDate;
  };
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const monthsSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    if (months === 0) return 'Este mes';
    if (months === 1) return 'Hace 1 mes';
    if (months < 12) return `Hace ${months} meses`;
    const years = Math.floor(months / 12);
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  };

  const openBio = (p: Patient, tab: 'bio' | 'recetas' | 'evolucion' = 'bio') => {
    setBioPatient(p);
    setBioTab(tab);
  };

  const openExam = (p: Patient) => {
    setExamForPatient(p);
    setShowExamModal(true);
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Gestión de pacientes — biografía, última visita, recetas y evolución</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/30 hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/70 p-4 sm:p-5 shadow-sm">
        <div className="relative flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Buscar por nombre, teléfono, email u oficio..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-slate-400" />
        </div>
      </div>

      {/* Patient cards */}
      <div className="space-y-4">
        {filtered.map(patient => {
          const isExpanded = expandedCard === patient.id;
          const rxs = getPatientPrescriptions(patient.id);
          const lastVisit = getLastVisit(patient.id, patient.registrationDate);
          const totalRecetas = rxs.length;
          return (
            <div key={patient.id} className="bg-white rounded-lg border border-slate-200/70 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7c3aed]/15 to-[#a855f7]/10 flex items-center justify-center shrink-0 border border-purple-100/50">
                    <span className="text-sm font-bold text-[#7c3aed]">{patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 truncate">{patient.name}</p>
                      <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">{patient.id}</span>
                      <span className="text-xs bg-purple-50 text-[#7c3aed] border border-purple-100 px-2.5 py-0.5 rounded-full font-medium">{patient.occupation || '—'}</span>
                      <span className="text-[11px] text-slate-400">{patient.age} años</span>
                      <span className="text-[11px] text-slate-400">{totalRecetas} receta{totalRecetas !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{patient.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(lastVisit)}</span>
                      <span className="text-slate-400">{monthsSince(lastVisit)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openBio(patient, 'bio')} className="w-9 h-9 rounded-lg bg-[#0f0a1f] text-white hover:bg-[#1a1033] flex items-center justify-center transition-colors" title="Biografía">
                      <User className="w-4 h-4" />
                    </button>
                    <button onClick={() => openExam(patient)} className="w-9 h-9 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] flex items-center justify-center transition-colors" title="Nuevo Examen">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a href={`https://wa.me/${cleanPhone(patient.phone)}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors" title="WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${patient.email}`} className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors" title="Correo">
                      <Mail className="w-4 h-4" />
                    </a>
                    <button onClick={() => setExpandedCard(isExpanded ? null : patient.id)} className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors" title="Resumen">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openBio(patient, 'recetas')} className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200 flex items-center justify-center transition-colors" title={`${totalRecetas} Recetas`}>
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-[#f8f7ff]/50 -mx-4 sm:-mx-5 px-4 sm:px-5 pb-4 rounded-b-lg space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biografía rápida</p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">{patient.biography || 'Sin biografía registrada.'}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold block">Motivo</span><span className="text-slate-700 font-medium">{patient.reasonForVisit || '—'}</span></div>
                      <div className="bg-white p-3 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold block">Molestias</span><span className="text-slate-700 font-medium">{patient.discomforts || '—'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Biografía completa modal */}
      {bioPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#f8f7ff] rounded-lg w-full max-w-5xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-hidden flex flex-col">
            <div className="bg-white px-6 sm:px-8 py-6 border-b border-slate-200 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center text-white font-bold shadow shrink-0">{bioPatient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 truncate">{bioPatient.name}</h2>
                    <p className="text-xs text-slate-500">{bioPatient.occupation} • {bioPatient.age} años • {bioPatient.id}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full"><Phone className="w-3 h-3" />{bioPatient.phone}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full"><Mail className="w-3 h-3" />{bioPatient.email}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full font-medium"><Clock className="w-3 h-3" />Última visita: {formatDate(getLastVisit(bioPatient.id, bioPatient.registrationDate))}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setBioPatient(null)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center shrink-0"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <a href={`mailto:${bioPatient.email}?subject=Seguimiento opticællen - ${bioPatient.name}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Mail className="w-4 h-4" /> Mandar correo</a>
                <a href={`https://wa.me/${cleanPhone(bioPatient.phone)}?text=Hola ${bioPatient.name}, te escribe opticællen`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <button onClick={() => openExam(bioPatient)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold"><Eye className="w-4 h-4" /> Nuevo examen (parámetros)</button>
              </div>
              <div className="flex gap-1 mt-6 bg-slate-100 p-1 rounded-lg w-fit">
                {(['bio', 'recetas', 'evolucion'] as const).map(t => (
                  <button key={t} onClick={() => setBioTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${bioTab === t ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>{t === 'bio' ? 'Biografía' : t === 'recetas' ? `Recetas (${getPatientPrescriptions(bioPatient.id).length})` : 'Evolución anual'}</button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {bioTab === 'bio' && (
                <>
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-[#7c3aed]" /> Biografía del paciente</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{bioPatient.biography || 'Sin biografía.'}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha nacimiento</p><p className="text-sm font-semibold text-slate-800 mt-1">{bioPatient.dateOfBirth || '—'}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Domicilio</p><p className="text-sm font-semibold text-slate-800 mt-1">{bioPatient.address || '—'}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ocupación</p><p className="text-sm font-semibold text-slate-800 mt-1">{bioPatient.occupation}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registro</p><p className="text-sm font-semibold text-slate-800 mt-1">{formatDate(bioPatient.registrationDate)} • {monthsSince(bioPatient.registrationDate)}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Última visita</p><p className="text-sm font-bold text-[#7c3aed] mt-1">{formatDate(getLastVisit(bioPatient.id, bioPatient.registrationDate))} • {monthsSince(getLastVisit(bioPatient.id, bioPatient.registrationDate))}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motivo / Molestias</p><p className="text-sm font-medium text-slate-700 mt-1">{bioPatient.reasonForVisit} — {bioPatient.discomforts}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enfermedades</p><p className="text-sm font-medium text-slate-700 mt-1">{bioPatient.hasIllness}</p></div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lentes</p><p className="text-sm font-medium text-slate-700 mt-1">{bioPatient.usesGlasses ? `Sí — ${bioPatient.howFeelsWithGlasses}` : 'No usa'}</p></div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div><p className="text-sm font-bold text-amber-900">Recordatorio</p><p className="text-xs text-amber-700 mt-1">Si la última visita fue hace más de 12 meses, sugerir control anual. Enviar WhatsApp o correo para agendar.</p></div>
                  </div>
                </>
              )}

              {bioTab === 'recetas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-[#7c3aed]" /> Recetas de {bioPatient.name}</h3>
                    <button onClick={() => openExam(bioPatient)} className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Nuevo examen</button>
                  </div>
                  {getPatientPrescriptions(bioPatient.id).length === 0 ? (
                    <div className="bg-white rounded-lg border border-dashed border-slate-200 p-10 text-center"><FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-sm font-medium text-slate-500">Sin recetas registradas</p><p className="text-xs text-slate-400 mt-1">Registra el primer examen con los parámetros: Esfera, Cilindro, Eje, Prisma, Adición</p></div>
                  ) : (
                    <div className="grid gap-4">
                      {getPatientPrescriptions(bioPatient.id).map(rx => (
                        <div key={rx.id} className="bg-white rounded-lg border border-slate-200 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold text-[#7c3aed]">{rx.id} • {rx.date} • {rx.doctor}</p>
                              <p className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-bold border ${rx.status === 'Vigente' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : rx.status === 'Vencida' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{rx.status}</p>
                            </div>
                            <span className="text-xs text-slate-400">{rx.recommendations}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-[#fafaf8] rounded-lg border border-slate-200 p-4">
                              <p className="text-xs font-bold text-[#1e3a6e] border-b border-slate-200 pb-2 mb-3">OD — Ojo Derecho</p>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div><span className="text-slate-500 font-semibold">Esfera</span><p className="font-bold text-slate-900">{rx.rightEye.sph}</p></div>
                                <div><span className="text-slate-500 font-semibold">Cilindro</span><p className="font-bold text-slate-900">{rx.rightEye.cyl}</p></div>
                                <div><span className="text-slate-500 font-semibold">Eje</span><p className="font-bold text-slate-900">{rx.rightEye.axis}</p></div>
                                <div><span className="text-slate-500 font-semibold">Prisma</span><p className="font-bold text-slate-900">{rx.rightEye.prisma}</p></div>
                                <div className="col-span-2"><span className="text-slate-500 font-semibold">Adición</span><p className="font-bold text-slate-900">{rx.rightEye.add}</p></div>
                              </div>
                            </div>
                            <div className="bg-[#fafaf8] rounded-lg border border-slate-200 p-4">
                              <p className="text-xs font-bold text-[#1e3a6e] border-b border-slate-200 pb-2 mb-3">OI — Ojo Izquierdo</p>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div><span className="text-slate-500 font-semibold">Esfera</span><p className="font-bold text-slate-900">{rx.leftEye.sph}</p></div>
                                <div><span className="text-slate-500 font-semibold">Cilindro</span><p className="font-bold text-slate-900">{rx.leftEye.cyl}</p></div>
                                <div><span className="text-slate-500 font-semibold">Eje</span><p className="font-bold text-slate-900">{rx.leftEye.axis}</p></div>
                                <div><span className="text-slate-500 font-semibold">Prisma</span><p className="font-bold text-slate-900">{rx.leftEye.prisma}</p></div>
                                <div className="col-span-2"><span className="text-slate-500 font-semibold">Adición</span><p className="font-bold text-slate-900">{rx.leftEye.add}</p></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-3">Obs: {rx.observations}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bioTab === 'evolucion' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#7c3aed]" /> Variación de graduación anual — Esfera (SPH)</h3>
                    <p className="text-xs text-slate-500 mt-1">Evolución de la miopía/hipermetropía por año. Valores más negativos = mayor miopía.</p>
                    {(() => {
                      const rxs = [...getPatientPrescriptions(bioPatient.id)].sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
                      if (rxs.length < 2) return <div className="py-10 text-center text-sm text-slate-400">Se necesitan al menos 2 recetas para mostrar evolución. Registra un nuevo examen.</div>;
                      const data = rxs.map(r => ({
                        fecha: r.date.slice(0,4),
                        OD: parseFloat(r.rightEye.sph) || 0,
                        OI: parseFloat(r.leftEye.sph) || 0,
                      }));
                      return (
                        <div className="mt-6 h-[260px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={40} />
                              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                              <Legend />
                              <Line type="monotone" dataKey="OD" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} name="OD Esfera" />
                              <Line type="monotone" dataKey="OI" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} name="OI Esfera" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100"><h4 className="text-sm font-bold text-slate-900">Historial anual — detalle</h4></div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="text-left px-4 py-3 font-bold text-slate-500 uppercase">Fecha</th><th className="text-left px-4 py-3 font-bold text-slate-500 uppercase">OD (Esf/Cil/Eje/Prisma/Add)</th><th className="text-left px-4 py-3 font-bold text-slate-500 uppercase">OI (Esf/Cil/Eje/Prisma/Add)</th><th className="text-left px-4 py-3 font-bold text-slate-500 uppercase">Var. anual OD</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {(() => {
                            const rxs = [...getPatientPrescriptions(bioPatient.id)].sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
                            return rxs.map((rx, idx) => {
                              const prev = rxs[idx + 1];
                              const diff = prev ? ((parseFloat(rx.rightEye.sph) - parseFloat(prev.rightEye.sph))).toFixed(2) : '—';
                              const diffColor = diff !== '—' && parseFloat(diff) < 0 ? 'text-red-600' : diff !== '—' && parseFloat(diff) > 0 ? 'text-emerald-600' : 'text-slate-500';
                              return (
                                <tr key={rx.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3 font-semibold text-slate-700">{rx.date}</td>
                                  <td className="px-4 py-3 font-mono text-slate-700">{rx.rightEye.sph} / {rx.rightEye.cyl} / {rx.rightEye.axis}° / {rx.rightEye.prisma} / {rx.rightEye.add}</td>
                                  <td className="px-4 py-3 font-mono text-slate-700">{rx.leftEye.sph} / {rx.leftEye.cyl} / {rx.leftEye.axis}° / {rx.leftEye.prisma} / {rx.leftEye.add}</td>
                                  <td className={`px-4 py-3 font-bold ${diffColor}`}>{diff !== '—' ? `${parseFloat(diff) > 0 ? '+' : ''}${diff}` : '—'}</td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nuevo examen rápido desde paciente */}
      {showExamModal && examForPatient && (
        <QuickExamModal patient={examForPatient} onClose={() => setShowExamModal(false)} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nuevo Paciente</h2>
                <p className="text-xs text-slate-400 mt-1">Complete la información del paciente</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm"><User className="w-4 h-4 text-white" /></div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Datos Personales</h3><div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Nombre completo *</label>
                  <input type="text" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Ej: María González" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Edad *</label>
                    <input type="number" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" placeholder="30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Fecha de nacimiento</label>
                    <input type="date" value={newPatient.dateOfBirth} onChange={e => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Biografía breve</label>
                  <textarea value={newPatient.biography} onChange={e => setNewPatient({ ...newPatient, biography: e.target.value })} rows={2} placeholder="Antecedentes, historial relevante..." className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] resize-none placeholder:text-slate-400" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm"><MapPin className="w-4 h-4 text-white" /></div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Contacto y Ubicación</h3><div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Teléfono *</label>
                    <input type="tel" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="55 1234 5678" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Correo *</label>
                    <input type="email" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="correo@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Domicilio</label>
                  <input type="text" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Calle, número, colonia..." />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm"><Briefcase className="w-4 h-4 text-white" /></div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Información Profesional</h3><div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Oficio</label>
                  <input type="text" value={newPatient.occupation} onChange={e => setNewPatient({ ...newPatient, occupation: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Ej: Contadora, Maestro..." />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm"><ClipboardList className="w-4 h-4 text-white" /></div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Detalle de Consulta</h3><div className="flex-1 h-px bg-slate-100 ml-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Motivo de revisión</label>
                  <input type="text" value={newPatient.reasonForVisit} onChange={e => setNewPatient({ ...newPatient, reasonForVisit: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Ej: Dolor de cabeza..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Molestias</label>
                  <input type="text" value={newPatient.discomforts} onChange={e => setNewPatient({ ...newPatient, discomforts: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Ej: Visión borrosa..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Padece alguna enfermedad</label>
                  <input type="text" value={newPatient.hasIllness} onChange={e => setNewPatient({ ...newPatient, hasIllness: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] placeholder:text-slate-400" placeholder="Ej: Diabetes, Ninguna..." />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-white border border-transparent hover:border-slate-200">Cancelar</button>
              <button onClick={handleAddPatient} className="px-8 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickExamModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const { prescriptions, setPrescriptions } = useApp();
  const [rightEye, setRightEye] = useState({ sph: '', cyl: '', axis: '', prisma: '', add: '' });
  const [leftEye, setLeftEye] = useState({ sph: '', cyl: '', axis: '', prisma: '', add: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!rightEye.sph && !leftEye.sph) return;
    setSaving(true);
    const rx: Prescription = {
      id: `R${String(prescriptions.length + 1).padStart(3, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Elena Ruiz',
      status: 'Vigente',
      rightEye: { ...rightEye, dp: '32', av: '20/20' },
      leftEye: { ...leftEye, dp: '32', av: '20/20' },
      recommendations: 'Examen registrado desde ficha del paciente',
      observations: '',
      totalLenses: 0, totalTreatments: 0, grandTotal: 0,
    };
    setPrescriptions([...prescriptions, rx]);
    setTimeout(() => { setSaving(false); onClose(); }, 500);
  };

  const EyeInputs = ({ label, data, setData }: { label: string; data: any; setData: (d: any) => void }) => (
    <div className="bg-[#fafaf8] rounded-lg border border-slate-200 p-5">
      <p className="text-sm font-bold text-[#1e3a6e] border-b border-slate-200 pb-2 mb-4">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-bold text-slate-600 mb-1">Esfera (SPH)</label><input value={data.sph} onChange={e => setData({ ...data, sph: e.target.value })} placeholder="+0.00" className="w-full px-3 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
        <div><label className="block text-xs font-bold text-slate-600 mb-1">Cilindro (CYL)</label><input value={data.cyl} onChange={e => setData({ ...data, cyl: e.target.value })} placeholder="-0.00" className="w-full px-3 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
        <div><label className="block text-xs font-bold text-slate-600 mb-1">Eje (AXIS)</label><input value={data.axis} onChange={e => setData({ ...data, axis: e.target.value })} placeholder="0 - 180" className="w-full px-3 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
        <div><label className="block text-xs font-bold text-slate-600 mb-1">Prisma</label><input value={data.prisma} onChange={e => setData({ ...data, prisma: e.target.value })} placeholder="0.00" className="w-full px-3 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
        <div className="col-span-2"><label className="block text-xs font-bold text-slate-600 mb-1">Adición (ADD)</label><input value={data.add} onChange={e => setData({ ...data, add: e.target.value })} placeholder="+0.00" className="w-full px-3 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" /></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Eye className="w-5 h-5 text-[#7c3aed]" /> Parámetros del examen — {patient.name}</h2>
            <p className="text-xs text-slate-500 mt-1">Refracción Final (OD / OI) — Esfera, Cilindro, Eje, Prisma, Adición</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-[#f1f0ff] border border-violet-200 rounded-lg p-4 flex gap-3">
            <History className="w-5 h-5 text-[#7c3aed] shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">Registra aquí los <b>parámetros del examen de la vista</b>. Quedarán guardados en la biografía del paciente, en sus recetas y en la evolución anual de graduación.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <EyeInputs label="Refracción Final (OD)" data={rightEye} setData={setRightEye} />
            <EyeInputs label="Refracción Final (OI)" data={leftEye} setData={setLeftEye} />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 flex items-center gap-2">
            {saving ? 'Guardando...' : 'Guardar examen'}
          </button>
        </div>
      </div>
    </div>
  );
}
