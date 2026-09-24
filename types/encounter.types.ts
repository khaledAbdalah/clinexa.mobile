import type { Doctor } from '@/types/appointment.types';
import type { Prescription } from '@/types/prescription.types';

export interface Encounter {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  complaint: string;
  diagnosis: string | null;
  notes: string | null;
  plan: string | null;
  followUpInDays: number | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  doctor?: Doctor;
  prescription?: Prescription;
}
