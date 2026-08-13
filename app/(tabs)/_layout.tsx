import { Tabs } from 'expo-router/js-tabs';

import { SlidingTabBar } from '@/components/sliding-tab-bar';

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <SlidingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}
