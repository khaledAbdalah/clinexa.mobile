import { addDays, startOfDay } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';

import { useBookAppointment } from '@/hooks/appointments/use-book-appointment';
import { useDoctors } from '@/hooks/appointments/use-doctors';
import { useServices } from '@/hooks/appointments/use-services';
import { useUpcomingBookedAppointments } from '@/hooks/appointments/use-upcoming-booked-appointments';
import type { Doctor, Service } from '@/types/appointment.types';

/** How far ahead the calendar lets a patient book (≈3 months). */
const MAX_BOOKING_DAYS_AHEAD = 365;

/** Local form state for `app/book-appointment.tsx`: doctor selection, calendar
 * bounds (working days + booking window), notes, and submit — mirrors
 * `useEditProfile`'s pattern of owning all screen state in one hook. */
export function useBookAppointmentForm() {
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const bookAppointment = useBookAppointment();
  // Pre-selected from the home services carousel.
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(serviceId ?? null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const selectedDoctor = useMemo(
    () => doctors?.find((doctor) => doctor.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  const selectedService = useMemo(
    () => services?.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const workingDays = useMemo(
    () => new Set(selectedDoctor?.workingHours?.map((entry) => entry.dayOfWeek) ?? []),
    [selectedDoctor]
  );
  // Computed once per mount — a screen left open past midnight is an edge case
  // the backend's own date validation already covers.
  const [minDate] = useState(() => startOfDay(new Date()));
  const maxDate = useMemo(() => addDays(minDate, MAX_BOOKING_DAYS_AHEAD), [minDate]);

  const { data: bookedAppointments } = useUpcomingBookedAppointments(Boolean(selectedDoctorId));

  const disabledDates = useMemo(() => {
    const dates = new Set<string>();
    if (!selectedDoctorId || !bookedAppointments) return dates;

    for (const appointment of bookedAppointments) {
      // Rule 1: same doctor, same day.
      if (appointment.doctorId === selectedDoctorId) {
        dates.add(appointment.scheduledDate);
      }

      if (selectedServiceId && appointment.serviceId === selectedServiceId) {
        dates.add(appointment.scheduledDate);
      }
    }

    return dates;
  }, [bookedAppointments, selectedDoctorId, selectedServiceId]);

  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctorId(doctor.id);
    // Reset date when switching doctors — the old selection may not be valid
    // for the newly picked doctor's working days.
    setSelectedDate(null);
  };

  const changeDoctor = () => {
    setSelectedDoctorId(null);
    setSelectedDate(null);
  };

  // Service is optional and independent of the doctor/date, so picking one is
  // just a toggle — selecting the already-selected service clears it (same as
  // explicitly choosing "بدون خدمة محددة").
  const selectService = (service: Service) => {
    setSelectedServiceId((current) => (current === service.id ? null : service.id));
  };

  const clearService = () => setSelectedServiceId(null);

  const canSubmit =
    Boolean(selectedDoctorId && selectedDate) &&
    !(selectedDate && disabledDates.has(selectedDate)) &&
    !bookAppointment.isPending;

  const handleSubmit = () => {
    if (!selectedDoctorId || !selectedDate) return;

    bookAppointment.mutate(
      {
        doctorId: selectedDoctorId,
        scheduledDate: selectedDate,
        notes: notes.trim() || undefined,
        serviceId: selectedServiceId ?? undefined,
      },
      {
        onSuccess: () => router.back(),
      }
    );
  };

  return {
    doctors,
    isLoadingDoctors,
    selectedDoctor,
    selectDoctor,
    changeDoctor,
    services,
    isLoadingServices,
    selectedService,
    selectService,
    clearService,
    workingDays,
    minDate,
    maxDate,
    disabledDates,
    selectedDate,
    setSelectedDate,
    notes,
    setNotes,
    canSubmit,
    isSubmitting: bookAppointment.isPending,
    handleSubmit,
  };
}
