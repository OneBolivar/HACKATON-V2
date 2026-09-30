// Este archivo contiene funciones de servicio relacionadas con las categorías,
// que se encargan de realizar solicitudes HTTP a la API para obtener, crear, actualizar y eliminar categorías. 
// Estas funciones utilizan el cliente API (apiClient) para interactuar con los endpoints correspondientes y manejar las respuestas de manera adecuada.
import { apiClient } from '../api/client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

/**
 * Obtiene todas las categorías (no paginadas)
 * Endpoint: GET /categories
 */
export async function getCategoriesService(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

/**
 * Obtiene el detalle de una categoría por su ID, incluyendo sus eventos asociados
 * Endpoint: GET /categories/:id
 */
export async function getCategoryByIdService(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

/**
 * Crea una nueva categoría (exclusivo para rol admin)
 * Endpoint: POST /categories
 */
export async function createCategoryService(dto: CreateCategoryDto): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', dto);
  return response.data;
}

/**
 * Actualiza una categoría existente por su ID (exclusivo para rol admin)
 * Endpoint: PATCH /categories/:id
 */
export async function updateCategoryService(id: string, dto: UpdateCategoryDto): Promise<Category> {
  const response = await apiClient.patch<Category>(`/categories/${id}`, dto);
  return response.data;
}

/**
 * Elimina una categoría por su ID (exclusivo para rol admin)
 * Endpoint: DELETE /categories/:id
 */
export async function deleteCategoryService(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}