// src/types/errorBoundary.types.ts
import type { ReactNode } from 'react';

// Propiedades que recibe el ErrorBoundary (los componentes hijos)
export interface ErrorBoundaryProps {
  children: ReactNode;
}

// Estado interno para controlar si hubo un fallo y guardar el mensaje
export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}