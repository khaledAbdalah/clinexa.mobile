import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type PatientCodeCardProps = {
  patientNumber: string;
};

export function PatientCodeCard({ patientNumber }: PatientCodeCardProps) {
  return (
    <View className="bg-accent border-primary/15 items-center gap-2 rounded-3xl border p-6">
      <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
        رقم ملفك
      </Text>
      <Text className="text-foreground text-4xl" style={{ fontFamily: 'app-font-bold' }}>
        {patientNumber}
      </Text>
    </View>
  );
}
