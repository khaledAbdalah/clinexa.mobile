import { Stethoscope } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/appointment.types';

/** Service selection card for the optional service step of
 * `app/book-appointment.tsx` — same look as the home screen's services
 * carousel (icon, name, price), with a highlighted state when selected.
 * Meant to live inside a horizontal `ScrollView`. */
export function ServiceOptionCard({
  service,
  selected,
  onPress,
}: {
  service: Service;
  selected: boolean;
  onPress: () => void;
}) {
  const { formatPrice } = useCurrency();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'w-40 gap-3 rounded-2xl border p-4',
        selected ? 'border-primary bg-accent' : 'border-border bg-card'
      )}
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full',
          selected ? 'bg-primary' : 'bg-accent'
        )}
      >
        <Icon
          as={Stethoscope}
          size={18}
          className={selected ? 'text-primary-foreground' : 'text-primary'}
        />
      </View>
      <View className="gap-1">
        <Text
          className="text-foreground text-sm"
          style={{ fontFamily: 'app-font-bold' }}
          numberOfLines={2}
        >
          {service.name}
        </Text>
        <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
          {formatPrice(service.price)}
        </Text>
      </View>
    </Pressable>
  );
}
