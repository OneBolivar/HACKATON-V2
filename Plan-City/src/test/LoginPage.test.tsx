/**
 * Prueba de integración que evalúa el flujo de inicio de sesión simulando la interacción
 * de un usuario real sobre el formulario mediante React Testing Library y userEvent.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import * as authService from '../services/auth.service';
import type { AuthResponse } from '../types';

// Aislamos únicamente la capa de comunicación HTTP para no llamar al backend real
vi.mock('../services/auth.service');

describe('LoginPage - Prueba de Integración', () => {
  it('permite al usuario escribir sus credenciales y ejecutar loginService con los datos correctos', async () => {
    const user = userEvent.setup();

    //  Definimos la respuesta simulada que cumple estrictamente con el contrato AuthResponse
    const mockAuthResponse: AuthResponse = {
      accessToken: 'token-falso-de-prueba',
      user: {
        id: '123-uuid',
        name: 'Juan Bolívar',
        email: 'juan@test.com',
        role: 'user',
        createdAt: '2026-08-31T00:00:00.000Z',
      },
    };

    // Espiamos loginService para retornar el mock resuelto
    vi.spyOn(authService, 'loginService').mockResolvedValueOnce(mockAuthResponse);

    //  Montamos el componente con sus proveedores necesarios
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    //  Capturamos los campos y el botón por sus roles y placeholders accesibles
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    //  Simulamos la escritura del usuario y el envío del formulario
    await user.type(emailInput, 'juan@test.com');
    await user.type(passwordInput, '123456');
    await user.click(submitButton);

    //  Verificamos que el servicio haya sido invocado con los valores ingresados
    expect(authService.loginService).toHaveBeenCalledWith({
      email: 'juan@test.com',
      password: '123456',
    });
  });
});