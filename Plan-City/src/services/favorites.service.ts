// Este archivo contiene funciones de servicio relacionadas con los favoritos,
// que se encargan de realizar solicitudes HTTP a la API para obtener, agregar y eliminar eventos favoritos del usuario logueado. 
// Estas funciones utilizan el cliente API (apiClient) para interactuar con los endpoints correspondientes y manejar las respuestas de manera adecuada.
import { apiClient } from '../api/client';
import type { AppEvent } from '../types';

/**
 * Obtiene la lista de eventos guardados en favoritos del usuario logueado
 * Endpoint: GET /favorites
 */
export async function getFavoritesService(): Promise<AppEvent[]> {
  const response = await apiClient.get<AppEvent[]>('/favorites');
  return response.data;
}

/**
 * Agrega un evento a la lista de favoritos del usuario
 * Endpoint: POST /favorites/:eventId
 */
export async function addFavoriteService(eventId: string): Promise<void> {
  await apiClient.post(`/favorites/${eventId}`);
}

/**
 * Elimina un evento de la lista de favoritos del usuario
 * Endpoint: DELETE /favorites/:eventId
 */
export async function removeFavoriteService(eventId: string): Promise<void> {
  await apiClient.delete(`/favorites/${eventId}`);
}