/**
 * Formatea un número como valor monetario con separador de miles
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount < 0) {
    return '$0';
  }
  // Formatea los miles con punto de manera consistente
  const formattedNumber = Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `$${formattedNumber}`;
}