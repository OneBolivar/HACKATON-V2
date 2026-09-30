# 🎯 PlanCity — Plataforma de Descubrimiento y Gestión de Eventos Locales

> **Una aplicación web moderna para explorar, crear y administrar eventos locales en tu comunidad.**  
> Conecta a usuarios y administradores con actividades en tiempo real, implementando autenticación segura con JWT y control de acceso basado en roles (RBAC).

REPOSITORIO: https://github.com/OneBolivar/Prueba-Desempe-o-Modulo-TS.git

---

## 📑 Tabla de Contenidos

1. [Características Principales](#características-principales)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Scripts Disponibles](#scripts-disponibles)
6. [Estructura de Carpetas](#estructura-de-carpetas)
7. [Decisiones Técnicas](#decisiones-técnicas)
8. [Guía de Autenticación y Roles](#guía-de-autenticación-y-roles)
9. [Funcionalidades por Rol](#funcionalidades-por-rol)
10. [Matriz de Permisos](#matriz-de-permisos)
11. [Solución de Problemas](#solución-de-problemas)
12. [API Disponible](#api-disponible)

---

## 🎯 Características Principales

### Para Usuarios Públicos (No Autenticados)
- ✅ **Catálogo de Eventos**: Exploración de eventos disponibles con detalles (ubicación, fecha, precio, capacidad)
- ✅ **Búsqueda y Filtros Locales**: Filtra los eventos cargados por nombre, ubicación y categoría
- ✅ **Explorador de Categorías**: Visualiza todas las categorías de eventos disponibles
- ✅ **Registro e Ingreso**: Crea cuenta o inicia sesión de forma segura

### Para Usuarios Autenticados (Rol: `user`)
- ✅ **Gestión de Favoritos**: Marca/desmarca eventos como favoritos sin recargas
- ✅ **Mis Favoritos**: Visualiza una vista privada con tus eventos guardados
- ✅ **Mi Perfil**: Consulta tu nombre, correo, rol, estado de cuenta y accesos rápidos
- ✅ **Sesión persistente**: La sesión se restaura al recargar la aplicación mediante `/users/me`

### Para Administradores (Rol: `admin`)
- ✅ **CRUD de Eventos**: Crear, editar y eliminar eventos (formulario completo)
- ✅ **CRUD de Categorías**: Gestionar categorías de eventos
- ✅ **Acciones administrativas integradas**: Acceso a los formularios y acciones de gestión desde las vistas de eventos y categorías
- ✅ **Control de acceso por roles**: Las rutas de gestión requieren el rol `admin`

### Experiencia del catálogo
- ✅ **Hero de descubrimiento**: Encabezado visual con acceso rápido a publicar eventos para administradores
- ✅ **Suite de capacidades**: Sección informativa sobre gestión logística, comunicación y análisis para eventos

### Características de Resiliencia
- ✅ **ErrorBoundary Global**: Captura errores en la UI para evitar pantallas en blanco
- ✅ **Manejo de Imágenes Rotas**: Fallback visual cuando las imágenes no cargan
- ✅ **Validación de Formularios**: Validaciones nativas HTML y restricciones de campos antes de enviar
- ✅ **Interceptores de Errores**: Gestión automática de errores API y de red

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Rol | Justificación |
|---|---|---|---|
| **React** | 19.2.8 | Librería de UI | Componentes reutilizables, hooks y renderizado eficiente |
| **TypeScript** | ~6.0.2 | Lenguaje | Tipado estricto, autocompletado mejorado y detección de errores |
| **Vite** | 8.2.2 | Bundler | Compilación ultrarrápida con HMR (Hot Module Replacement) |
| **React Router** | 7.18.3 | Enrutamiento | Navegación declarativa y protección de rutas RBAC |
| **Tailwind CSS** | 4.3.3 | Estilos | Utilidades CSS responsivas con diseño ágil |
| **Axios** | 1.20.0 | Cliente HTTP | Interceptores automáticos de Bearer tokens y manejo de errores |
| **Context API** | Nativa | Gestión de Estado | Centralización de autenticación sin librerías externas |
| **Vitest** | 4.1.11 | Testing | Pruebas rápidas y similares a Jest |
| **React Testing Library** | 16.3.3 | Testing | Pruebas enfocadas en la experiencia del usuario |

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js**: `v18.0.0` o superior  
  ```bash
  node --version  # Verifica tu versión
  ```

- **NPM**: `v9.0.0` o superior  
  ```bash
  npm --version  # Verifica tu versión
  ```

- **Backend API**: `plancity-api` ejecutándose y accesible desde el navegador
  (Reemplaza en `src/api/client.ts` si usas otra URL)

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd PD-TS
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crea o configura un archivo `.env` en la raíz del proyecto:

```env
# URL de la API backend (por defecto: http://localhost:3000)
VITE_API_URL=http://localhost:3000
```

> **Nota**: Vite automáticamente busca variables que comienzan con `VITE_`. Si no se define `VITE_API_URL`, se utiliza `http://localhost:3000`.

### 4️⃣ Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 5️⃣ Construir para Producción

```bash
npm run build
```

Los archivos optimizados se crearán en la carpeta `dist/`.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera bundle con Vite |
| `npm run preview` | Visualiza la build de producción localmente |
| `npm run lint` | Ejecuta ESLint para revisar errores y estilos |
| `npm test` | Ejecuta pruebas unitarias con Vitest |

---

## 📂 Estructura de Carpetas

```
PD-TS/
├── public/                          # Archivos estáticos (favicon, etc.)
├── src/
│   ├── api/
│   │   ├── apiError.ts             # 🔴 Clase personalizada de errores API
│   │   └── client.ts               # 🌐 Cliente Axios con interceptores
│   ├── components/
│   │   ├── ErrorBoundary.tsx       # 🛡️ Captura errores de renderizado
│   │   ├── EventFeaturesHub.tsx    # 🧩 Suite visual de capacidades para eventos
│   │   ├── Navbar.tsx              # 📱 Barra de navegación persistente
│   │   └── ProtectedRoute.tsx      # 🔐 Guard de rutas por rol
│   ├── context/
│   │   └── AuthContext.tsx         # 👤 Contexto global de autenticación
│   ├── lib/
│   │   └── tokenStorage.ts         # 💾 Gestión de JWT en localStorage
│   ├── pages/
│   │   ├── CategoriesPage.tsx      # 🏷️ Listado de categorías públicas
│   │   ├── CategoryDetailPage.tsx  # 📋 Detalle de categoría + eventos
│   │   ├── CategoryFormPage.tsx    # ✏️ Formulario crear/editar categoría
│   │   ├── EventDetailPage.tsx     # 📺 Detalle completo del evento
│   │   ├── EventFormPage.tsx       # 🎬 Formulario crear/editar evento
│   │   ├── EventsPage.tsx          # 🎟️ Catálogo principal de eventos
│   │   ├── FavoritesPage.tsx       # ❤️ Mis eventos favoritos
│   │   ├── LoginPage.tsx           # 🔐 Formulario de inicio de sesión
│   │   ├── ProfilePage.tsx          # 👤 Perfil del usuario autenticado
│   │   └── RegisterPage.tsx        # 📝 Formulario de registro
│   ├── services/
│   │   ├── auth.service.ts         # 🔑 Servicios de autenticación
│   │   ├── categories.service.ts   # 📂 Servicios de categorías
│   │   ├── events.service.ts       # 🎪 Servicios de eventos
│   │   └── favorites.service.ts    # 💜 Servicios de favoritos
│   ├── types/
│   │   ├── auth.types.ts           # 👥 Tipos de autenticación
│   │   ├── category.types.ts       # 📑 Tipos de categorías
│   │   ├── errorBoundary.types.ts  # ⚠️ Tipos de ErrorBoundary
│   │   ├── event.types.ts          # 🎭 Tipos de eventos
│   │   └── index.ts                # 📦 Exportación centralizada
│   ├── utils/
│   │   └── formatters.ts           # 🎨 Funciones de formato reutilizables
│   ├── test/
│   │   ├── formatters.test.ts      # ✅ Tests de utilidades
│   │   ├── LoginPage.test.tsx      # ✅ Tests de LoginPage
│   │   └── setup.ts                # ⚙️ Configuración de pruebas
│   ├── App.tsx                     # 🎯 Componente raíz
│   ├── appRouter.tsx               # 🗺️ Configuración de rutas
│   ├── main.tsx                    # 🚀 Punto de entrada
│   └── index.css                   # 🎨 Estilos globales
├── .env                             # Variables de entorno locales (opcional)
├── eslint.config.js                # ⚙️ Configuración de linting
├── package.json                    # 📦 Dependencias y scripts
├── tsconfig.json                   # ⚙️ Configuración de TypeScript
├── tsconfig.app.json               # ⚙️ Config TS para aplicación
├── tsconfig.node.json              # ⚙️ Config TS para herramientas
├── vite.config.ts                  # ⚙️ Configuración de Vite
└── README.md                        # 📖 Este archivo
```
---

## 🔐 Guía de Autenticación y Roles

### Flujo de Autenticación

```
Usuario sin sesión
      ↓
  [Login] o [Registro]
      ↓
   API retorna JWT
      ↓
   Token guardado en localStorage
      ↓
  useAuth() obtiene datos del usuario
      ↓
   AuthProvider proporciona contexto
      ↓
  isAuthenticated = true & role asignado
```

### Persistencia de Sesión

La aplicación **rehidrata automáticamente** la sesión al recargar:

1. **Al montarse**: `AuthProvider` ejecuta `getMeService()`
2. **Si hay token**: Obtiene datos del usuario desde `/users/me`
3. **Si no hay token**: Mantiene sesión cerrada
4. **Si el token es inválido o expira**: Limpia localStorage; las rutas protegidas redirigen a login

### Tokens JWT

- **Formato**: `Bearer {token}`
- **Ubicación**: `Authorization` header (añadido automáticamente por interceptor)
- **Almacenamiento**: `localStorage` bajo clave `accessToken`
- **Expiración**: Configurada en el backend; el frontend la comprueba al consultar `/users/me`

---

## 👥 Funcionalidades por Rol

### 🌍 Público (Sin Autenticación)

| Funcionalidad | Permitido |
|---|:---:|
| Ver eventos públicos | ✅ |
| Filtrar eventos | ✅ |
| Ver categorías | ✅ |
| Ver detalle de evento | ✅ |
| Registrarse | ✅ |
| Iniciar sesión | ✅ |
| Guardar favoritos | ❌ |
| Crear/editar eventos | ❌ |
| Crear/editar categorías | ❌ |

### 👤 Usuario Autenticado (Rol: `user`)

| Funcionalidad | Permitido |
|---|:---:|
| Ver eventos públicos | ✅ |
| Ver categorías | ✅ |
| Ver detalle de evento | ✅ |
| Guardar favoritos | ✅ |
| Ver mis favoritos | ✅ |
| Quitar de favoritos | ✅ |
| Crear eventos | ❌ |
| Editar eventos | ❌ |
| Eliminar eventos | ❌ |
| Crear categorías | ❌ |

### 🛡️ Administrador (Rol: `admin`)

| Funcionalidad | Permitido |
|---|:---:|
| **Todas las funciones de usuario** | ✅ |
| Crear evento | ✅ |
| Editar evento | ✅ |
| Eliminar evento | ✅ |
| Crear categoría | ✅ |
| Editar categoría | ✅ |
| Eliminar categoría | ✅ |
| Acciones de gestión desde eventos y categorías | ✅ |
| Acceso a rutas administrativas | ✅ |

---

## 📊 Matriz de Permisos

```
┌─────────────────────────────────────────────────────────────────┐
│                      MATRIZ DE PERMISOS (RBAC)                  │
├──────────────────────────┬──────────────┬──────────────┬─────────┤
│ Acción                   │   Público    │    User      │ Admin   │
├──────────────────────────┼──────────────┼──────────────┼─────────┤
│ VER EVENTOS              │     ✅       │      ✅      │   ✅    │
│ BUSCAR EVENTOS           │     ✅       │      ✅      │   ✅    │
│ VER CATEGORÍAS           │     ✅       │      ✅      │   ✅    │
│ VER FAVORITOS            │     ❌       │      ✅      │   ✅    │
│ AGREGAR FAVORITO         │     ❌       │      ✅      │   ✅    │
│ QUITAR FAVORITO          │     ❌       │      ✅      │   ✅    │
├──────────────────────────┼──────────────┼──────────────┼─────────┤
│ CREAR EVENTO             │     ❌       │      ❌      │   ✅    │
│ EDITAR EVENTO            │     ❌       │      ❌      │   ✅    │
│ ELIMINAR EVENTO          │     ❌       │      ❌      │   ✅    │
├──────────────────────────┼──────────────┼──────────────┼─────────┤
│ CREAR CATEGORÍA          │     ❌       │      ❌      │   ✅    │
│ EDITAR CATEGORÍA         │     ❌       │      ❌      │   ✅    │
│ ELIMINAR CATEGORÍA       │     ❌       │      ❌      │   ✅    │
├──────────────────────────┼──────────────┼──────────────┼─────────┤
│ ACCESO A /favorites      │     ❌       │      ✅      │   ✅    │
│ ACCESO A /profile        │     ❌       │      ✅      │   ✅    │
│ ACCESO A /events/new     │     ❌       │      ❌      │   ✅    │
│ ACCESO A /categories/new │     ❌       │      ❌      │   ✅    │
└──────────────────────────┴──────────────┴──────────────┴─────────┘
```

---
## 🌐 API Disponible

Todas las peticiones se realizan mediante `src/api/client.ts`. El interceptor de solicitud agrega automáticamente `Authorization: Bearer <token>` cuando existe un token. Los errores HTTP y de red se normalizan como `ApiError`, y las respuestas `401` eliminan el token local.

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/logout` | Cerrar sesión en el servidor |
| `GET` | `/users/me` | Recuperar el usuario autenticado |
| `GET` | `/events` | Listar eventos |
| `GET` | `/events/:id` | Consultar detalle de evento |
| `POST` | `/events` | Crear evento (`admin`) |
| `PATCH` | `/events/:id` | Editar evento (`admin`) |
| `DELETE` | `/events/:id` | Eliminar evento (`admin`) |
| `GET` | `/categories` | Listar categorías |
| `GET` | `/categories/:id` | Consultar detalle de categoría |
| `POST` | `/categories` | Crear categoría (`admin`) |
| `PATCH` | `/categories/:id` | Editar categoría (`admin`) |
| `DELETE` | `/categories/:id` | Eliminar categoría (`admin`) |
| `GET` | `/favorites` | Listar favoritos del usuario |
| `POST` | `/favorites/:eventId` | Agregar favorito |
| `DELETE` | `/favorites/:eventId` | Quitar favorito |

---
## 🏗️ Decisiones Técnicas

### 1️⃣ Cliente HTTP: Axios vs Fetch

#### ❌ ¿Por qué NO usamos Fetch?

Aunque Fetch es nativo del navegador, tiene desventajas para un proyecto profesional:

```javascript
// ❌ Con Fetch: Código repetido y verbose
async function getEvents() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:3000/events', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 401) {
    localStorage.removeItem('accessToken'); // Hay que hacerlo manualmente
  }
  const data = await response.json();
  return data;
}
```

#### ✅ ¿Por qué Axios?

Implementamos **Axios** porque:

| Ventaja | Beneficio |
|---------|-----------|
| **Interceptores globales** | Inyectamos el `Authorization` header automáticamente en TODAS las peticiones |
| **Normalización de errores** | Convertimos errores HTTP y de red a `ApiError` tipado |
| **Transformación automática** | No necesitamos `.json()`, devuelve objetos JS directamente |
| **Configuración centralizada** | La URL, los encabezados y los interceptores viven en un solo cliente |

```typescript
// ✅ Con Axios: Limpio y centralizado
// src/api/client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor: Agrega token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Captura errores y limpiar token en 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove(); // Sesión expirada
    }
    return Promise.reject(new ApiError(error.response?.data?.message, error.response?.status));
  }
);

// 📝 Ahora en cualquier servicio:
export async function getEventsService(): Promise<AppEvent[]> {
  const response = await apiClient.get<AppEvent[]>('/events');
  return response.data; // ✅ Token inyectado automáticamente, errores normalizados
}
```

---

### 2️⃣ Capa de Datos (Services Pattern)

#### Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────┐
│                     COMPONENTES UI (React)               │
│     EventsPage.tsx, LoginPage.tsx, etc.                 │
└────────────────────┬────────────────────────────────────┘
                     │ Llaman a
                     ↓
┌─────────────────────────────────────────────────────────┐
│              CAPA DE SERVICIOS (Services)                │
│   auth.service.ts, events.service.ts, etc.              │
│   ↓ Usan apiClient                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│            CLIENTE HTTP (Axios + Interceptores)          │
│              src/api/client.ts                          │
│    - Inyecta tokens automáticamente                      │
│    - Normaliza errores                                  │
│    - Maneja 401 Unauthorized                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND API REST                        │
│             http://localhost:3000                        │
│   /auth/login, /events, /categories, etc.               │
└─────────────────────────────────────────────────────────┘
```

#### ¿Por qué esta arquitectura?

**Ventajas:**
- ✅ **Desacoplamiento**: Los componentes no conocen de HTTP
- ✅ **Reutilización**: Mismo servicio usado por múltiples componentes
- ✅ **Mantenibilidad**: Cambiar URL de API = cambiar solo `client.ts`
- ✅ **Testing**: Fácil mockear servicios en tests
- ✅ **Seguridad**: Tokens centralizados en un lugar

#### Ejemplo práctico:

```typescript
// ❌ MAL: Lógica HTTP en el componente
function EventsPage() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch('http://localhost:3000/events', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);
}

// ✅ BIEN: Lógica en la capa de servicios
// src/services/events.service.ts
export async function getEventsService(): Promise<AppEvent[]> {
  const response = await apiClient.get<AppEvent[]>('/events');
  return response.data;
}

// Componente limpio y testeable
function EventsPage() {
  useEffect(() => {
    getEventsService()
      .then(setEvents)
      .catch(err => setErrorMsg(err.message));
  }, []);
}
```

---

### 3️⃣ Sesión y Autenticación: JWT + Context API

#### Flujo completo de autenticación

```typescript
// 1️⃣ INICIO DE SESIÓN (src/services/auth.service.ts)
export async function loginService(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data; // { accessToken: "jwt...", user: {...} }
}

// 2️⃣ GUARDAR TOKEN (src/lib/tokenStorage.ts)
export const tokenStorage = {
  get: () => localStorage.getItem('accessToken'),
  set: (token: string) => localStorage.setItem('accessToken', token),
  remove: () => localStorage.removeItem('accessToken'),
};

// 3️⃣ CONTEXTO GLOBAL (src/context/AuthContext.tsx)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar: Rehidratar sesión si existe token
  useEffect(() => {
    async function initAuth() {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // Verificar si el token sigue siendo válido
        const currentUser = await getMeService(); // GET /users/me
        setUser(currentUser);
      } catch {
        tokenStorage.remove(); // Token expirado
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  // Función de login: Guardar token y usuario
  async function login(credentials: LoginCredentials) {
    const data = await loginService(credentials);
    tokenStorage.set(data.accessToken); // Guardar en localStorage
    setUser(data.user); // Actualizar contexto
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4️⃣ USAR EN COMPONENTES
function LoginPage() {
  const { login } = useAuth(); // Hook personalizado
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/'); // Éxito, redirigir
    } catch (error) {
      setErrorMessage(error.message); // Mostrar error
    }
  }
}
```

#### ¿Por qué Context API en lugar de Redux o Zustand?

| Aspecto | Context API | Redux | Zustand |
|--------|------------|-------|---------|
| **Tamaño** | 0 KB (nativo) | +40 KB | +3 KB |
| **Curva aprendizaje** | Fácil | Difícil | Medio |
| **Para este proyecto** | ✅ Perfecto | ❌ Overkill | ✅ Bueno |

Como solo manejamos autenticación (estado global simple), Context API es suficiente.

---

### 4️⃣ Rutas y Seguridad: React Router + ProtectedRoute

#### Arquitectura de Rutas

```typescript
// src/appRouter.tsx
export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<EventsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/categories/:id" element={<CategoryDetailPage />} />

      {/* Rutas protegidas (requieren login) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Rutas protegidas (requieren ser admin) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
        <Route path="/categories/new" element={<CategoryFormPage />} />
        <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
      </Route>
    </Routes>
  );
}

// src/components/ProtectedRoute.tsx
export function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Verificando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />; // No autenticado
  if (allowedRoles && !allowedRoles.includes(user?.role!)) {
    return <Navigate to="/" replace />; // No tiene permisos
  }

  return <Outlet />; // Renderizar la página protegida
}
```

#### Flujo de acceso a ruta protegida

```
Usuario intenta acceder a /events/new
        ↓
¿Hay token en localStorage?
        ├─ NO → Redirigir a /login
        └─ SÍ → ¿Es válido? (Llamar a GET /users/me)
                ├─ NO → Eliminar token y redirigir a /login
                └─ SÍ → ¿Tiene rol 'admin'?
                        ├─ NO → Redirigir a /
                        └─ SÍ → Renderizar EventFormPage
```

---

### 5️⃣ UI y Estructura: Componentes Simples y Reutilizables

#### Principios de componentes

```typescript
// ✅ COMPONENTES SIMPLES (sin lógica compleja)
export function EventCard({ event }: { event: AppEvent }) {
  return (
    <div className="bg-white border border-purple-100 rounded-lg">
      <h3>{event.name}</h3>
      <p>{event.location}</p>
      <button>Ver detalle</button>
    </div>
  );
}

// ✅ LÓGICA EN PÁGINAS (contenedores)
export function EventsPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventsService()
      .then(setEvents)
      .catch(setError);
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      <div className="grid">
        {events.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
```

#### Estructura de una página típica

```
EventsPage.tsx
├── [ESTADO] useState para eventos, filtros, carga
├── [EFECTOS] useEffect para cargar datos
├── [FUNCIONES] handleFilter, handleToggleFavorite, etc.
├── [RENDER]
│   ├── Header con título
│   ├── Buscador y filtros
│   ├── Mensajes de error
│   ├── Spinner mientras carga
│   └── Grid de tarjetas de eventos
```

#### Sin Hooks Personalizados (mantener simple para aprender)

```typescript
// ❌ Evitamos hooks personalizados complejos
// ❌ Evitamos patrones avanzados (Suspense, useTransition, etc.)

// ✅ Solo useState y useEffect estándar
// ✅ Lógica clara y predecible
// ✅ Fácil de entender para principiantes
```

---

### 📊 Diagrama de Flujo General

```
┌──────────────────────────────────────────────────────────┐
│                    USUARIO                                │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ↓
        ┌─────────────────────────┐
        │   APLICACIÓN REACT      │
        │  ┌─────────────────────┐ │
        │  │   ErrorBoundary     │ │ 🛡️ Captura errores
        │  │ ┌─────────────────┐ │ │
        │  │ │ AuthProvider    │ │ │ 👤 Gestiona sesión
        │  │ │ ┌─────────────┐ │ │ │
        │  │ │ │  Router     │ │ │ │ 🗺️  Rutas
        │  │ │ │ ┌─────────┐ │ │ │ │
        │  │ │ │ │ Páginas │ │ │ │ │ 📄 Componentes
        │  │ │ │ │ Navbar  │ │ │ │ │
        │  │ │ │ └─────────┘ │ │ │ │
        │  │ │ └─────────────┘ │ │ │
        │  │ └─────────────────┘ │ │
        │  └─────────────────────┘ │
        └────────────────┬──────────┘
                         │
                         ↓
        ┌─────────────────────────────────┐
        │   CAPA DE SERVICIOS             │
        │  ├── auth.service.ts            │ 🔑 Autenticación
        │  ├── events.service.ts          │ 🎪 Eventos
        │  ├── categories.service.ts      │ 📂 Categorías
        │  └── favorites.service.ts       │ 💜 Favoritos
        └────────────────┬────────────────┘
                         │
                         ↓
        ┌─────────────────────────────────┐
        │    CLIENTE HTTP (Axios)         │
        │  ┌─────────────────────────────┐ │
        │  │ Interceptor Request:        │ │ → Agrega Authorization
        │  │ - Inyecta Bearer token      │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ Interceptor Response:       │ │ → Normaliza errores
        │  │ - Normaliza errores HTTP/red  │ │
        │  │ - Elimina token ante 401      │ │
        │  └─────────────────────────────┘ │
        └────────────────┬────────────────┘
                         │
                         ↓
        ┌─────────────────────────────────┐
        │   BACKEND REST API              │
        │   http://localhost:3000         │
        │                                 │
        │  ├── POST   /auth/login         │
        │  ├── POST   /auth/register      │
        │  ├── POST   /auth/logout        │
        │  ├── GET    /users/me           │
        │  ├── GET    /events             │
        │  ├── GET    /events/:id         │
        │  ├── POST   /events             │
        │  ├── PATCH  /events/:id         │
        │  ├── DELETE /events/:id         │
        │  ├── GET    /categories         │
        │  ├── GET    /categories/:id     │
        │  ├── POST   /categories         │
        │  ├── PATCH  /categories/:id     │
        │  ├── DELETE /categories/:id     │
        │  ├── GET    /favorites          │
        │  ├── POST   /favorites/:eventId │
        │  └── DELETE /favorites/:eventId │
        └─────────────────────────────────┘
```

---
## 🎨 Diseño Visual y Tonalidades Moradas

La aplicación usa una **paleta de colores moderna con tonos morados** para crear una interfaz atractiva:

### Colores Principales

```css
/* Morados (Tema principal) */
- bg-purple-50      → Fondo muy claro (tarjetas, secciones)
- bg-purple-100     → Badge y etiquetas
- bg-purple-600     → Botones principales
- bg-purple-700     → Hover en botones
- text-purple-600   → Textos destacados
- border-purple-100 → Bordes sutiles

/* Neutros (Soporte) */
- bg-white          → Fondos principales
- bg-slate-50       → Fondos secundarios
- text-gray-800     → Textos principales
- text-gray-500     → Textos secundarios
- border-gray-200   → Bordes normales
```

### Componentes Diseñados

- ✨ **Tarjetas de Eventos**: Bordes `border-purple-100`, fondo blanco con transiciones suaves
- ✨ **Hero del Catálogo**: Banner destacado con buscador integrado, selector de categorías y acceso rápido para publicar eventos
- ✨ **Perfil de Usuario**: Banner con inicial, nombre, correo y rol, además de estado de cuenta, favoritos y permisos
- ✨ **Suite de Capacidades**: `EventFeaturesHub` presenta visualmente herramientas de ticketing, check-in, agenda, comunicación y reportes como propuesta de la plataforma
- ✨ **Botones Primarios**: `bg-purple-600 hover:bg-purple-700` con sombra morada
- ✨ **Inputs y Textarea**: Borde gris claro, focus en purple con `focus:ring-2 focus:ring-purple-500`
- ✨ **Navbar**: Fondo blanco, bordes sutiles morados, enlaces hover morados
- ✨ **Formularios**: Layout limpio con etiquetas en mayúscula pequeña

---

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

### Archivos de Test Incluidos

- `src/test/formatters.test.ts`: Pruebas de funciones de formato
- `src/test/LoginPage.test.tsx`: Pruebas de integración del formulario de login

---

## 🔧 Solución de Problemas

### Error: "Cannot find module 'react'"
```bash
npm install
npm run build
```

### Error: "Port 5173 already in use"
```bash
# Usa otro puerto
npm run dev -- --port 3001
```

### Error: "Cannot GET /categories" (404 en API)
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la URL en `src/api/client.ts`

### Error: "Token expired" o redirección forzada a login
- El token JWT del backend ha expirado
- Cierra sesión y vuelve a autenticarte
- Revisa la configuración de expiración en el backend

### Imágenes de eventos no se muestran
- Verifica que las URLs en la API sean accesibles
- La app incluye fallback visual: "Sin imagen"

### TypeScript error: "Type is not assignable"
```bash
npm run build
```
Esto compilará y mostrará los errores reales de TypeScript.

---

## 📚 Documentación Adicional

### TypeScript
- [Manual de TypeScript](https://www.typescriptlang.org/docs/)

### React & Hooks
- [Documentación de React 19](https://react.dev)
- [React Hooks API](https://react.dev/reference/react/hooks)

### Tailwind CSS
- [Documentación de Tailwind](https://tailwindcss.com/docs)

### React Router
- [Documentación de React Router v7](https://reactrouter.com)

---

## 👨‍💻 Contribución y Desarrollo

### Agregar una Nueva Página

1. Crea el archivo en `src/pages/NuevaPage.tsx`
2. Define los tipos en `src/types/`
3. Agrega la ruta en `src/appRouter.tsx`
4. Importa en el `<BrowserRouter>`

### Agregar un Nuevo Servicio

1. Crea `src/services/nuevo.service.ts`
2. Usa `apiClient` para las peticiones
3. Maneja errores con `ApiError`

### Convenciones de Código

- ✅ Usar `type` para importar tipos
- ✅ Usar comentarios `/** */` en funciones
- ✅ Nombrar componentes en PascalCase
- ✅ Nombrar funciones y variables en camelCase
- ✅ Mantener componentes simples con `useState` y `useEffect`

---

## 📄 Licencia

Este proyecto es de uso educativo. Puedes modificarlo libremente para aprendizaje.

---

## 📧 Contacto y Soporte

Si tienes dudas o encuentras bugs:
1. Revisa esta documentación
2. Consulta la carpeta `src/` y sus comentarios
3. Abre un issue en el repositorio

---

**Última actualización**: Septiembre 2026
**Versión**: 0.0.0
**Estado**: ✅ En desarrollo y validado con build, lint y tests


