import { router } from 'expo-router';
import { History, KeyRound, User } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { BottomTabInset } from '@/constants/theme';
import { LogoutButton } from '@/components/profile/logout-button';
import { PatientCodeCard } from '@/components/profile/patient-code-card';
import { ProfileHeaderCard } from '@/components/profile/profile-header-card';
import { ProfileMenuRow } from '@/components/profile/profile-menu-row';
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

        <View className="gap-3">
          <ProfileMenuRow
            icon={User}
            label="المعلومات الشخصية"
            onPress={() => router.push(routes.editProfile)}
          />
          <ProfileMenuRow
            icon={KeyRound}
            label="تغيير كلمة المرور"
            onPress={() => router.push(routes.changePassword)}
          />
          <ProfileMenuRow
            icon={History}
            label="الخط الزمني الطبي"
            onPress={() => router.push(routes.medicalTimeline)}
          />
        </View>

        <LogoutButton onPress={handleLogout} isLoggingOut={isLoggingOut} />
      </View>
    </ScrollView>
  );
}
