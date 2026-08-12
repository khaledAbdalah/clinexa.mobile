const CURRENCY_SYMBOL = 'ج.م';

export function useCurrency() {
  const formatPrice = (amount: number | string | null | undefined) => {
    const value = Number(amount ?? 0);
    // Drop trailing zeros (70 not 70.00) while keeping up to 2 decimals.
    const formatted = Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} ${CURRENCY_SYMBOL}`;
  };

  return { formatPrice };
}
