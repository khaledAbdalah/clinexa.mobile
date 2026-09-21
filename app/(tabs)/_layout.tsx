import { Tabs } from 'expo-router/js-tabs';

import { SlidingTabBar } from '@/components/sliding-tab-bar';
import { useMarkEntryResolved } from '@/hooks/use-mark-entry-resolved';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function TabLayout() {
  useRequireAuth();
  useMarkEntryResolved();

  return (
    <Tabs tabBar={(props) => <SlidingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="appointments" />
      <Tabs.Screen name="prescriptions" />
      <Tabs.Screen name="invoices" />
    </Tabs>
  );
}
