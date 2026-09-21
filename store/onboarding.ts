import { create } from 'zustand';

type Gender = 'male' | 'female';

type OnboardingState = {
  gender: Gender | null;
  birthDay: number;
  birthMonthIndex: number;
  birthYear: number;
  address: string;
  bloodType: string | null;
  allergies: string[];
  otherAllergy: string;
  chronicConditions: string;
  currentMedications: string;
  notes: string;
  update: (patch: Partial<Omit<OnboardingState, 'update' | 'reset'>>) => void;
  reset: () => void;
};

const initialState = {
  gender: null,
  birthDay: 1,
  birthMonthIndex: 0,
  birthYear: 2000,
  address: '',
  bloodType: null,
  allergies: [],
  otherAllergy: '',
  chronicConditions: '',
  currentMedications: '',
  notes: '',
} satisfies Omit<OnboardingState, 'update' | 'reset'>;

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  update: (patch) => set(patch),
  reset: () => set(initialState),
}));
