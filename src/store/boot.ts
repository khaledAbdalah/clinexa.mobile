import { create } from 'zustand';

type BootState = {
  entryResolved: boolean;
  markEntryResolved: () => void;
};

// group-index routes (e.g. `(onboarding)/index`) resolve to '/', so pathname
// alone can't tell us whether the entry redirect has run yet.
export const useBootStore = create<BootState>((set) => ({
  entryResolved: false,
  markEntryResolved: () => set({ entryResolved: true }),
}));
