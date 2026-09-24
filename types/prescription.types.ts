import type { Encounter } from '@/types/encounter.types';

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  drugId: string;
  drugName: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Prescription {
  id: string;
  encounterId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  items?: PrescriptionItem[];
  encounter?: Encounter;
}
