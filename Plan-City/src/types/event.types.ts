import type { Category } from './category.types';

// Objeto de transferencia de datos (DTO) para un evento
export interface AppEvent {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[]; // Arreglo de strings con URLs de imágenes
  category?: Category;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Objeto de transferencia de datos (DTO) para crear un evento
export interface CreateEventDto {
  name: string;
  description?: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[];
}

// Objeto de transferencia de datos (DTO) para actualizar un evento
export interface UpdateEventDto {
  name?: string;
  description?: string;
  date?: string;
  location?: string;
  price?: number;
  capacity?: number;
  categoryId?: string;
  images?: string[];
}