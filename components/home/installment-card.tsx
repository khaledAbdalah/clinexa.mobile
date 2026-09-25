import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Calendar, CalendarClock } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';

type InstallmentCardProps = {
  amount: string;
  dueDate: string;
  totalInstallments: number;
};

function daysLabel(days: number) {
  if (days === 1) return 'يوم';
  if (days === 2) return 'يومين';
  return days <= 10 ? `${days} أيام` : `${days} يوم`;
}

function installmentsLabel(count: number) {
  if (count === 2) return 'قسطين';
  return count <= 10 ? `${count} أقساط` : `${count} قسط`;
}

function describeDue(days: number) {
  if (days < 0)
    return { label: `متأخر ${daysLabel(-days)}`, chip: 'bg-red-100', text: 'text-red-700' };
  if (days === 0) return { label: 'يستحق النهارده', chip: 'bg-amber-100', text: 'text-amber-700' };
  if (days === 1) return { label: 'يستحق بكرة', chip: 'bg-amber-100', text: 'text-amber-700' };
  if (days <= 7) {
    return { label: `بعد ${daysLabel(days)}`, chip: 'bg-amber-100', text: 'text-amber-700' };
  }
  return { label: `بعد ${daysLabel(days)}`, chip: 'bg-white', text: 'text-primary' };
}

export function InstallmentCard({ amount, dueDate, totalInstallments }: InstallmentCardProps) {
  const days = differenceInCalendarDays(parseISO(dueDate), new Date());
  const due = Number.isFinite(days) ? describeDue(days) : null;

  return (
    <View className="bg-accent mx-6 gap-3 rounded-2xl border border-teal-100 p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100">
          <Icon as={CalendarClock} size={22} className="text-primary" />
        </View>

        <View className="flex-1 gap-0.5">
          <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
            القسط القادم
          </Text>
          <Text
            className="text-foreground text-2xl leading-8"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {amount}
          </Text>
        </View>

        {due ? (
          <View className={cn('shrink-0 rounded-full px-2.5 py-1', due.chip)}>
            <Text className={cn('text-xs', due.text)} style={{ fontFamily: 'app-font-bold' }}>
              {due.label}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-teal-100 pt-3">
        <View className="flex-row items-center gap-1.5">
          <Icon as={Calendar} size={13} className="text-muted-foreground" />
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {formatDate(dueDate)}
          </Text>
        </View>
        {totalInstallments > 1 ? (
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            ضمن خطة {installmentsLabel(totalInstallments)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
