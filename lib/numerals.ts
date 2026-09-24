const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicIndicDigits(value: string): string {
  return value
    .replace(/(\d)\.(\d)/g, '$1٫$2')
    .replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}

/**
 * Recursively converts Western digits to Arabic-Indic in the string/number leaves of React
 * children, leaving elements (e.g. nested `<Text>`) untouched - they localize themselves.
 */
export function localizeDigits(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') return toArabicIndicDigits(children);
  if (typeof children === 'number') return toArabicIndicDigits(String(children));
  if (Array.isArray(children)) return children.map(localizeDigits);
  return children;
}
