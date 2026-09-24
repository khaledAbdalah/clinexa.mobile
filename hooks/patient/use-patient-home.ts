import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { useDetailQuery } from '@/hooks/queries/use-detail-query';
import type { Service } from '@/types/appointment.types';
import type { PatientHome } from '@/types/patient.types';

export interface PatientHomeScreenData {
  home: PatientHome;
  unreadCount: number;
  services: Service[];
}

async function fetchPatientHomeScreen(): Promise<PatientHomeScreenData> {
  const [homeRes, unreadRes, servicesRes] = await Promise.allSettled([
    api.get<{ data: PatientHome }>(endpoints.patient.home),
    api.get<{ data: { count: number } }>(endpoints.notifications.unreadCount),
    api.get<{ data: Service[] }>(endpoints.patient.services),
  ]);

  if (homeRes.status === 'rejected') throw homeRes.reason;
  if (unreadRes.status === 'rejected') console.warn('Home: unread count failed', unreadRes.reason);
  if (servicesRes.status === 'rejected') console.warn('Home: services failed', servicesRes.reason);

  return {
    home: homeRes.value.data.data,
    unreadCount: unreadRes.status === 'fulfilled' ? unreadRes.value.data.data.count : 0,
    services: servicesRes.status === 'fulfilled' ? servicesRes.value.data.data : [],
  };
}

export function usePatientHomeScreen(enabled = true) {
  return useDetailQuery<PatientHomeScreenData>({
    queryKey: ['patient', 'home-screen'],
    queryFn: fetchPatientHomeScreen,
    enabled,
  });
}
