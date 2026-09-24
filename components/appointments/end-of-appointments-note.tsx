import { View } from 'react-native';

import { Text } from '@/components/ui/text';

/** Pagination footer shown once the "past" list has no more pages left — distinct from
 * `NoMoreAppointmentsCard`, which says there are no past appointments *at all* (the
 * `ListEmptyComponent` case). Reusing that card here for "you've reached the end" would
 * read as "you have no past appointments" directly under appointments the list just
 * rendered — a small text note instead of another full card avoids that contradiction. */
export function EndOfAppointmentsNote() {
  return (
    <View className="items-center py-2">
      <Text className="text-muted-foreground text-xs" style={{ fontFamily: 'app-font-semibold' }}>
        وصلت لآخر مواعيدك السابقة
      </Text>
    </View>
  );
}
