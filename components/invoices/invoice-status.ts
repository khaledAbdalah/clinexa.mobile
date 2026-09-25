import type { InstallmentStatus, InvoiceStatus } from '@/types/invoice.types';

// Solid tints only — color/opacity classNames (`bg-primary/10`) trigger the NativeWind
// "navigation context" crash in this project.
export const INVOICE_STATUS: Record<InvoiceStatus, { label: string; chip: string; text: string }> =
  {
    paid: { label: 'مدفوعة', chip: 'bg-accent', text: 'text-primary' },
    partial: { label: 'مدفوعة جزئياً', chip: 'bg-amber-100', text: 'text-amber-700' },
    unpaid: { label: 'غير مدفوعة', chip: 'bg-red-100', text: 'text-red-700' },
  };

export const INSTALLMENT_STATUS: Record<
  InstallmentStatus,
  { label: string; chip: string; text: string }
> = {
  paid: { label: 'مدفوع', chip: 'bg-accent', text: 'text-primary' },
  pending: { label: 'لم يُدفع بعد', chip: 'bg-muted', text: 'text-muted-foreground' },
};

// `Payment.method` is free text typed at the clinic desk (the desktop app suggests
// "cash, vodafone_cash, instapay..."), so only the known values are translated and
// anything else is shown as entered.
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'كاش',
  vodafone_cash: 'فودافون كاش',
  instapay: 'InstaPay',
  card: 'بطاقة بنكية',
  visa: 'بطاقة بنكية',
};

export function paymentMethodLabel(method: string | null | undefined) {
  const value = method?.trim();
  if (!value) return 'دفعة';
  return PAYMENT_METHOD_LABELS[value.toLowerCase()] ?? value;
}
