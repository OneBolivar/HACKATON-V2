/**
 * PAGINA DE CATEGORIAS
 * Vista publica que lista todas las categorias registradas en el sistema.
 * Permite a cualquier usuario explorar las categorias y ver eventos asociados.
 * Solo administradores ven el boton para crear nuevas categorias.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesService } from '../services/categories.service';
import { useAuth } from '../context/AuthContext';
import type { Category } from '../types';
import { ApiError } from '../api/apiError';

const ADMIN_ROLE = 'admin' as const;

export function CategoriesPage() {
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getCategoriesService();
        setCategories(data);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No se pudieron cargar las categorías.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-purple-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">Explora actividades agrupadas por temática y área de interés</p>
        </div>
        
        {user?.role === ADMIN_ROLE && (
          <Link
            to="/categories/new"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-95"
          >
            + Nueva Categoría
          </Link>
        )}
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium"
        >
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-purple-600 font-medium">Cargando categorías...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No hay categorías registradas por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-purple-100/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                    Categoría
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                  {cat.description || 'Sin descripción disponible.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/categories/${cat.id}`}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors inline-block"
                >
                  Ver eventos asociados →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}