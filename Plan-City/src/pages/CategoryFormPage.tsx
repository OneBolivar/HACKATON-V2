/**
 * PAGINA DE FORMULARIO DE CATEGORIAS
 * Permite crear nuevas categorias (POST) o editar existentes (PATCH).
 * Solo administradores pueden acceder. Requiere nombre y descripcion opcional.
 * Redirige al listado de categorias tras guardar con exito.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createCategoryService, getCategoryByIdService, updateCategoryService } from '../services/categories.service';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types';
import { ApiError } from '../api/apiError';

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Estados de control de UI
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Precarga de datos existentes en modo edicion
  useEffect(() => {
    async function loadCategory() {
      if (!isEditing || !id) return;
      try {
        setLoading(true);
        const data = await getCategoryByIdService(id);
        setName(data.name);
        setDescription(data.description || '');
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No se pudo cargar la información de la categoría.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [id, isEditing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        const payload: UpdateCategoryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
        };
        await updateCategoryService(id, payload);
      } else {
        const payload: CreateCategoryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
        };
        await createCategoryService(payload);
      }

      navigate('/categories');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error al guardar la categoría.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-purple-600 font-medium">Cargando datos...</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-purple-950/5 border border-purple-100 p-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold uppercase mb-2">
            Administración
          </span>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
        </div>

        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nombre *
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Festivales, Talleres, Deportes"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="category-description" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Breve descripción de la categoría..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
            />
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Categoría'}
            </button>
            <Link
              to="/categories"
              className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}