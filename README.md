# PlanCity

Monorepo de PlanCity con el frontend React y la API REST para descubrir y gestionar eventos locales. Cada aplicación conserva sus dependencias y scripts en su propio directorio; [Docker Compose](docker-compose.yml) permite levantarlas juntas.

| Aplicación | Directorio | Stack |
|---|---|---|
| Frontend | `Plan-City/` | React, Vite y TypeScript |
| API | `Plan-City-Api/` | NestJS, TypeORM y PostgreSQL |

Clona este repositorio una sola vez y ejecuta los comandos de cada aplicación desde su directorio. Para iniciar ambas con Docker, configura los archivos `.env` locales y ejecuta `docker compose up --build` desde la raíz.

## API REST

La API ofrece categorías, eventos y favoritos, con autenticación JWT y control de acceso basado en roles (RBAC). Está construida con [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) y PostgreSQL (compatible con [Supabase](https://supabase.com/)).

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Scripts disponibles](#scripts-disponibles)
- [Documentación interactiva (Swagger)](#documentación-interactiva-swagger)
- [Autenticación y roles](#autenticación-y-roles)
- [Módulos y endpoints principales](#módulos-y-endpoints-principales)
- [Pruebas](#pruebas)
- [Migraciones](#migraciones)

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | NestJS 11 |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL (TypeORM) |
| Autenticación | JWT (`@nestjs/jwt` + `passport-jwt`) |
| Validación | `class-validator` / `class-transformer` |
| Documentación de API | Swagger (`@nestjs/swagger`) |
| Testing | Jest + Supertest |

## Estructura del proyecto

```
src/
├── common/               # Guards y decoradores transversales (JWT, roles)
├── modules/
│   ├── auth/              # Registro, login, logout, estrategia JWT
│   ├── users/              # Perfil del usuario autenticado, cambio de contraseña
│   ├── categories/         # CRUD de categorías de evento (creación restringida a admin)
│   ├── events/              # CRUD de eventos, búsqueda y filtros (creación restringida a admin, sin paginación)
│   └── favorites/           # Eventos favoritos por usuario
├── migrations/            # Migraciones de TypeORM (fuente de verdad del esquema)
├── data-source.ts         # Configuración de conexión usada por la CLI de TypeORM
├── app.module.ts
└── main.ts                # Bootstrap: CORS, ValidationPipe global, Swagger
```

Cada módulo sigue la misma convención interna: `*.controller.ts` (rutas), `*.service.ts` (lógica de negocio), `dto/` (validación de entrada) y `entities/` (modelo de datos/TypeORM).

## Requisitos previos

- Node.js 20 o superior
- Una base de datos PostgreSQL accesible (se recomienda un proyecto de [Supabase](https://supabase.com/), gratuito y sin necesidad de instalar Postgres localmente)

## Instalación y configuración

```bash
cd Plan-City-Api
npm install
```

Crea tu archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Completa `.env` con tus propios valores:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que corre la API (por defecto `3000`). |
| `DATABASE_URL` | Cadena de conexión a tu base de datos PostgreSQL. En Supabase: **Project Settings → Database → Connection string** (usa el *Session pooler*, puerto `5432`). |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT. Usa un valor largo y aleatorio, nunca el del `.env.example`. |
| `JWT_EXPIRES_IN` | Vigencia del token (ej. `1d`, `12h`). |

Con la base de datos ya configurada, aplica las migraciones para crear el esquema:

```bash
npm run migration:run
```

Esto crea todas las tablas y **siembra automáticamente una cuenta administradora** (ver [Autenticación y roles](#autenticación-y-roles)) — no hace falta crearla a mano.

Levanta el servidor en modo desarrollo:

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Levanta el servidor con recarga automática. |
| `npm run start:prod` | Corre la build de producción (requiere `npm run build` antes). |
| `npm run build` | Compila el proyecto a `dist/`. |
| `npm run lint` | Corre ESLint con autofix. |
| `npm run test` | Corre los tests unitarios. |
| `npm run test:e2e` | Corre los tests end-to-end. |
| `npm run migration:run` | Aplica las migraciones pendientes. |
| `npm run migration:revert` | Revierte la última migración aplicada. |
| `npm run migration:generate` | Genera una migración a partir de cambios en las entidades. |

## Documentación interactiva (Swagger)

Con el servidor corriendo, la documentación completa de la API está disponible en:

```
http://localhost:3000/api/docs
```

Ahí puedes ver cada endpoint, su cuerpo de petición/respuesta esperado, y probarlo directamente autenticándote con el botón **Authorize** (pega el `accessToken` que devuelve `/auth/login`).

## Autenticación y roles

La API usa JWT con dos roles: `admin` y `user`.

1. El usuario se registra (`POST /auth/register`) o inicia sesión (`POST /auth/login`).
2. La API responde con un `accessToken` que incluye el `id`, `email` y `role` del usuario.
3. Ese token debe enviarse en cada petición a una ruta protegida:

```
Authorization: Bearer <accessToken>
```

- El token expira según `JWT_EXPIRES_IN`. Si expira o es inválido, la API responde `401 Unauthorized`.
- Como el JWT es *stateless*, el servidor no invalida tokens activamente: `POST /auth/logout` solo confirma la acción; quien cierra la sesión realmente es el cliente, descartando el token guardado.

**Cuenta admin sembrada por la migración** (solo para desarrollo/pruebas — cambia la contraseña si vas a exponer la API fuera de un entorno controlado):

- Email: `admin@examen.com`
- Password: `Admin123!`

Cualquier otra cuenta registrada desde `/auth/register` recibe el rol `user` por defecto.

### Formato de errores

Todas las respuestas de error siguen esta forma:

```json
{ "statusCode": 400, "message": "Descripción del error", "error": "Bad Request" }
```

En errores de validación, `message` es un arreglo con un string por cada campo inválido.

| Código | Significado |
|---|---|
| `400` | Datos inválidos (body no cumple las reglas de validación). |
| `401` | Falta el token, es inválido o expiró. |
| `403` | El usuario está autenticado pero no tiene el rol requerido. |
| `404` | El recurso solicitado no existe. |
| `409` | Conflicto (ej. correo o nombre duplicado, o evento ya marcado como favorito). |

## Módulos y endpoints principales

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `POST` | `/auth/register` | No | — |
| `POST` | `/auth/login` | No | — |
| `POST` | `/auth/logout` | Sí | cualquiera |
| `GET` | `/users/me` | Sí | cualquiera |
| `PATCH` | `/users/me/password` | Sí | cualquiera |
| `GET` | `/categories` | No | — |
| `GET` | `/categories/:id` | No | — |
| `POST` | `/categories` | Sí | `admin` |
| `PATCH` | `/categories/:id` | Sí | `admin` |
| `DELETE` | `/categories/:id` | Sí | `admin` |
| `GET` | `/events` | No | — (soporta `search`, `categoryId`; sin paginación, devuelve el arreglo completo) |
| `GET` | `/events/:id` | No | — |
| `POST` | `/events` | Sí | `admin` |
| `PATCH` | `/events/:id` | Sí | `admin` |
| `DELETE` | `/events/:id` | Sí | `admin` |
| `GET` | `/favorites` | Sí | cualquiera |
| `POST` | `/favorites/:eventId` | Sí | cualquiera |
| `DELETE` | `/favorites/:eventId` | Sí | cualquiera |

Detalle completo de cada request/response (schemas, ejemplos, códigos de error) en [Swagger](#documentación-interactiva-swagger).

## Pruebas

```bash
npm run test        # unitarias
npm run test:e2e    # end-to-end
npm run test:cov    # con reporte de cobertura
```

## Migraciones

El esquema de base de datos se gestiona exclusivamente por migraciones de TypeORM (`synchronize: false`). Si modificas una entidad, genera la migración correspondiente antes de aplicar el cambio:

```bash
npm run migration:generate src/migrations/NombreDelCambio
npm run migration:run
```

No modifiques una migración ya aplicada en una base compartida; crea una nueva.
# HACKATON-V2

# PlanCity

Plataforma moderna para descubrir, gestionar y guardar eventos locales. El proyecto está dividido en dos aplicaciones:

- Frontend: React + Vite + TypeScript
- Backend: NestJS + TypeORM + PostgreSQL
- Autenticación: JWT con roles (`user` y `admin`)
- Contenedorización: Docker y Docker Compose

## Descripción general

PlanCity permite a los usuarios explorar eventos, filtrar por categoría, iniciar sesión, guardar favoritos y consultar su perfil. Los administradores además pueden crear, editar y eliminar eventos y categorías.

El proyecto está pensado como una solución completa para una app de eventos con enfoque en UX, seguridad y estructura modular.

---

## Arquitectura del proyecto

```text
┌──────────────────────────────────────────────────────────────────────┐
│                            PlanCity                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────┐        HTTP / JSON        ┌──────────────────┐ │
│  │ Frontend React     │ <----------------------> │ Backend NestJS    │ │
│  │ Vite + TypeScript  │                          │ TypeORM + PG      │ │
│  │ src/               │                          │ src/             │ │
│  └─────────┬──────────┘                          └─────────┬────────┘ │
│            │                                                  │          │
│            │                                                  │          │
│            └────────────── Docker / Docker Compose ───────────┘          │
│                                                                      │
│  Persistencia: PostgreSQL                                             │
│  Seguridad: JWT + RBAC                                                │
│  UI: React Router + Context API                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Stack tecnológico

### Frontend

| Tecnología | Uso |
|---|---|
| React 19 | UI del cliente |
| TypeScript | Tipado estático |
| Vite | Bundler y servidor de desarrollo |
| React Router | Rutas y protección de acceso |
| Tailwind CSS | Estilos y diseño |
| Axios | Peticiones HTTP |
| Vitest + Testing Library | Pruebas frontend |

### Backend

| Tecnología | Uso |
|---|---|
| NestJS | Framework API |
| TypeScript | Lógica del backend |
| PostgreSQL | Base de datos principal |
| TypeORM | ORM y migraciones |
| JWT + Passport | Autenticación segura |
| Swagger | Documentación interactiva |
| Jest + Supertest | Pruebas backend |

---

## Funcionalidades principales

### Usuario no autenticado
- Ver listado de eventos
- Filtrar eventos por nombre, categoría o texto
- Ver detalle de un evento
- Explorar categorías
- Registrarse o iniciar sesión

### Usuario autenticado (`user`)
- Guardar/quitar favoritos
- Ver lista de favoritos
- Consultar perfil
- Mantener sesión con JWT

### Administrador (`admin`)
- Crear eventos
- Editar eventos
- Eliminar eventos
- Crear categorías
- Editar categorías
- Eliminar categorías
- Acceso protegido por roles

---

## Estructura del repositorio

```text
HAKA/
├── README.md
├── docker-compose.yml
├── Plan-City/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.ts
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── lib/
│       ├── pages/
│       ├── services/
│       ├── test/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       ├── appRouter.tsx
│       ├── index.css
│       └── main.tsx
├── Plan-City-Api/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── eslint.config.mjs
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── data-source.ts
│   │   ├── main.ts
│   │   ├── common/
│   │   ├── migrations/
│   │   └── modules/
│   │       ├── auth/
│   │       ├── categories/
│   │       ├── events/
│   │       ├── favorites/
│   │       └── users/
│   └── test/
│       └── app.e2e-spec.ts
└── .git/
```

---

## Requisitos previos

Necesitas tener instalado:

- Node.js 18+ o 20+
- npm
- Docker y Docker Compose (opcional, recomendado)
- PostgreSQL accesible o un servicio cloud compatible (por ejemplo Supabase)

---

## Configuración de variables de entorno

### Frontend

Crea o ajusta el archivo `Plan-City/.env`:

```env
VITE_API_URL=http://localhost:3001
```

Docker Compose publica el backend NestJS en `localhost:3001` para evitar conflictos con servicios locales; el puerto interno del contenedor sigue siendo `3000`.

### Backend

Crea o ajusta el archivo `Plan-City-Api/.env` usando la plantilla de ejemplo:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:5432/postgres
JWT_SECRET=cambia-este-valor-por-uno-generado-aleatoriamente
JWT_EXPIRES_IN=1d
```

> Importante: `DATABASE_URL` debe apuntar a una base PostgreSQL válida. La app usa `ssl: { rejectUnauthorized: false }` en la conexión, compatible con servicios como Supabase.

---

## Instalación y ejecución

### Opción 1: Ejecutar con Docker Compose

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levanta:

- Frontend en http://localhost:5173
- Backend en http://localhost:3000

Para apagarlo:

```bash
docker-compose down
```

### Opción 2: Ejecutar cada proyecto por separado

#### 1) Backend

```bash
cd Plan-City-Api
npm install
npm run start:dev
```

#### 2) Frontend

```bash
cd Plan-City
npm install
npm run dev
```

---

## Scripts disponibles

### Frontend (`Plan-City`)

```bash
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Compila la app para producción
npm run preview  # Sirve la build localmente
npm run lint     # Ejecuta ESLint
npm test         # Ejecuta pruebas con Vitest
```

### Backend (`Plan-City-Api`)

```bash
npm run start:dev      # Ejecuta NestJS en modo watch
npm run start:debug    # Ejecuta en modo debug
npm run build          # Compila la API
npm run start:prod     # Ejecuta la build compilada
npm run lint           # Ejecuta ESLint
npm run test           # Ejecuta pruebas unitarias
npm run test:e2e       # Ejecuta pruebas e2e
npm run migration:run  # Aplica migraciones
npm run migration:generate <nombre>  # Genera una migración
npm run migration:revert # Revierte la última migración
```

---

## Base de datos y migraciones

El backend usa TypeORM con `synchronize: false` y migraciones para gestionar el esquema.

La migración inicial crea la estructura necesaria y semilla una cuenta de administrador por defecto.

### Cuenta admin por defecto

- Email: `admin@examen.com`
- Password: `Admin123!`

> Esta cuenta es útil para pruebas locales y desarrollo. En entornos reales se recomienda cambiarla antes de desplegar.

---

## Módulos principales del backend

### `auth`
- Registro de usuarios
- Login con JWT
- Logout (responde confirmación del lado cliente)
- Validación con Passport y JWT strategy

### `users`
- Perfil del usuario autenticado
- Consulta de datos del usuario actual
- Actualización de contraseña

### `categories`
- Listado y detalle de categorías
- CRUD completo
- Acceso restringido a `admin`

### `events`
- Listado y detalle de eventos
- Filtros por búsqueda y categoría
- CRUD completo
- Acceso restringido a `admin`

### `favorites`
- Añadir/quitar eventos favoritos
- Ver favoritos del usuario autenticado
- Prevención de duplicados

---

## Rutas y permisos

### Frontend (rutas)

| Ruta | Acceso |
|---|---|
| `/` | Público |
| `/events/:id` | Público |
| `/categories` | Público |
| `/categories/:id` | Público |
| `/login` | Público |
| `/register` | Público |
| `/favorites` | Requiere autenticación |
| `/profile` | Requiere autenticación |
| `/events/new` | Solo `admin` |
| `/events/:id/edit` | Solo `admin` |
| `/categories/new` | Solo `admin` |
| `/categories/:id/edit` | Solo `admin` |

### Backend (API)

| Método | Ruta | Autenticación | Rol |
|---|---|---|---|
| `POST` | `/auth/register` | No | - |
| `POST` | `/auth/login` | No | - |
| `POST` | `/auth/logout` | Sí | cualquiera |
| `GET` | `/users/me` | Sí | cualquiera |
| `GET` | `/categories` | No | - |
| `GET` | `/categories/:id` | No | - |
| `POST` | `/categories` | Sí | `admin` |
| `PATCH` | `/categories/:id` | Sí | `admin` |
| `DELETE` | `/categories/:id` | Sí | `admin` |
| `GET` | `/events` | No | - |
| `GET` | `/events/:id` | No | - |
| `POST` | `/events` | Sí | `admin` |
| `PATCH` | `/events/:id` | Sí | `admin` |
| `DELETE` | `/events/:id` | Sí | `admin` |
| `GET` | `/favorites` | Sí | cualquiera |
| `POST` | `/favorites/:eventId` | Sí | cualquiera |
| `DELETE` | `/favorites/:eventId` | Sí | cualquiera |

---

## Documentación Swagger

La API incluye documentación interactiva con Swagger.

Accede a:

```text
http://localhost:3000/api/docs
```

Allí puedes ver los endpoints, validaciones y probar la API directamente.

---

## Flujo de autenticación

1. El usuario se registra o inicia sesión.
2. El backend devuelve un JWT.
3. El frontend guarda el token y lo envía en el header:

```http
Authorization: Bearer <accessToken>
```

4. Las rutas protegidas verifican el token y validan el rol del usuario.

---

## Buenas prácticas y recomendaciones

- Mantén los secretos en archivos `.env` locales y no los subas al repositorio.
- Usa `npm run migration:run` después de cambiar entidades.
- Prueba la app con un usuario `admin` para validar CRUD.
- No reutilices tokens en producción sin política de expiración robusta.
- En despliegue real, cambia la contraseña del usuario admin y configura un secret JWT fuerte.

---

## Solución rápida de problemas

### El frontend no conecta con la API
- Verifica que `Plan-City/.env` tenga `VITE_API_URL` bien definido.
- Asegúrate de que el backend esté corriendo en el puerto 3000.

### Error de conexión a PostgreSQL
- Revisa `DATABASE_URL` en `Plan-City-Api/.env`.
- Comprueba que la base de datos esté accesible y el usuario tenga permisos.

### Error JWT o 401
- Revisa que el token esté incluido en cada petición protegida.
- Confirma que `JWT_SECRET` coincide con el entorno empleado.

### Puertos ocupados
- Cambia los puertos definidos en `docker-compose.yml` o en la configuración local.

---

## Resumen

PlanCity es un proyecto completo de gestión y descubrimiento de eventos, con:

- Frontend moderno y responsivo
- Backend modular y seguro
- Base de datos relacional con TypeORM
- Autenticación por JWT
- Roles de usuario y administrador
- Arquitectura preparada para extensión

Es una solución ideal para demos, proyectos académicos o MVPs de aplicaciones de eventos con enfoque en experiencia de usuario y administración.

---

## Créditos

Proyecto desarrollado como aplicación full-stack con React + NestJS, orientada a una experiencia de búsqueda, gestión y personalización de eventos comunitarios.

