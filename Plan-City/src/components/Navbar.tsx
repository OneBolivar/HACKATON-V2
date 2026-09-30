/**
 * BARRA DE NAVEGACIÓN
 * Navbar persistente en todas las páginas. Muestra diferentes opciones según el rol del usuario:
 * - Público: Links a Login/Registro
 * - Usuario autenticado: Links a Favoritos, Perfil + Salir
 * - Admin: Links adicionales para crear eventos y categorías
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLE = 'admin' as const;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      navigate("/login");
    }
  };

  const navigationLinks = [
    { to: "/", label: "Eventos" },
    { to: "/categories", label: "Categorías" },
    ...(isAuthenticated
      ? [
          { to: "/favorites", label: "Mis favoritos" },
          { to: "/profile", label: "Mi perfil" },
        ]
      : []),
    ...(user?.role === ADMIN_ROLE
      ? [
          { to: "/events/new", label: "+ Evento", featured: true },
          { to: "/categories/new", label: "+ Categoría", featured: true },
        ]
      : []),
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100d18]/85 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5 text-lg font-extrabold text-white transition-opacity hover:opacity-80"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-violet-500 text-xs font-black text-white shadow-lg shadow-violet-500/30">
            PC
          </span>
          <span>Plan<span className="text-violet-300">City</span></span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map(({ to, label, featured }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${
                featured ? "ml-1 border border-violet-400/25 bg-violet-400/10 text-violet-200" : "text-white/70"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/profile"
                className="max-w-40 truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-violet-300/40 hover:text-white"
                title="Ir a mi perfil"
              >
                {user.name} <span className="text-violet-300">· {user.role}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-rose-300/40 hover:text-rose-200 active:scale-95"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/75 transition hover:text-white">
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-950/30 transition hover:bg-violet-400 active:scale-95"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-white transition hover:bg-white/10 active:scale-95 lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Navegación móvil" className="border-t border-white/10 bg-[#100d18] px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map(({ to, label, featured }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-white/10 ${featured ? "text-violet-200" : "text-white/75"}`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
              {isAuthenticated && user ? (
                <>
                  <span className="min-w-0 flex-1 truncate text-xs text-white/55">{user.name} · {user.role}</span>
                  <button onClick={handleLogout} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/75 transition hover:text-rose-200">
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold text-white/75 hover:bg-white/10">
                    Ingresar
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="flex-1 rounded-lg bg-violet-500 px-3 py-2 text-center text-sm font-bold text-white hover:bg-violet-400">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}