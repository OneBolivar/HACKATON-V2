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
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-violet-300/15 bg-gradient-to-br from-[#211633] via-[#171222] to-[#10232a] p-6 text-white shadow-2xl shadow-black/25 sm:p-10">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/5 bg-gradient-to-l from-cyan-300/[0.04] to-transparent lg:block" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block rounded-full border border-violet-200/20 bg-violet-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-200 backdrop-blur-sm">
              Descubre & Conecta
            </span>
            {user?.role === 'admin' && (
              <Link
                to="/events/new"
                className="rounded-lg border border-white/15 bg-white px-3.5 py-2 text-xs font-bold text-[#211633] shadow-sm transition hover:bg-violet-100 active:scale-95"
              >
                + Publicar Evento
              </Link>
            )}
          </div>
          
          <h1 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">
            Encuentra los mejores eventos en PlanCity
          </h1>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/65">
            Festivales, conferencias, deportes y actividades comunitarias en tu ciudad.
          </p>

          {/* Buscador Integrado en Hero */}
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-2 backdrop-blur-md sm:flex-row">
            <input
              type="text"
              placeholder="Buscar por nombre o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#110e18]/90 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20"
            />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#110e18]/90 px-4 py-3 text-sm font-medium text-white/80 focus:border-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400/20 sm:min-w-52"
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
        <div role="alert" aria-live="polite" className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando eventos" aria-live="polite">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
              <div className="h-48 animate-pulse bg-white/[0.06]" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-2/5 animate-pulse rounded bg-white/[0.08]" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-white/[0.08]" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="my-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/10 text-2xl text-violet-200" aria-hidden="true">⌕</span>
          <h2 className="text-lg font-bold text-white">Sin eventos por aquí</h2>
          <p className="mt-2 text-sm text-white/55">Prueba con otra búsqueda o cambia los filtros.</p>
        </div>
      ) : (
        <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-white/[0.055] hover:shadow-xl hover:shadow-violet-950/20"
            >
              <div>
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-[#20172d] to-[#111a20]">
                  <EventCardImage event={ev} />

                  <button
                    onClick={() => handleToggleFavorite(ev)}
                    className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-lg shadow-md backdrop-blur transition hover:scale-110 hover:border-violet-200/50 active:scale-95"
                    aria-label={ev.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {ev.isFavorite ? '💜' : '🤍'}
                  </button>
                </div>

                <div className="p-5">
                  <p className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-cyan-200/80">
                    <span>📍 {ev.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(ev.date).toLocaleDateString()}</span>
                  </p>
                  <Link to={`/events/${ev.id}`}>
                    <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-violet-200">
                      {ev.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-white/45">Capacidad: {ev.capacity} personas</p>
                  {ev.description && (
                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-white/60">
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] p-5 pt-4">
                <span className="text-base font-extrabold text-white">
                  {ev.price > 0 ? `$${ev.price.toLocaleString()}` : 'Gratis'}
                </span>
                <Link
                  to={`/events/${ev.id}`}
                  className="rounded-md px-2 py-1 text-xs font-bold text-violet-200 transition hover:bg-violet-300/10 hover:text-white active:scale-95"
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