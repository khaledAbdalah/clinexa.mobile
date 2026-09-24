export type AppointmentStatus = 'booked' | 'completed' | 'cancelled';

export interface CreateAppointmentRequest {
  doctorId: string;
  scheduledDate?: string;
  notes?: string;
  serviceId?: string;
}

export interface DoctorWorkingHour {
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialty: string | null;
  createdAt: string;
  updatedAt: string | null;
  workingHours?: DoctorWorkingHour[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledDate: string;
  queueNumber: number | null;
  status: AppointmentStatus;
  notes: string | null;
  /** Snapshot of the booked service; null when booked without one. */
  serviceId?: string | null;
  serviceName?: string | null;
  servicePrice?: number | null;
  createdAt: string;
  updatedAt: string | null;
  doctor?: Doctor;
}

/** A bookable clinic service (e.g. "كشف", "أشعة") — patient-facing subset of
 * the admin services catalog (`GET /patient/services`), active services only. */
export interface Service {
  id: string;
  name: string;
  price: number;
}
