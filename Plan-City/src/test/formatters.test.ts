// Prueba unitaria para comprobar que la función formatCurrency siempre devuelve el mismo resultado ante los mismos datos.

import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../utils/formatters';

describe('formatCurrency - Prueba Unitaria', () => {
  // Prueba de caso ideal
  it('debe formatear un número entero positivo con separadores de miles y signo $', () => {
    const resultado = formatCurrency(25000);
    expect(resultado).toBe('$25.000');
  });

  // Prueba de casos límite y valores no válidos
  it('debe retornar $0 ante números negativos o valores NaN', () => {
    expect(formatCurrency(-100)).toBe('$0');
    expect(formatCurrency(NaN)).toBe('$0');
  });
});