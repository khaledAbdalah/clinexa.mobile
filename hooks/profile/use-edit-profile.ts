import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { calculateAge } from '@/lib/birth-date';
import { useUpdatePatientProfile } from '@/hooks/patient/use-update-patient-profile';
import { usePatientProfile } from '@/hooks/patient/use-patient-profile';
import type { Gender, UpdatePatientProfileRequest } from '@/types/patient.types';

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const NO_ALLERGIES = 'لا يوجد';

/** Mirrors `app/(onboarding)/onboarding-medical-info.tsx`'s allergy chip list — kept in sync
 * manually since that screen isn't touched here and doesn't export its list. */
export const ALLERGY_OPTIONS: { label: string; activeClassName: string }[] = [
  { label: 'بنسلين', activeClassName: 'bg-amber-100 border-amber-400' },
  { label: 'لاكتوز', activeClassName: 'bg-cyan-100 border-cyan-400' },
  { label: 'مكسرات', activeClassName: 'bg-lime-100 border-lime-400' },
  { label: 'أسبرين', activeClassName: 'bg-sky-100 border-sky-400' },
  { label: 'غبار', activeClassName: 'bg-rose-100 border-rose-400' },
  { label: NO_ALLERGIES, activeClassName: 'bg-muted border-muted-foreground/40' },
];

const KNOWN_ALLERGY_LABELS = ALLERGY_OPTIONS.map((option) => option.label);

const CURRENT_YEAR = new Date().getFullYear();

function parseDateOfBirth(dateOfBirth: string | null) {
  if (!dateOfBirth) return { day: 1, monthIndex: 0, year: 2000 };
  const [yearStr, monthStr, dayStr] = dateOfBirth.split('-');
  const year = Number(yearStr) || 2000;
  const monthIndex = Math.min(Math.max((Number(monthStr) || 1) - 1, 0), 11);
  const day = Number(dayStr) || 1;
  return { day, monthIndex, year };
}

/** Reverses onboarding's `[...allergies, otherAllergy].join('، ')` into chips + free text. */
function parseAllergies(allergies: string | null) {
  if (!allergies) return { selected: [] as string[], other: '' };
  const parts = allergies
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const selected = parts.filter((part) => KNOWN_ALLERGY_LABELS.includes(part));
  const other = parts.filter((part) => !KNOWN_ALLERGY_LABELS.includes(part)).join('، ');
  return { selected, other };
}

/** Local form state + diff-based submit for the personal-information edit screen. Pre-fills
 * from `usePatientProfile()` once (a background refetch after submit must not clobber edits). */
export function useEditProfile() {
  const { data: patient, isLoading } = usePatientProfile();
  const updateProfile = useUpdatePatientProfile();

  const initialized = useRef(false);

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dayText, setDayText] = useState('01');
  const [monthIndex, setMonthIndex] = useState(0);
  const [yearText, setYearText] = useState(String(CURRENT_YEAR));
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  useEffect(() => {
    if (!patient || initialized.current) return;
    initialized.current = true;

    setFullName(patient.fullName);
    setGender(patient.gender);
    const parsedDate = parseDateOfBirth(patient.dateOfBirth);
    setDayText(String(parsedDate.day).padStart(2, '0'));
    setMonthIndex(parsedDate.monthIndex);
    setYearText(String(parsedDate.year));
    setAddress(patient.address ?? '');
    setBloodType(patient.bloodType);
    const parsedAllergies = parseAllergies(patient.allergies);
    setSelectedAllergies(parsedAllergies.selected);
    setOtherAllergy(parsedAllergies.other);
    setChronicConditions(patient.chronicConditions ?? '');
    setCurrentMedications(patient.currentMedications ?? '');
    setNotes(patient.notes ?? '');
  }, [patient]);

  const day = Math.min(Math.max(Number(dayText) || 1, 1), 31);
  const year = Math.min(Math.max(Number(yearText) || CURRENT_YEAR, 1900), CURRENT_YEAR);
  const age = calculateAge(day, monthIndex, year);

  const toggleAllergy = (label: string) => {
    if (label === NO_ALLERGIES) {
      setSelectedAllergies((current) => (current.includes(NO_ALLERGIES) ? [] : [NO_ALLERGIES]));
      return;
    }
    setSelectedAllergies((current) => {
      const withoutNoAllergies = current.filter((item) => item !== NO_ALLERGIES);
      return withoutNoAllergies.includes(label)
        ? withoutNoAllergies.filter((item) => item !== label)
        : [...withoutNoAllergies, label];
    });
  };

  const handleSelectMonth = (value: number) => {
    setMonthIndex(value);
    setIsMonthPickerOpen(false);
  };

  const handleSubmit = () => {
    if (!patient) return;

    const dateOfBirth = new Date(Date.UTC(year, monthIndex, day)).toISOString().slice(0, 10);
    const allergies = [...selectedAllergies, otherAllergy].filter(Boolean).join('، ');

    const payload: UpdatePatientProfileRequest = {};
    if (fullName.trim() && fullName !== patient.fullName) payload.fullName = fullName;
    if (gender && gender !== patient.gender) payload.gender = gender;
    if (dateOfBirth !== patient.dateOfBirth) payload.dateOfBirth = dateOfBirth;
    if (address !== (patient.address ?? '')) payload.address = address;
    if (bloodType && bloodType !== patient.bloodType) payload.bloodType = bloodType;
    if (allergies !== (patient.allergies ?? '')) payload.allergies = allergies;
    if (chronicConditions !== (patient.chronicConditions ?? ''))
      payload.chronicConditions = chronicConditions;
    if (currentMedications !== (patient.currentMedications ?? ''))
      payload.currentMedications = currentMedications;
    if (notes !== (patient.notes ?? '')) payload.notes = notes;

    if (Object.keys(payload).length === 0) {
      router.back();
      return;
    }

    updateProfile.mutate(payload, {
      onSuccess: () => router.back(),
    });
  };

  return {
    isLoading,
    fullName,
    setFullName,
    gender,
    setGender,
    dayText,
    setDayText,
    monthIndex,
    yearText,
    setYearText,
    age,
    isMonthPickerOpen,
    setIsMonthPickerOpen,
    handleSelectMonth,
    address,
    setAddress,
    bloodType,
    setBloodType,
    selectedAllergies,
    toggleAllergy,
    otherAllergy,
    setOtherAllergy,
    chronicConditions,
    setChronicConditions,
    currentMedications,
    setCurrentMedications,
    notes,
    setNotes,
    handleSubmit,
    isSubmitting: updateProfile.isPending,
  };
}
