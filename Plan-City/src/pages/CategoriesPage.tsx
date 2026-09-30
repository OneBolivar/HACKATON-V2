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
    <section className="relative isolate min-h-[calc(100vh-4.25rem)] overflow-hidden bg-[#2A292E] px-4 py-10 sm:px-6 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 size-96 rounded-full bg-[#4F2361]/25 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-9 flex flex-col items-start justify-between gap-5 border-b border-[#7F5281]/25 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7F5281]">Descubre por intereses</p>
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Explora <span className="bg-gradient-to-r from-white to-[#7F5281] bg-clip-text text-transparent">categorías</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Encuentra actividades agrupadas por temática y área de interés.
            </p>
          </div>

          {user?.role === ADMIN_ROLE && (
            <Link
              to="/categories/new"
              className="rounded-xl bg-gradient-to-r from-[#4F2361] to-[#7F5281] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#4F2361]/25 transition hover:brightness-110 active:scale-95"
            >
              + Nueva categoría
            </Link>
          )}
        </header>

        {errorMessage && (
          <div role="alert" aria-live="polite" className="mb-6 rounded-xl border border-rose-300/25 bg-rose-950/30 p-4 text-sm font-medium text-rose-100">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center" role="status" aria-live="polite">
            <div className="flex items-center gap-3 text-sm font-medium text-white/70">
              <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-[#7F5281]/35 border-t-[#7F5281]" />
              Cargando categorías...
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#7F5281]/35 bg-[#2A292E]/70 px-6 py-16 text-center backdrop-blur-xl">
            <span aria-hidden="true" className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-[#7F5281]/30 bg-[#4F2361]/30 text-xl text-white">⌕</span>
            <h2 className="text-lg font-bold text-white">Aún no hay categorías</h2>
            <p className="mt-2 text-sm text-white/55">Las nuevas categorías aparecerán aquí cuando estén disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <article
                key={category.id}
                className="group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-[#7F5281]/30 bg-[#2A292E]/85 p-6 shadow-xl shadow-black/20 backdrop-blur-2xl transition duration-200 hover:-translate-y-1 hover:border-[#7F5281]/60 hover:shadow-2xl hover:shadow-[#4F2361]/20"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-36 rounded-full bg-[#4F2361]/15 blur-3xl transition-colors group-hover:bg-[#7F5281]/20" />
                <div className="relative">
                  <span className="inline-flex rounded-full border border-[#7F5281]/35 bg-[#4F2361]/25 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7F5281]">
                    Categoría
                  </span>
                  <h2 className="mt-4 text-xl font-bold text-white">{category.name}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">
                    {category.description || 'Sin descripción disponible.'}
                  </p>
                </div>

                <div className="relative mt-6 border-t border-[#7F5281]/20 pt-4">
                  <Link
                    to={`/categories/${category.id}`}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4F2361]/35 hover:text-[#7F5281]"
                  >
                    Explorar eventos <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}