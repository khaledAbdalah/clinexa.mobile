import { router } from 'expo-router';
import { Calendar, ChevronLeft, FileText } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type Prescription = {
  id: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string | null;
  notes: string | null;
};

export function PrescriptionCard({ id, date, doctorName, doctorSpecialty, notes }: Prescription) {
  return (
    <Pressable
      onPress={() => router.push(routes.prescriptionDetail(id) as never)}
      className="bg-card border-border flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-80"
    >
      <View className="flex-1 flex-row items-start gap-3">
        <View className="bg-accent h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon as={FileText} size={20} className="text-primary" />
        </View>

        <View className="flex-1 items-start gap-1">
          <Text
            className="text-foreground text-base leading-6"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {doctorName}
          </Text>
          {doctorSpecialty ? (
            <Text
              className="text-muted-foreground text-xs leading-5"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {doctorSpecialty}
            </Text>
          ) : null}

          <View className="flex-row items-center gap-1.5 pt-0.5">
            <Icon as={Calendar} size={12} className="text-muted-foreground" />
            <Text
              className="text-muted-foreground text-xs"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {date}
            </Text>
          </View>

          {notes?.trim() ? (
            <View className="bg-muted mt-1.5 self-stretch rounded-xl px-3 py-2">
              <Text
                numberOfLines={2}
                className="text-muted-foreground text-xs leading-5"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {notes}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Icon as={ChevronLeft} size={18} className="text-muted-foreground shrink-0" />
    </Pressable>
  );
}
