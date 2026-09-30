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
    return <div className="p-12 text-center text-purple-600 font-medium">Cargando evento...</div>;
  }

  if (errorMsg || !event) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 bg-red-50 text-red-700 text-center rounded-xl" role="alert">
        <p className="mb-2">{errorMsg || 'Evento no encontrado'}</p>
        <Link to="/" className="text-purple-600 underline font-semibold text-sm">
          Volver a eventos
        </Link>
      </div>
    );
  }

  const rawFirstImage = event.images && event.images.length > 0 ? (event.images[0] as unknown) : null;
  const imgUrl: string | null =
    typeof rawFirstImage === 'string'
      ? rawFirstImage
      : (rawFirstImage as { url?: string })?.url || (event as { imageUrl?: string }).imageUrl || null;

  return (
    <div className="max-w-3xl mx-auto my-8 px-4 sm:px-0">
      <div className="p-6 sm:p-8 bg-white border border-purple-100 rounded-3xl shadow-sm">
        <Link to="/" className="text-xs font-semibold text-purple-600 hover:underline mb-4 inline-block">
          ← Volver a eventos
        </Link>

        <div className="h-72 mb-6 rounded-2xl overflow-hidden bg-purple-50 flex items-center justify-center">
          {imgUrl && !imageFailed ? (
            <img
              src={imgUrl}
              alt={event.name}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-purple-300 text-sm font-semibold">Sin imagen disponible</span>
          )}
        </div>

        <div className="flex justify-between items-center mb-3">
          {event.category && (
            <span className="text-xs font-bold uppercase px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {event.category.name}
            </span>
          )}
          <span className="text-xs text-gray-500 font-semibold">
            Capacidad: {event.capacity} personas
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">{event.name}</h1>

        <div className="space-y-1.5 text-sm text-gray-600 mb-6 pb-5 border-b border-gray-100">
          <p><strong>📅 Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>📍 Ubicación:</strong> {event.location}</p>
          <p><strong>💵 Precio:</strong> {event.price > 0 ? `$${event.price.toLocaleString()}` : 'Gratis'}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Descripción</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {event.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Modulo de Boleto Digital y Check-in QR */}
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 border border-purple-100 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-purple-200/70 text-purple-800 rounded-md">
                Boleto Digital & QR
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-2">Pase de Acceso Rápido</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Presenta este código en la entrada para el escaneo móvil y control de aforo instantáneo.
              </p>
              
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handleReserveTicket}
                  disabled={ticketReserved}
                  className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm transition-all ${
                    ticketReserved
                      ? 'bg-emerald-600 cursor-default'
                      : !isAuthenticated
                      ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-300'
                      : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
                  }`}
                >
                  {!isAuthenticated
                    ? 'Inicia sesión para reservar'
                    : ticketReserved
                    ? '✓ Boleto Reservado'
                    : event.price > 0
                    ? `Comprar Entrada ($${event.price.toLocaleString()})`
                    : 'Obtener Pase Gratuito'}
                </button>
                <span className="text-xs text-gray-400 font-medium">Cupos limitados</span>
              </div>
            </div>

            {/* Codigo QR real y escaneable */}
            <div className="p-3 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col items-center">
              <div className="w-28 h-28 bg-purple-50 rounded-xl p-2 flex items-center justify-center border border-purple-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=581c87&data=PLANCITY-EVENT-${event.id}`}
                  alt="Código QR del boleto"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-800 mt-2 tracking-wider">
                ID: {event.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="flex gap-2 pt-6 mt-6 border-t border-gray-100">
            <Link
              to={`/events/${event.id}/edit`}
              className="flex-1 text-center py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl text-sm hover:bg-purple-100 transition-colors"
            >
              Editar Evento
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-50 text-red-700 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
            >
              Eliminar Evento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}