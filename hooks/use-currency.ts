import { useSettingsStore } from '@/store/settings';
import { SettingKeys } from '@/constants/settings.constant';

const DEFAULT_CURRENCY_SYMBOL = 'ج.م';

/** Reactive currency formatter driven by the admin-configured `currency_symbol` setting. */
export function useCurrency() {
  const symbol = useSettingsStore((state) => state.get(SettingKeys.CURRENCY_SYMBOL));
  const resolvedSymbol = typeof symbol === 'string' && symbol ? symbol : DEFAULT_CURRENCY_SYMBOL;

  const formatPrice = (amount: number | string | null | undefined) => {
    const value = Number(amount ?? 0);
    // Drop trailing zeros (70 not 70.00) while keeping up to 2 decimals.
    const formatted = Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} ${resolvedSymbol}`;
  };

  return { formatPrice };
}
