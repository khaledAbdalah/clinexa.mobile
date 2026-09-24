/** Mirrors `updateWorkingHoursSettingValidator` in `api/app/validators/admin/setting.ts` — one entry per open day. */
export interface WorkingHoursEntry {
  dayOfWeek: number;
  /** 24h "HH:mm" */
  startsAt: string;
  /** 24h "HH:mm" */
  endsAt: string;
}
