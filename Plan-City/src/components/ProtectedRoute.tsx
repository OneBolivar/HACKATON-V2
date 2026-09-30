// Este archivo funciona como un "guard" para rutas protegidas, verificando si el usuario está autenticado y si tiene los roles necesarios para acceder a la ruta solicitada.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface Props {
  allowedRoles?: UserRole[]; // Lista opcional de roles permitidos (ej. ['admin'])
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Si aún está consultando /users/me, mostramos un aviso de carga para evitar redirecciones falsas
  if (isLoading) {
    return (
      <div className="text-center py-20 text-purple-600 font-medium">
        Verificando sesión...
      </div>
    );
  }

  // Si no hay usuario autenticado, enviamos al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si se exigen roles específicos y el usuario no lo tiene (ej. un 'user' intentando entrar a ruta de 'admin'), enviamos al inicio
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Si pasa todas las validaciones, renderiza la vista solicitada
  return <Outlet />;
}