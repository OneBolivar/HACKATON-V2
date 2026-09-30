/**
 * PAGINA DE DETALLE DEL EVENTO
 * Muestra informacion completa de un evento incluyendo imagen, descripcion,
 * fecha, ubicacion y capacidad. Solo administradores pueden editar o eliminar.
 * Requiere autenticacion para reservar o emitir boletos digitales con QR real.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventByIdService, deleteEventService } from '../services/events.service';
import { useAuth } from '../context/AuthContext';
import type { AppEvent } from '../types';
import { ApiError } from '../api/apiError';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [ticketReserved, setTicketReserved] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventByIdService(id);
        setEvent(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('No se pudo encontrar el evento');
        }
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  async function handleDelete() {
    if (!id || !confirm('¿Deseas eliminar este evento?')) return;
    try {
      await deleteEventService(id);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Error al eliminar');
      }
    }
  }

  function handleReserveTicket() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setTicketReserved(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4.25rem)] items-center justify-center bg-[#2A292E] px-4" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-sm font-medium text-white/75">
          <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-[#7F5281]/35 border-t-[#7F5281]" />
          Cargando evento...
        </div>
      </div>
    );
  }

  if (errorMsg || !event) {
    return (
      <div className="mx-auto my-10 max-w-md rounded-2xl border border-rose-300/25 bg-rose-950/30 p-5 text-center text-rose-100" role="alert">
        <p className="mb-3 text-sm">{errorMsg || 'Evento no encontrado'}</p>
        <Link to="/" className="text-sm font-semibold text-[#7F5281] underline underline-offset-4 hover:text-white">
          Volver a eventos
        </Link>
      </div>
    );
  }

  const imgUrl = event.images?.[0] ?? null;

  return (
    <div className="relative isolate min-h-[calc(100vh-4.25rem)] overflow-hidden bg-[#2A292E] px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 size-96 rounded-full bg-[#4F2361]/25 blur-[140px]" />
      <div className="relative mx-auto max-w-5xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7F5281] transition-colors hover:text-white">
          <span aria-hidden="true">←</span> Volver a eventos
        </Link>

        <article className="overflow-hidden rounded-3xl border border-[#7F5281]/30 bg-[#2A292E]/85 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <header className="relative isolate flex min-h-72 items-end overflow-hidden bg-gradient-to-br from-[#4F2361] via-[#2A292E] to-[#7F5281]/40 p-6 sm:min-h-96 sm:p-10">
            {imgUrl && !imageFailed && (
              <img
                src={imgUrl}
                alt=""
                onError={() => setImageFailed(true)}
                className="absolute inset-0 -z-20 size-full object-cover opacity-30"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2A292E] via-[#2A292E]/35 to-[#4F2361]/25" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-[#7F5281]/25 blur-[100px]" />

            <div className="relative z-10 w-full">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-[#7F5281]/45 bg-[#2A292E]/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  {event.category?.name || 'Evento local'}
                </span>
                <span className="rounded-full border border-white/15 bg-[#2A292E]/50 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                  {event.capacity} cupos
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">{event.name}</h1>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#7F5281]/25 bg-[#2A292E]/70 p-4">
                <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-[#4F2361]/45 text-lg text-white" aria-hidden="true">◷</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F5281]">Fecha</p>
                <p className="mt-1 text-sm font-semibold text-white">{new Date(event.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
              </div>
              <div className="rounded-2xl border border-[#7F5281]/25 bg-[#2A292E]/70 p-4">
                <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-[#4F2361]/45 text-lg text-white" aria-hidden="true">⌖</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F5281]">Ubicación</p>
                <p className="mt-1 text-sm font-semibold text-white">{event.location}</p>
              </div>
              <div className="rounded-2xl border border-[#7F5281]/25 bg-[#2A292E]/70 p-4">
                <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-[#4F2361]/45 text-lg font-bold text-white" aria-hidden="true">$</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F5281]">Precio</p>
                <p className="mt-1 text-sm font-semibold text-white">{event.price > 0 ? `$${event.price.toLocaleString()}` : 'Gratis'}</p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#7F5281]">Acerca del evento</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {event.description || 'Sin descripción disponible.'}
              </p>
            </section>

            <section className="mt-8 rounded-2xl border border-[#7F5281]/30 bg-gradient-to-br from-[#4F2361]/25 via-[#2A292E]/90 to-[#7F5281]/10 p-5 sm:p-6" aria-labelledby="digital-pass-title">
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex-1 text-center sm:text-left">
                  <span className="rounded-md border border-[#7F5281]/40 bg-[#4F2361]/35 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    Pase digital · QR
                  </span>
                  <h2 id="digital-pass-title" className="mt-3 text-xl font-black text-white">Pase de acceso rápido</h2>
                  <p className="mt-1 max-w-lg text-xs leading-relaxed text-white/65">
                    Presenta este código en la entrada para el escaneo móvil y el control de aforo.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <button
                      onClick={handleReserveTicket}
                      disabled={ticketReserved}
                      className="rounded-xl bg-gradient-to-r from-[#4F2361] to-[#7F5281] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#4F2361]/25 transition hover:brightness-110 active:scale-95 disabled:cursor-default disabled:opacity-80"
                    >
                      {!isAuthenticated
                        ? 'Inicia sesión para reservar'
                        : ticketReserved
                        ? '✓ Boleto reservado'
                        : event.price > 0
                        ? `Comprar entrada ($${event.price.toLocaleString()})`
                        : 'Obtener pase gratuito'}
                    </button>
                    <span className="text-xs font-medium text-white/50">Capacidad: {event.capacity} personas</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-center rounded-2xl border border-[#7F5281]/30 bg-[#2A292E]/75 p-4 shadow-lg shadow-black/20">
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-xl border border-[#7F5281]/25 bg-white p-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=4F2361&data=PLANCITY-EVENT-${event.id}`}
                      alt="Código QR del boleto"
                      className="size-full rounded-lg"
                    />
                  </div>
                  <span className="mt-2 font-mono text-[10px] font-bold tracking-wider text-[#7F5281]">
                    ID: {event.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            </section>

            {user?.role === 'admin' && (
              <div className="mt-6 flex flex-col gap-3 border-t border-[#7F5281]/20 pt-6 sm:flex-row">
                <Link
                  to={`/events/${event.id}/edit`}
                  className="flex-1 rounded-xl border border-[#7F5281]/35 bg-[#4F2361]/35 py-3 text-center text-sm font-bold text-white transition hover:bg-[#4F2361]/60 active:scale-95"
                >
                  Editar evento
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl border border-[#7F5281]/25 bg-[#2A292E]/70 py-3 text-sm font-bold text-white/75 transition hover:border-[#7F5281]/60 hover:text-white active:scale-95"
                >
                  Eliminar evento
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}