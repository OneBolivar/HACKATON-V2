
export type UserRole = 'admin' | 'user';

// Objeto de transferencia de datos (DTO) para un usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

// Objeto de transferencia de datos (DTO) para la respuesta de autenticación
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Objeto de transferencia de datos (DTO) para las credenciales de inicio de sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

// Objeto de transferencia de datos (DTO) para las credenciales de registro
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}