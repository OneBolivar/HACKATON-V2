// Este archivo contiene funciones de servicio relacionadas con la autenticación,
// que se encargan de realizar solicitudes HTTP a la API para iniciar sesión, registrar usuarios, cerrar sesión y obtener el perfil del usuario autenticado.
// Estas funciones utilizan el cliente API (apiClient) para interactuar con los endpoints correspondientes y manejar las respuestas de manera adecuada.
import { apiClient } from '../api/client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

/**
 * Petición para iniciar sesión
 * Endpoint: POST /auth/login
 */
export async function loginService(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data; // Retorna { accessToken, user }
}

/**
 * Petición para registrar un nuevo usuario
 * Endpoint: POST /auth/register
 */
export async function registerService(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
  return response.data;
}

/**
 * Petición para cerrar sesión en el servidor
 * Endpoint: POST /auth/logout
 */
export async function logoutService(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/**
 * Petición para obtener el perfil del usuario autenticado actual (rehidratación de sesión)
 * Endpoint: GET /users/me
 */
export async function getMeService(): Promise<User> {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
}