import { router } from 'expo-router';

import { calculateAge, MONTHS } from '@/lib/birth-date';
import { routes } from '@/constants/routes';
import { useCompleteOnboarding } from '@/hooks/auth/use-complete-onboarding';
import { useOnboardingStore } from '@/store/onboarding';
import type { CompleteOnboardingRequest } from '@/types/patient.types';

/** Derived summary labels + submit handler for the onboarding confirmation screen. */
export function useOnboardingConfirmation() {
  const onboarding = useOnboardingStore();
  const completeOnboarding = useCompleteOnboarding();

  const age = calculateAge(onboarding.birthDay, onboarding.birthMonthIndex, onboarding.birthYear);
  const birthDateLabel = `${String(onboarding.birthDay).padStart(2, '0')} ${MONTHS[onboarding.birthMonthIndex]} ${onboarding.birthYear}`;
  const genderLabel =
    onboarding.gender === 'male' ? 'ذكر' : onboarding.gender === 'female' ? 'أنثى' : '—';

  const allergiesLabel =
    [...onboarding.allergies, onboarding.otherAllergy].filter(Boolean).join('، ') || '—';

  const handleConfirm = () => {
    if (!onboarding.gender) {
      router.push(routes.onboardingPersonalDetails);
      return;
    }

    const allergies = [...onboarding.allergies, onboarding.otherAllergy].filter(Boolean).join('، ');

    const payload: CompleteOnboardingRequest = {
      gender: onboarding.gender,
      dateOfBirth: new Date(
        Date.UTC(onboarding.birthYear, onboarding.birthMonthIndex, onboarding.birthDay)
      )
        .toISOString()
        .slice(0, 10),
      ...(onboarding.address ? { address: onboarding.address } : {}),
      ...(onboarding.bloodType ? { bloodType: onboarding.bloodType } : {}),
      ...(allergies ? { allergies } : {}),
      ...(onboarding.chronicConditions ? { chronicConditions: onboarding.chronicConditions } : {}),
      ...(onboarding.currentMedications
        ? { currentMedications: onboarding.currentMedications }
        : {}),
      ...(onboarding.notes ? { notes: onboarding.notes } : {}),
    };

    completeOnboarding.mutate(payload, {
      onSuccess: (patient) => {
        onboarding.reset();
        router.push({
          pathname: routes.onboardingComplete,
          params: { patientNumber: patient.patientNumber },
        });
      },
    });
  };

  return {
    onboarding,
    age,
    birthDateLabel,
    genderLabel,
    allergiesLabel,
    handleConfirm,
    isSubmitting: completeOnboarding.isPending,
  };
}
