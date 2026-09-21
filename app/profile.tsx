import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { LogoutButton } from '@/components/profile/logout-button';
import { PatientCodeCard } from '@/components/profile/patient-code-card';
import { ProfileHeaderCard } from '@/components/profile/profile-header-card';
import { TabHeader } from '@/components/shared/tab-header';
import { useLogout } from '@/hooks/auth/use-logout';
import { usePatientProfile } from '@/hooks/patient/use-patient-profile';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useAuthStore } from '@/store/auth';

export default function ProfileScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { handleLogout, isLoggingOut } = useLogout();
  const { data: patient } = usePatientProfile();

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + BottomTabInset,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <TabHeader title="الملف الشخصي" />

      <View className="mt-2 gap-4">
        <ProfileHeaderCard fullName={user.fullName} initials={user.initials} phone={user.phone} />
        {patient && <PatientCodeCard patientNumber={patient.patientNumber} />}
        <LogoutButton onPress={handleLogout} isLoggingOut={isLoggingOut} />
      </View>
    </ScrollView>
  );
}
