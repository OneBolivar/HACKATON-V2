/**
 * 1. Rutas Públicas (Eventos, Categorías, Login, Registro).
 * 2. Rutas Protegidas por Autenticación (Favoritos).
 * 3. Rutas Protegidas por Rol (Creación/Edición de Eventos y Categorías exclusiva para 'admin').
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventFormPage } from './pages/EventFormPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage'


export function AppRouter() {
  return (
    <Routes>
      {/* 1. RUTAS PÚBLICAS: Accesibles por cualquier usuario (visitante o logueado) */}
      <Route path="/" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:id" element={<CategoryDetailPage />} />

      {/* 2. AUTENTICACIÓN */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 3. RUTAS PROTEGIDAS: Requieren autenticación (cualquier rol) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 4. RUTAS PROTEGIDAS POR ROL: Requieren obligatoriamente rol 'admin' */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
        <Route path="/categories/new" element={<CategoryFormPage />} />
        <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
        
      </Route>

      {/* 5. REDIRECCIÓN DE CONTINGENCIA (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}