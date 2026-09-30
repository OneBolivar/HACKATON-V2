// Este archivo define un cliente de API utilizando Axios, configurado para manejar tokens de autenticación y errores de red.
import axios from 'axios';
import { tokenStorage } from '../lib/tokenStorage';
import { ApiError } from './apiError';

// Crear una instancia de Axios con la URL base de la API y encabezados predeterminados
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjuntar Token en cada petición
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Capturar 401 y errores de red
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError('Error de red: no se pudo conectar con el servidor.', 0, true)
      );
    }

    // Manejar errores de la API
    const status = error.response.status;
    const backendMessage = error.response.data?.message || 'Error en la petición.';
    const message = Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage;

    if (status === 401) {
      tokenStorage.remove();
    }

    return Promise.reject(new ApiError(message, status));
  }
);