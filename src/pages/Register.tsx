import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Globe, Lock, Eye, EyeOff, Shield, ArrowRight, ChevronDown } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', lada: '52', phone: '',
    subscription: '', country: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const passwordChecks = [
    { label: 'Mínimo 8 caracteres', met: form.password.length >= 8 },
    { label: 'Una mayúscula', met: /[A-Z]/.test(form.password) },
    { label: 'Una minúscula', met: /[a-z]/.test(form.password) },
    { label: 'Un número', met: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[540px]">
        <div className="bg-white rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-lg bg-[#1a1a2e] flex items-center justify-center mb-3 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 25 C30 25 5 85 5 85 C5 85 30 145 100 145 C170 145 195 85 195 85 C195 85 170 25 100 25Z" fill="var(--accent)" />
                <path d="M100 40 C45 40 25 85 25 85 C25 85 45 130 100 130 C155 130 175 85 175 85 C175 85 155 40 100 40Z" fill="white" />
                <circle cx="100" cy="85" r="38" fill="var(--accent)" />
                <circle cx="100" cy="85" r="16" fill="#0f0720" />
                <circle cx="107" cy="78" r="5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">opticællen</span>
          </div>

          {/* Title */}
          <h1 className="text-[26px] font-extrabold text-slate-900 text-center mb-2">Crear cuenta</h1>
          <p className="text-sm text-slate-400 text-center mb-10">Completa el formulario para registrarte</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Section: Datos Personales */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Datos Personales</span>
              </div>

              <div className="space-y-4">
                {/* Nombre + Apellidos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                        placeholder="Juan"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Apellidos</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                        placeholder="García"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      placeholder="correo@empresa.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-8" />

            {/* Section: Contacto */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contacto</span>
              </div>

              <div className="space-y-4">
                {/* Lada + Teléfono */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lada</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type="text" value={form.lada} onChange={e => update('lada', e.target.value)}
                        placeholder="52"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                        placeholder="1234567890"
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-8" />

            {/* Section: Plan y Ubicación */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan y Ubicación</span>
              </div>

              <div className="space-y-4">
                {/* Suscripción */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Suscripción</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                    <select value={form.subscription} onChange={e => update('subscription', e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">Selecciona un plan</option>
                      <option value="basico">Básico — Gratis</option>
                      <option value="profesional">Profesional — $299/mes</option>
                      <option value="empresarial">Empresarial — $599/mes</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* País */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">País</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                    <select value={form.country} onChange={e => update('country', e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">Busca un país</option>
                      <option value="MX">México</option>
                      <option value="US">Estados Unidos</option>
                      <option value="GT">Guatemala</option>
                      <option value="CO">Colombia</option>
                      <option value="AR">Argentina</option>
                      <option value="ES">España</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-8" />

            {/* Section: Seguridad */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seguridad</span>
              </div>

              <div className="space-y-4">
                {/* Contraseña + Confirmar */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirmar</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300" />
                      <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3.5 bg-[#f5f5f5] rounded-lg border border-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                        {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password requirements */}
                {form.password.length > 0 && (
                  <div className="bg-[#f9f9f9] rounded-lg p-4 border border-slate-100">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      {passwordChecks.map(check => (
                        <div key={check.label} className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${check.met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={`text-[11px] font-medium transition-colors ${check.met ? 'text-emerald-600' : 'text-slate-400'}`}>{check.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-[#f5c542] hover:bg-[#e6b835] disabled:opacity-50 text-slate-800 font-bold py-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 text-[15px] flex items-center justify-center gap-2.5">
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-800/30 border-t-slate-800 rounded-full animate-spin" />
              ) : (
                <>Crear cuenta <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:text-[#6b21a8] font-semibold transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 opticællen. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
