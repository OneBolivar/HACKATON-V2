/**
 * PAGINA DE FAVORITOS
 * Muestra solo los eventos marcados como favoritos por el usuario autenticado.
 * Permite quitar eventos de favoritos con un clic.
 * Solo accesible para usuarios autenticados (protegido por ProtectedRoute).
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavoritesService, removeFavoriteService } from '../services/favorites.service';
import type { AppEvent } from '../types';
import { ApiError } from '../api/apiError';

// Componente auxiliar para renderizado y fallback de imagen
function FavoriteCardImage({ event }: { event: AppEvent }) {
  const [hasError, setHasError] = useState(false);

  const rawFirstImage = event.images && event.images.length > 0 ? (event.images[0] as unknown) : null;
  const imgUrl: string | null =
    typeof rawFirstImage === 'string'
      ? rawFirstImage
      : (rawFirstImage as { url?: string })?.url || (event as { imageUrl?: string }).imageUrl || null;

  if (!imgUrl || hasError) {
    return <span className="text-purple-300 text-xs font-semibold">Sin imagen</span>;
  }

  return (
    <img
      src={imgUrl}
      alt={event.name}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover"
    />
  );
}

export function FavoritesPage() {
  // Estados locales para almacenar favoritos y control de carga
  const [favorites, setFavorites] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const data = await getFavoritesService();
        setFavorites(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('No se pudieron cargar tus favoritos');
        }
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemove(eventId: string) {
    try {
      await removeFavoriteService(eventId);
      setFavorites((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setFavorites((prev) => prev.filter((ev) => ev.id !== eventId));
      } else {
        alert('Error al quitar de favoritos');
      }
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-purple-600 font-medium">Cargando favoritos...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-purple-100">
        Mis Favoritos 💜
      </h1>

      {errorMsg && (
        <div role="alert" aria-live="polite" className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4 text-sm">No tienes eventos guardados en favoritos.</p>
          <Link
            to="/"
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-purple-700 inline-block transition-colors"
          >
            Explorar eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-purple-50 flex items-center justify-center">
                  <FavoriteCardImage event={ev} />
                </div>

                <div className="p-4">
                  <p className="text-xs text-purple-600 font-bold mb-1">
                    📍 {ev.location} | 📅 {new Date(ev.date).toLocaleDateString()}
                  </p>
                  <Link to={`/events/${ev.id}`}>
                    <h3 className="font-bold text-gray-800 hover:text-purple-600 transition-colors">
                      {ev.name}
                    </h3>
                  </Link>
                  {ev.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ev.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex justify-between items-center mt-3">
                <span className="font-bold text-purple-700">
                  {ev.price > 0 ? `$${ev.price.toLocaleString()}` : 'Gratis'}
                </span>
                <button
                  onClick={() => handleRemove(ev.id)}
                  aria-label={`Quitar ${ev.name} de favoritos`}
                  className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                >
                  Quitar 💔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}