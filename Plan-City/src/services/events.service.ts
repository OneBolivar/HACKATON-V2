// Este archivo contiene funciones de servicio relacionadas con los eventos,
// que se encargan de realizar solicitudes HTTP a la API para obtener, crear, actualizar y eliminar eventos. 
// Estas funciones utilizan el cliente API (apiClient) para interactuar con los endpoints correspondientes y manejar las respuestas de manera adecuada.
import { apiClient } from '../api/client';
import type { AppEvent, CreateEventDto, UpdateEventDto } from '../types';

/**
 * Obtiene todos los eventos disponibles (sin paginación en backend)
 * Endpoint: GET /events
 */
export async function getEventsService(): Promise<AppEvent[]> {
  const response = await apiClient.get<AppEvent[]>('/events');
  return response.data;
}

/**
 * Obtiene el detalle completo de un evento por su ID
 * Endpoint: GET /events/:id
 */
export async function getEventByIdService(id: string): Promise<AppEvent> {
  const response = await apiClient.get<AppEvent>(`/events/${id}`);
  return response.data;
}

/**
 * Crea un nuevo evento vinculado a una categoría (exclusivo para rol admin)
 * Endpoint: POST /events
 */
export async function createEventService(dto: CreateEventDto): Promise<AppEvent> {
  const response = await apiClient.post<AppEvent>('/events', dto);
  return response.data;
}

/**
 * Actualiza los datos de un evento existente por su ID (exclusivo para rol admin)
 * Endpoint: PATCH /events/:id
 */
export async function updateEventService(id: string, dto: UpdateEventDto): Promise<AppEvent> {
  const response = await apiClient.patch<AppEvent>(`/events/${id}`, dto);
  return response.data;
}

/**
 * Elimina un evento por su ID (exclusivo para rol admin)
 * Endpoint: DELETE /events/:id
 */
export async function deleteEventService(id: string): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}