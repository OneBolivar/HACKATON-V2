/**
 * Muestra el detalle individual de una categoria y la lista de eventos asociados a ella.
 * Permite a los administradores:
 * 1. Acceder al formulario para crear un evento precargando esta categoria (?categoryId=UUID).
 * 2. Editar los datos de la categoria actual.
 * 3. Eliminar la categoria (con confirmacion de usuario).
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategoryByIdService, deleteCategoryService } from '../services/categories.service';
import { getEventsService } from '../services/events.service';
import { useAuth } from '../context/AuthContext';
import type { Category, AppEvent } from '../types';
import { ApiError } from '../api/apiError';

const ADMIN_ROLE = 'admin' as const;

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        setErrorMsg('');

        const [catData, allEvents] = await Promise.all([
          getCategoryByIdService(id),
          getEventsService(),
        ]);

        setCategory(catData);
        setEvents(allEvents.filter((ev) => ev.categoryId === id));
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('No se pudo encontrar la categoría');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleDelete() {
    if (!id || !confirm('¿Eliminar esta categoría?')) return;
    try {
      await deleteCategoryService(id);
      navigate('/categories');
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al eliminar categoría');
      }
    }
  }

  if (loading) {
    return <div className="p-16 text-center text-purple-600 font-medium">Cargando categoría...</div>;
  }

  if (errorMsg || !category) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 text-red-700 text-center rounded-2xl shadow-sm"
      >
        <p className="mb-3 text-sm font-medium">{errorMsg || 'Categoría no encontrada'}</p>
        <Link to="/categories" className="text-purple-700 underline font-bold text-sm">
          Volver a categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/categories"
        className="text-xs font-semibold text-purple-600 hover:underline mb-4 inline-block"
      >
        ← Volver a categorías
      </Link>

      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
              Detalle de Categoría
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{category.name}</h1>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              {category.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {user?.role === ADMIN_ROLE && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/events/new?categoryId=${category.id}`}
                className="px-3.5 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition-colors shadow-sm active:scale-95"
              >
                + Agregar evento
              </Link>
              <Link
                to={`/categories/${category.id}/edit`}
                className="px-3.5 py-2 bg-purple-50 text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-100 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 bg-red-50 text-red-700 font-bold rounded-xl text-xs hover:bg-red-100 transition-colors"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-900">Eventos en esta categoría</h2>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {events.length} {events.length === 1 ? 'evento' : 'eventos'}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300 text-sm">
          No hay eventos registrados en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-purple-100/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-purple-600 font-bold mb-1.5 flex items-center gap-1.5">
                  <span>📍 {ev.location}</span>
                </p>
                <Link to={`/events/${ev.id}`}>
                  <h4 className="font-bold text-gray-900 hover:text-purple-600 transition-colors text-base line-clamp-1 mb-1">
                    {ev.name}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500 mb-2">Capacidad: {ev.capacity} personas</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                <span className="text-sm font-extrabold text-purple-700">
                  {ev.price > 0 ? `$${ev.price.toLocaleString()}` : 'Gratis'}
                </span>
                <Link
                  to={`/events/${ev.id}`}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}