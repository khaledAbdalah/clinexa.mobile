export type Gender = 'male' | 'female';

export interface Patient {
  id: string;
  patientNumber: string;
  dateOfBirth: string | null;
  gender: Gender;
  address: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  currentMedications: string | null;
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
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  bloodType?: string;
  notes?: string;
}

/** All fields optional — `PATCH /patient/profile` is a partial update. Does not accept `phone`/`patientNumber`. */
export interface UpdatePatientProfileRequest {
  fullName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  bloodType?: string;
  notes?: string;
}

export interface PatientHomeQueue {
  appointmentId: string;
  queueNumber: number;
  doctorName: string;
  doctorSpecialty: string | null;
  scheduledDate: string;
  patientsAhead: number;
  currentQueueNumber: number | null;
}

export interface PatientHomeInstallment {
  installmentId: string;
  amount: number;
  dueDate: string;
  totalInstallments: number;
}

export interface PatientHomeLastVisit {
  date: string;
  doctorName: string;
  doctorSpecialty: string | null;
  diagnosis: string | null;
}

export interface PatientHome {
  queue: PatientHomeQueue | null;
  balanceDue: number | null;
  nextInstallment: PatientHomeInstallment | null;
  lastVisit: PatientHomeLastVisit | null;
}
