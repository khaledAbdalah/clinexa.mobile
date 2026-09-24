import * as Clipboard from 'expo-clipboard';
import { Pressable } from 'react-native';

import { useToast } from '@/hooks/use-toast';
import { Text } from '@/components/ui/text';

type PatientCodeCardProps = {
  patientNumber: string;
};

export function PatientCodeCard({ patientNumber }: PatientCodeCardProps) {
  const { showSuccess } = useToast();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(patientNumber);
    showSuccess('تم نسخ رقم الملف');
  };

  return (
    <Pressable
      onLongPress={handleCopy}
      className="bg-accent border-primary/15 items-center gap-2 rounded-3xl border p-6 active:opacity-70"
    >
      <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
        رقم ملفك
      </Text>
      <Text className="text-foreground text-4xl" style={{ fontFamily: 'app-font-bold' }}>
        {patientNumber}
      </Text>
    </Pressable>
  );
}
