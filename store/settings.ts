import { create } from 'zustand';
import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import type { Setting, SettingsState } from '@/types/store.types';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  loading: true,

  get: (key) => get().settings[key],

  isEnabled: (key) => get().settings[key] !== false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await api.get<{ data: Setting[] }>(endpoints.settings);
      const settings = Object.fromEntries(
        (res.data.data ?? []).map((setting) => [setting.key, setting.value])
      );
      set({ settings, loading: false });
    } catch {
      set({ settings: {}, loading: false });
    }
  },
}));
