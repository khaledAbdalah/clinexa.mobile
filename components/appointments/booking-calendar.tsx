import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { arEG } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { WEEKDAY_NAMES } from '@/constants/days';
import { toIsoDate } from '@/lib/iso-date';
import { cn } from '@/lib/utils';

const CELL_WIDTH = `${100 / 7}%` as const;

type BookingCalendarProps = {
  /** Weekday indexes (0=Sunday..6=Saturday) the doctor works — all other days are disabled. */
  workingDays: ReadonlySet<number>;
  /** Earliest / latest bookable day (inclusive), at local midnight. */
  minDate: Date;
  maxDate: Date;
  /** `YYYY-MM-DD` */
  selectedDate: string | null;
  onSelectDate: (isoDate: string) => void;
  /**
   * `YYYY-MM-DD` dates to disable on top of the working-days/min/max rules
   * above — e.g. days the patient already has a conflicting booking on.
   * Rendered identically to the "not a working day" disabled state so the
   * two reasons a cell is unavailable don't look different to the user.
   */
  disabledDates?: ReadonlySet<string>;
};

/** Month-grid date picker for `app/book-appointment.tsx`. Weeks start on Sunday to
 * match `WEEKDAY_NAMES`; under the app's forced RTL the row lays out right-to-left,
 * so Sunday sits at the right edge and the "next month" chevron points left. */
export function BookingCalendar({
  workingDays,
  minDate,
  maxDate,
  selectedDate,
  onSelectDate,
  disabledDates,
}: BookingCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(minDate));

  const canGoPrev = isAfter(visibleMonth, startOfMonth(minDate));
  const canGoNext = isBefore(visibleMonth, startOfMonth(maxDate));

  const gridStart = startOfWeek(visibleMonth, { weekStartsOn: 0 });
  const gridEnd = endOfMonth(visibleMonth);
  const days: Date[] = [];
  for (let day = gridStart; !isAfter(day, gridEnd); day = addDays(day, 1)) {
    days.push(day);
  }

  return (
    <View className="bg-card border-border mx-6 gap-3 rounded-2xl border p-4">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => setVisibleMonth((month) => addMonths(month, -1))}
          disabled={!canGoPrev}
          hitSlop={8}
          className="p-1"
          style={{ opacity: canGoPrev ? 1 : 0.3 }}
        >
          <Icon as={ChevronRight} size={22} className="text-primary" />
        </Pressable>

        <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-bold' }}>
          {format(visibleMonth, 'LLLL yyyy', { locale: arEG })}
        </Text>

        <Pressable
          onPress={() => setVisibleMonth((month) => addMonths(month, 1))}
          disabled={!canGoNext}
          hitSlop={8}
          className="p-1"
          style={{ opacity: canGoNext ? 1 : 0.3 }}
        >
          <Icon as={ChevronLeft} size={22} className="text-primary" />
        </Pressable>
      </View>

      <View className="flex-row">
        {WEEKDAY_NAMES.map((name) => (
          <View key={name} style={{ width: CELL_WIDTH }} className="items-center">
            <Text
              className="text-muted-foreground text-[10px]"
              style={{ fontFamily: 'app-font-semibold' }}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day) => {
          const isoDate = toIsoDate(day);
          const inMonth = isSameMonth(day, visibleMonth);
          const isBookable =
            inMonth &&
            workingDays.has(day.getDay()) &&
            !isBefore(day, minDate) &&
            !isAfter(day, maxDate) &&
            !disabledDates?.has(isoDate);
          const isSelected = selectedDate === isoDate;

          return (
            <View key={isoDate} style={{ width: CELL_WIDTH }} className="items-center py-1">
              {inMonth ? (
                <Pressable
                  onPress={() => onSelectDate(isoDate)}
                  disabled={!isBookable}
                  className={cn(
                    'h-10 w-10 items-center justify-center rounded-full',
                    isSelected ? 'bg-primary' : isBookable ? 'bg-accent' : undefined
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm',
                      isSelected
                        ? 'text-primary-foreground'
                        : isBookable
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    )}
                    style={{
                      fontFamily: isBookable ? 'app-font-bold' : 'app-font-regular',
                      opacity: isBookable || isSelected ? 1 : 0.4,
                    }}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
