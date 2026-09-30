import type { AppEvent } from './event.types';

// Objeto de transferencia de datos (DTO) para una categoría
export interface Category {
  id: string;
  name: string;
  description: string | null;
  events?: AppEvent[];
  createdAt?: string;
  updatedAt?: string;
}

// Objeto de transferencia de datos (DTO) para crear una categoría
export interface CreateCategoryDto {
  name: string;
  description?: string;
}

// Objeto de transferencia de datos (DTO) para actualizar una categoría
export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}