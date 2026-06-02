import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User as UserIcon, Lock, Coffee } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    try {
      await login({ username, password });
    } catch {
      // El error ya lo maneja el toast en el context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-outfit select-none">
      {/* Círculos de Luces Ambientales (Efecto Neon) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="w-full max-w-md p-2 z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Contenedor Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">

          {/* Cabecera */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 animate-bounce duration-1000">
              <Coffee className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Tienda <span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Uniremington</span>
            </h1>
            <p className="text-sm text-slate-400">
              Ingresa tus credenciales para acceder al sistema
            </p>

            <p>Group </p>
            <p>Vanessa Benitez</p>
            <p>Jhonier Chica</p>
            <p>Santiago Anaya</p>
          </div>


          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Usuario */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 focus:border-blue-500/50 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 focus:border-blue-500/50 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/60 px-3 text-slate-500 backdrop-blur-xl">
                Acceso de Prueba Rápido
              </span>
            </div>
          </div>

          {/* Badges de Roles Demo */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="py-2.5 px-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer text-center flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Admin</span>
              <span className="text-[10px] text-slate-500 block truncate max-w-full">admin / admin123</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('cajero', 'cajero123')}
              className="py-2.5 px-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer text-center flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Cajero</span>
              <span className="text-[10px] text-slate-500 block truncate max-w-full">cajero / cajero123</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('mesero', 'mesero123')}
              className="py-2.5 px-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer text-center flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Mesero</span>
              <span className="text-[10px] text-slate-500 block truncate max-w-full">mesero / mesero123</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
