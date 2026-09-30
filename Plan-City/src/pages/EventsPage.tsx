/**
 * PAGINA DE EVENTOS
 * Muestra el catalogo completo de eventos con busqueda en tiempo real,
 * filtrado por categoria y gestion de favoritos para usuarios autenticados.
 * Solo administradores pueden crear nuevos eventos desde esta pagina.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEventsService } from '../services/events.service';
import { getCategoriesService } from '../services/categories.service';
import { getFavoritesService, addFavoriteService, removeFavoriteService } from '../services/favorites.service';
import { useAuth } from '../context/AuthContext';
import type { AppEvent, Category } from '../types';
import { ApiError } from '../api/apiError';
import { EventFeaturesHub } from '../components/EventFeaturesHub';

// Componente auxiliar para asegurar la carga o fallback de imagen individual
function EventCardImage({ event }: { event: AppEvent }) {
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

export function EventsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Estados locales para datos, filtros y carga
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMsg('');

        const cats = await getCategoriesService();
        const evs = await getEventsService();

        setCategories(cats);

        if (isAuthenticated) {
          try {
            const favs = await getFavoritesService();
            const favIds = new Set(favs.map((f) => f.id));
            setEvents(evs.map((e) => ({ ...e, isFavorite: favIds.has(e.id) })));
          } catch {
            setEvents(evs);
          }
        } else {
          setEvents(evs);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('No se pudieron cargar los eventos');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  async function handleToggleFavorite(event: AppEvent) {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const currentFav = Boolean(event.isFavorite);

    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, isFavorite: !currentFav } : e))
    );

    try {
      if (currentFav) {
        await removeFavoriteService(event.id);
      } else {
        await addFavoriteService(event.id);
      }
    } catch (err) {
      if (err instanceof ApiError && (err.status === 409 || err.status === 404)) {
        return;
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, isFavorite: currentFav } : e))
      );
    }
  }

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategoryId ? ev.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Banner Principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white p-8 sm:p-10 mb-8 shadow-xl shadow-purple-950/15">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs font-semibold uppercase tracking-wider text-purple-200 backdrop-blur-sm">
              Descubre & Conecta
            </span>
            {user?.role === 'admin' && (
              <Link
                to="/events/new"
                className="bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                + Publicar Evento
              </Link>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            Encuentra los mejores eventos en PlanCity
          </h1>
          <p className="text-purple-200 text-sm font-normal mb-6">
            Festivales, conferencias, deportes y actividades comunitarias en tu ciudad.
          </p>

          {/* Buscador Integrado en Hero */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white/15 p-2 rounded-2xl backdrop-blur-md border border-white/20">
            <input
              type="text"
              placeholder="Buscar por nombre o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="px-4 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" aria-live="polite" className="p-3 mb-6 bg-red-50 text-red-700 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-purple-600 font-medium">Cargando eventos...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="my-10 p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
          No se encontraron eventos con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-purple-100/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-purple-50 flex items-center justify-center">
                  <EventCardImage event={ev} />

                  <button
                    onClick={() => handleToggleFavorite(ev)}
                    className="absolute top-2.5 right-2.5 w-9 h-9 bg-white/95 backdrop-blur-sm border border-purple-100 rounded-full shadow-sm flex items-center justify-center text-base hover:scale-105 transition-transform"
                    aria-label={ev.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {ev.isFavorite ? '💜' : '🤍'}
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-xs text-purple-600 font-bold mb-1.5 flex items-center gap-2">
                    <span>📍 {ev.location}</span>
                    <span>•</span>
                    <span>📅 {new Date(ev.date).toLocaleDateString()}</span>
                  </p>
                  <Link to={`/events/${ev.id}`}>
                    <h3 className="font-bold text-gray-900 hover:text-purple-600 transition-colors text-base line-clamp-1">
                      {ev.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">Capacidad: {ev.capacity} personas</p>
                  {ev.description && (
                    <p className="text-gray-600 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center mt-3">
                <span className="text-base font-extrabold text-purple-700">
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

      {/* Suite de Capacidades de la Plataforma */}
      <EventFeaturesHub />
    </div>
  );
}