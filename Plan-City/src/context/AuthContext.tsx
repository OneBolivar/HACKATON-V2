// Este archivo sirve para crear un contexto de autenticación en React,
//  que maneja el estado del usuario, su rol y las funciones de login, registro y logout. 
// También se encarga de restaurar la sesión si hay un token válido guardado en el almacenamiento local.
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, LoginCredentials, RegisterCredentials } from '../types';
import { loginService, registerService, logoutService, getMeService } from '../services/auth.service';
import { tokenStorage } from '../lib/tokenStorage';
/* eslint-disable react-refresh/only-export-components */ //Esto sirve para ignorar el error de exportar el componente AuthProvider y el hook useAuth

// Estructura del contexto de autenticación
interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado del usuario actual
  const [user, setUser] = useState<User | null>(null);
  // Estado de carga inicial mientras se verifica el token
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efecto que se ejecuta UNA sola vez al cargar la app para restaurar sesión
  useEffect(() => {
    async function initAuth() {
      const token = tokenStorage.get();
      // Si no hay token guardado, no hay sesión activa 
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Consultamos /users/me para traer los datos del usuario con el token guardado
        const currentUser = await getMeService();
        setUser(currentUser);
      } catch {
        // Si el token expiró o es inválido, limpiamos localStorage
        tokenStorage.remove();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  // Función para procesar el login
  async function login(credentials: LoginCredentials) {
    const data = await loginService(credentials);
    tokenStorage.set(data.accessToken); // Guardamos token
    setUser(data.user);                 // Guardamos usuario en estado
  }

  // Función para procesar el registro
  async function register(credentials: RegisterCredentials) {
    const data = await registerService(credentials);
    tokenStorage.set(data.accessToken);
    setUser(data.user);
  }

  // Función para cerrar sesión
  async function logout() {
    try {
      await logoutService();
    } catch {
      // Si la red falla, igual forzamos el cierre local
    } finally {
      tokenStorage.remove();
      setUser(null);
    }
  }

  // Derivamos el rol del usuario y si está autenticado
  const role = user?.role ?? null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}