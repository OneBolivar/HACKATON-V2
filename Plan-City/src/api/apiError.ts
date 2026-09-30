
//Este export sirve para exportar la clase ApiError y poder usarla en otros archivos del proyecto. 
// La clase ApiError extiende la clase Error de JavaScript y agrega propiedades adicionales para manejar errores de API de manera más específica.
export class ApiError extends Error {
  public status: number;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 500, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}