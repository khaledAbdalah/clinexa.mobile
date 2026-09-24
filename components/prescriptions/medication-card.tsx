import { Info, Pill } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { PrescriptionItem } from '@/types/prescription.types';

type MedicationCardProps = {
  item: PrescriptionItem;
};

export function MedicationCard({ item }: MedicationCardProps) {
  const facts = [
    { label: 'الجرعة', value: item.dosage },
    { label: 'عدد المرات', value: item.frequency },
    { label: 'المدة', value: item.duration },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value?.trim()));

  return (
    <View className="bg-card border-border mx-6 gap-3.5 rounded-2xl border p-4">
      <View className="flex-row items-start gap-3">
        <View className="bg-accent h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon as={Pill} size={18} className="text-primary" />
        </View>

        <View className="min-h-10 flex-1 justify-center">
          <Text
            className="text-foreground text-base leading-6"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {item.drugName}
          </Text>
        </View>
      </View>

      {facts.length > 0 ? (
        <View className="border-border gap-2.5 border-t pt-3.5">
          {facts.map((fact) => (
            <View key={fact.label} className="flex-row items-start gap-3">
              <Text
                className="text-muted-foreground w-20 shrink-0 text-xs leading-6"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {fact.label}
              </Text>
              <Text
                className="text-foreground flex-1 text-sm leading-6"
                style={{ fontFamily: 'app-font-bold' }}
              >
                {fact.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {item.instructions?.trim() ? (
        <View className="bg-muted flex-row items-start gap-2 rounded-xl px-3 py-2.5">
          <View className="h-6 justify-center">
            <Icon as={Info} size={14} className="text-muted-foreground" />
          </View>
          <Text
            className="text-foreground flex-1 text-sm leading-6"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {/* Nested so the label flows inline and long instructions wrap under it. */}
            <Text
              className="text-foreground text-sm leading-6"
              style={{ fontFamily: 'app-font-bold' }}
            >
              ملاحظة:{' '}
            </Text>
            {item.instructions}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
