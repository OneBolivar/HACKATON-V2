/**
 *  PÁGINA DE REGISTRO
 * Formulario para que nuevos usuarios se registren en PlanCity.
 * Requiere nombre, email y contraseña. Crea la cuenta y autentica automáticamente.
 * Redirige a /login si el usuario ya tiene cuenta.
 */

import { useState } from "react";
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
  async function handleSubmit(e: React.FormEvent) {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-purple-950/5 border border-purple-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Únete a PlanCity y descubre eventos
          </p>
        </div>
        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="bg-red-50 text-red-700 p-3 rounded mb-4"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Juan Bolívar"
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50 text-sm mt-2"
          >
            {isSubmitting ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
