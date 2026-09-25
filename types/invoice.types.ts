import type { Encounter } from '@/types/encounter.types';

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  serviceId: string | null;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
}

export type InstallmentStatus = 'pending' | 'paid';

export interface Installment {
  id: string;
  invoiceId: string;
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
  paidAt: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  encounterId: string;
  subtotal: number;
  // `InvoiceSchema.discountAmount` is `number | null` (api/database/schema.ts) — the
  // mobile type wrongly declared it non-nullable.
  discountAmount: number | null;
  discountReason: string | null;
  total: number;
  remainingAmount: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string | null;
  items?: InvoiceItem[];
  payments?: Payment[];
  installments?: Installment[];
  encounter?: Encounter;
}
