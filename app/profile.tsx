import { router } from 'expo-router';
import { History, KeyRound, MapPin, Trash2, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { BottomTabInset } from '@/constants/theme';
import { DeleteAccountSheet } from '@/components/profile/delete-account-sheet';
import { LogoutButton } from '@/components/profile/logout-button';
import { PatientCodeCard } from '@/components/profile/patient-code-card';
import { ProfileHeaderCard } from '@/components/profile/profile-header-card';
import { ProfileMenuRow } from '@/components/profile/profile-menu-row';
import { TabHeader } from '@/components/shared/tab-header';
import { useLogout } from '@/hooks/auth/use-logout';
import { usePatientProfile } from '@/hooks/patient/use-patient-profile';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { initials } from '@/lib/initials';
import { useAuthStore } from '@/store/auth';

export default function ProfileScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { handleLogout, isLoggingOut } = useLogout();
  const { data: patient } = usePatientProfile();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <ScrollView
        className="bg-background flex-1"
        style={{ paddingTop: insets.top }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + BottomTabInset,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TabHeader title="الملف الشخصي" />

        <View className="mt-2 gap-4 px-6">
          <ProfileHeaderCard
            fullName={user.fullName}
            initials={initials(user.fullName) ?? '؟'}
            phone={user.phone}
          />
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
              label="السجل المرضي"
              onPress={() => router.push(routes.medicalTimeline)}
            />
            <ProfileMenuRow
              icon={MapPin}
              label="معلومات العيادة"
              onPress={() => router.push(routes.clinicInfo)}
            />
          </View>

          <LogoutButton onPress={handleLogout} isLoggingOut={isLoggingOut} />

          <View className="border-border mt-2 border-t pt-4">
            <ProfileMenuRow
              icon={Trash2}
              label="حذف الحساب"
              destructive
              onPress={() => setIsDeleteOpen(true)}
            />
          </View>
        </View>
      </ScrollView>
      {/* Outside the ScrollView: a Modal's touches still bubble through its React ancestors, and this
          ScrollView's default keyboardShouldPersistTaps="never" swallowed the first tap while the
          keyboard was open, dismissing it instead of running the button's action. */}
      <DeleteAccountSheet visible={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}
