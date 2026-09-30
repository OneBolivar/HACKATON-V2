// Este archivo contiene un objeto llamado tokenStorage que proporciona métodos para almacenar, recuperar y eliminar un token de acceso en el almacenamiento local del navegador (localStorage). 
// El token se usa para autenticar solicitudes a una API.
const TOKEN_KEY = 'accessToken';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};