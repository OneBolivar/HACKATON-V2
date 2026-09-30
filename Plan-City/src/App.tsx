/**
 * 1. ErrorBoundary: Captura errores de renderizado para evitar pantallas en blanco.
 * 2. BrowserRouter: Habilita el enrutamiento en el navegador.
 * 3. AuthProvider: Provee el estado global de autenticación a toda la aplicación.
 */
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './appRouter';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-[#0b0910] text-white">
            {/* Barra de navegación persistente en todas las vistas */}
            <Navbar />
            
            {/* Renderizado dinámico de la vista según la ruta activa */}
            <main className="flex-1">
              <AppRouter />
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;