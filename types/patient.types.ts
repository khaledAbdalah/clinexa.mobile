export type Gender = 'male' | 'female';

export interface Patient {
  id: string;
  patientNumber: string;
  dateOfBirth: string | null;
  gender: Gender;
  address: string | null;
  allergies: string[] | null;
  chronicConditions: string[] | null;
  currentMedications: string[] | null;
  bloodType: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  fullName: string;
  phone: string;
}

export interface CompleteOnboardingRequest {
  dateOfBirth?: string;
  gender: Gender;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  bloodType?: string;
  notes?: string;
}

export type AppointmentStatus = 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledDate: string;
  queueNumber: number | null;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  doctor?: { id: string; fullName: string };
}

export interface PrescriptionItem {
  id: string;
  drugId: string;
  dosage: string | null;
  instructions: string | null;
}

export interface Prescription {
  id: string;
  encounterId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  items?: PrescriptionItem[];
}

export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid' | 'cancelled';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  encounterId: string;
  subtotal: number;
  discountAmount: number;
  discountReason: string | null;
  total: number;
  remainingAmount: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string | null;
  items?: unknown[];
  payments?: Payment[];
  installments?: unknown[];
}

export type TimelineEntryType =
  'appointment' | 'encounter' | 'prescription' | 'invoice' | 'payment';

export interface TimelineEntry {
  type: TimelineEntryType;
  id: string;
  date: string;
  data: Appointment | Prescription | Invoice | Payment | Record<string, unknown>;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}
