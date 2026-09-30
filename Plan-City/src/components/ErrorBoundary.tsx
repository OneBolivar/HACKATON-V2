// Archivo que sirve para manejar errores en la interfaz de usuario y evitar que toda la aplicación se rompa debido a un fallo en un componente hijo.
// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  // Se activa al ocurrir un fallo en cualquier componente hijo
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { // Como funciona?: getDerivedStateFromError es un método estático que se llama cuando un componente hijo lanza un error. 
  // Este método permite actualizar el estado del ErrorBoundary para reflejar que ha ocurrido un error. Devuelve un objeto que actualiza el estado, en este caso,
  //  estableciendo hasError en true y guardando el mensaje de error.
    return {
      hasError: true,
      errorMessage: error.message || 'Error inesperado en la interfaz',
    };
  }

  // Se activa después de que el error ha sido capturado y permite realizar acciones secundarias, como registrar el error en un servicio de monitoreo.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó:', error, errorInfo);
  }

  // Redirige al inicio y recarga limpia
  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-8 text-center shadow-xl shadow-purple-950/5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ocurrió un error inesperado al renderizar la vista.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs bg-gray-100 p-2 rounded text-gray-700 font-mono mb-4 text-left">
                {this.state.errorMessage}
              </p>
            )}
            <button
              onClick={this.handleReload}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Recargar la aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}