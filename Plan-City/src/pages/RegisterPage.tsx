/**
 *  PÁGINA DE REGISTRO
 * Formulario para que nuevos usuarios se registren en PlanCity.
 * Requiere nombre, email y contraseña. Crea la cuenta y autentica automáticamente.
 * Redirige a /login si el usuario ya tiene cuenta.
 */

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/apiError";

//  COMPONENTE: Maneja la página de registro
export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  //  ESTADOS DEL FORMULARIO
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //  ESTADOS DE CONTROL DE UI
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manejar el envío del formulario
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    // Intentamos registrar al usuario con los datos proporcionados
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigate("/"); // Redirigir al catálogo tras registro
    } catch (error) {
      if (error instanceof ApiError) {
        // si el error es de tipo ApiError, mostramos el mensaje específico
        setErrorMessage(error.message);
      } else {
        // si no es un ApiError, mostramos un mensaje genérico
        setErrorMessage(
          "Error al crear la cuenta. Verifica los datos ingresados.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4.25rem)] items-center justify-center overflow-hidden bg-[#2A292E] px-4 py-8 sm:px-6">
      {/* Ambient light stays behind the glass panel. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-36 size-80 rounded-full bg-[#4F2361]/45 blur-[140px] animate-[pulse_9s_ease-in-out_infinite]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-28 size-96 rounded-full bg-[#4F2361]/35 blur-[140px] animate-[pulse_11s_ease-in-out_infinite]" />

      <div className="relative my-auto w-full max-w-md animate-[fade-in_500ms_ease-out_both] rounded-3xl border border-[#7F5281]/30 bg-[#2A292E]/85 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-9">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-[#7F5281]/40 bg-[#4F2361]/45 text-sm font-black tracking-wide text-white shadow-lg shadow-[#4F2361]/30">
            PC
          </span>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7F5281]">Tu próxima historia empieza aquí</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Crear cuenta</h1>
          <p className="mt-2 text-sm text-white/65">Únete a PlanCity y descubre eventos</p>
        </div>

        {errorMessage && (
          <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-rose-300/30 bg-rose-950/35 px-4 py-3 text-sm leading-relaxed text-rose-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/80">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Juan Bolívar"
              className="w-full rounded-xl border border-[#7F5281]/25 bg-[#2A292E]/90 px-4 py-3 text-sm text-white placeholder:text-white/35 transition duration-200 focus:border-[#7F5281] focus:outline-none focus:ring-4 focus:ring-[#7F5281]/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/80">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-[#7F5281]/25 bg-[#2A292E]/90 px-4 py-3 text-sm text-white placeholder:text-white/35 transition duration-200 focus:border-[#7F5281] focus:outline-none focus:ring-4 focus:ring-[#7F5281]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/80">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#7F5281]/25 bg-[#2A292E]/90 px-4 py-3 text-sm text-white placeholder:text-white/35 transition duration-200 focus:border-[#7F5281] focus:outline-none focus:ring-4 focus:ring-[#7F5281]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative mt-2 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#4F2361] to-[#7F5281] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4F2361]/30 transition duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[450%]" />
            {isSubmitting && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
            <span>{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-[#7F5281] transition-colors hover:text-white">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
