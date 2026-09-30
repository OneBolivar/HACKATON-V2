import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Banner de Perfil */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-900/10 overflow-hidden mb-8">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center text-3xl font-black text-white shadow-inner">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name}</h1>
              <span className="px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-purple-900/50 border border-purple-300/30 text-purple-200">
                {user.role}
              </span>
            </div>
            <p className="text-purple-200 text-sm font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Grid de Información y Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Estado de Cuenta</span>
          <p className="text-lg font-bold text-gray-800 mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Activo
          </p>
          <p className="text-xs text-gray-500 mt-2">Acceso verificado a la plataforma</p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Colección</span>
          <p className="text-lg font-bold text-purple-700 mt-1">Favoritos Guardados</p>
          <Link to="/favorites" className="inline-block text-xs font-bold text-purple-600 hover:underline mt-2">
            Ver mis eventos 💜 →
          </Link>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Permisos del Sistema</span>
          <p className="text-lg font-bold text-gray-800 mt-1">
            {user.role === 'admin' ? 'Gestión Total' : 'Asistente'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {user.role === 'admin' ? 'CRUD de eventos y métricas habilitados' : 'Exploración y reserva de actividades'}
          </p>
        </div>
      </div>
    </div>
  );
}