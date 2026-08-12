const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicIndicDigits(value: string): string {
  return value
    .replace(/(\d)\.(\d)/g, '$1٫$2')
    .replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}
