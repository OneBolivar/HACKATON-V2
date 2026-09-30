/**
 * PAGINA DE FORMULARIO DE EVENTOS
 * Permite crear nuevos eventos (POST) o editar existentes (PATCH).
 * Solo administradores pueden acceder. Maneja imagen, descripcion, fecha, etc.
 * Redirige al catalogo principal tras guardar con exito.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createEventService, getEventByIdService, updateEventService } from '../services/events.service';
import { getCategoriesService } from '../services/categories.service';
import type { Category, CreateEventDto, UpdateEventDto } from '../types';
import { ApiError } from '../api/apiError';

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Estados: Categorias y control de carga
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Estados: Campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(100);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        const cats = await getCategoriesService();
        setCategories(cats);

        if (cats.length > 0) {
          setCategoryId(cats[0].id);
        }

        if (isEditing && id) {
          const ev = await getEventByIdService(id);
          setName(ev.name);
          setDescription(ev.description || '');
          setDate(ev.date ? ev.date.split('T')[0] : '');
          setLocation(ev.location);
          setPrice(ev.price);
          setCapacity(ev.capacity || 100);
          setCategoryId(ev.categoryId);
          if (ev.images && ev.images.length > 0) {
            const firstImg = ev.images[0] as unknown;
            setImageUrl(typeof firstImg === 'string' ? firstImg : (firstImg as { url?: string })?.url || '');
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('Error al cargar los datos');
        }
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [id, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    const imagesList = imageUrl.trim() ? [imageUrl.trim()] : [];

    try {
      if (isEditing && id) {
        const datosActualizados: UpdateEventDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          date: new Date(date).toISOString(),
          location: location.trim(),
          price: Number(price),
          capacity: Number(capacity),
          categoryId,
          images: imagesList.length > 0 ? imagesList : undefined,
        };
        await updateEventService(id, datosActualizados);
      } else {
        const nuevoEvento: CreateEventDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          date: new Date(date).toISOString(),
          location: location.trim(),
          price: Number(price),
          capacity: Number(capacity),
          categoryId,
          images: imagesList,
        };
        await createEventService(nuevoEvento);
      }

      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error al guardar el evento');
      }
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-purple-600 font-medium">Cargando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white border border-purple-100 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isEditing ? 'Editar Evento' : 'Crear Evento'}
      </h2>

      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event-name" className="block text-sm font-semibold mb-1 text-gray-700">
            Nombre del Evento *
          </label>
          <input
            id="event-name"
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Festival de Música"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="event-category" className="block text-sm font-semibold mb-1 text-gray-700">
            Categoría *
          </label>
          <select
            id="event-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="event-date" className="block text-sm font-semibold mb-1 text-gray-700">
              Fecha *
            </label>
            <input
              id="event-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="event-price" className="block text-sm font-semibold mb-1 text-gray-700">
              Precio ($) *
            </label>
            <input
              id="event-price"
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="event-capacity" className="block text-sm font-semibold mb-1 text-gray-700">
              Capacidad *
            </label>
            <input
              id="event-capacity"
              type="number"
              min="1"
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="event-location" className="block text-sm font-semibold mb-1 text-gray-700">
            Ubicación / Lugar *
          </label>
          <input
            id="event-location"
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Auditorio Central"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="event-image" className="block text-sm font-semibold mb-1 text-gray-700">
            URL de Imagen (Opcional)
          </label>
          <input
            id="event-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="event-description" className="block text-sm font-semibold mb-1 text-gray-700">
            Descripción
          </label>
          <textarea
            id="event-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles sobre el evento..."
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
          <Link
            to="/"
            className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 text-center transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}