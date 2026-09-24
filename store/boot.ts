import { create } from 'zustand';

type BootState = {
  entryResolved: boolean;
  markEntryResolved: () => void;
  /** Home screen finished its first load (data or error) — the splash waits on this
   * for users landing on home, so it never fades onto the loading skeleton. */
  homeReady: boolean;
  markHomeReady: () => void;
};

// group-index routes (e.g. `(onboarding)/index`) resolve to '/', so pathname
// alone can't tell us whether the entry redirect has run yet.
export const useBootStore = create<BootState>((set) => ({
  entryResolved: false,
  markEntryResolved: () => set({ entryResolved: true }),
  homeReady: false,
  markHomeReady: () => set({ homeReady: true }),
}));
