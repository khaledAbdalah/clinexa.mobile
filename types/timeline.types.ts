import type { Appointment } from '@/types/appointment.types';
import type { Encounter } from '@/types/encounter.types';
import type { Invoice, Payment } from '@/types/invoice.types';
import type { Prescription } from '@/types/prescription.types';

export type TimelineEntryType =
  'appointment' | 'encounter' | 'prescription' | 'invoice' | 'payment';

export type TimelineEntry =
  | { type: 'appointment'; id: string; date: string; data: Appointment }
  | { type: 'encounter'; id: string; date: string; data: Encounter }
  | { type: 'prescription'; id: string; date: string; data: Prescription }
  | { type: 'invoice'; id: string; date: string; data: Invoice }
  | { type: 'payment'; id: string; date: string; data: Payment };
