import { router } from 'expo-router';
import {
  Calendar,
  ChevronLeft,
  FileText,
  Pill,
  Stethoscope,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { routes } from '@/constants/routes';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type TimelineCategory = 'visit' | 'prescription' | 'invoice' | 'payment' | 'appointment';

// Solid tints only — color/opacity classNames (`bg-primary/10`) trigger the NativeWind
// "navigation context" crash in this project.
export const TIMELINE_CATEGORY_CONFIG: Record<
  TimelineCategory,
  { label: string; icon: LucideIcon; nodeClassName: string; textClassName: string }
> = {
  visit: {
    label: 'زيارة',
    icon: Stethoscope,
    nodeClassName: 'bg-primary',
    textClassName: 'text-primary',
  },
  prescription: {
    label: 'روشتة',
    icon: Pill,
    nodeClassName: 'bg-sky-600',
    textClassName: 'text-sky-700',
  },
  invoice: {
    label: 'فاتورة',
    icon: FileText,
    nodeClassName: 'bg-violet-600',
    textClassName: 'text-violet-700',
  },
  payment: {
    label: 'دفعة',
    icon: Wallet,
    nodeClassName: 'bg-emerald-600',
    textClassName: 'text-emerald-700',
  },
  appointment: {
    label: 'موعد',
    icon: Calendar,
    nodeClassName: 'bg-amber-500',
    textClassName: 'text-amber-700',
  },
};

export type TimelineStatusVariant = 'success' | 'warning' | 'neutral';

const STATUS_VARIANT_CLASSES: Record<TimelineStatusVariant, { chip: string; text: string }> = {
  success: { chip: 'bg-accent', text: 'text-primary' },
  warning: { chip: 'bg-amber-100', text: 'text-amber-700' },
  neutral: { chip: 'bg-muted', text: 'text-muted-foreground' },
};

export type TimelineEvent = {
  id: string;
  category: TimelineCategory;
  title: string;
  /** One plain supporting line under the title (diagnosis, medicine count). */
  subtitle?: string;
  date: string;
  time?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  note?: string;
  amount?: string;
  statusLabel?: string;
  statusVariant?: TimelineStatusVariant;
};

// Only prescriptions/invoices have a real detail screen today. `visit`/`appointment`/
// `payment` entries have nowhere to go yet (no encounter/payment detail screen exists) —
// better to make those rows non-interactive than to send the user to an unrelated tab.
function getDetailRoute(category: TimelineCategory, id: string) {
  if (category === 'prescription') return routes.prescriptionDetail(id);
  if (category === 'invoice') return routes.invoiceDetail(id);
  return null;
}

/**
 * Reads top-down in RTL order: what + when (meta row) → the event itself (title, with
 * the amount beside it for money entries) → who (doctor) → context (note) → outcome
 * and next step (status, details link). The category's icon/color lives on the
 * timeline node, so the card only repeats it as a small colored label.
 */
export function TimelineEventCard({
  id,
  category,
  title,
  subtitle,
  date,
  time,
  doctorName,
  doctorSpecialty,
  note,
  amount,
  statusLabel,
  statusVariant = 'success',
}: TimelineEvent) {
  const config = TIMELINE_CATEGORY_CONFIG[category];
  const detailRoute = getDetailRoute(category, id);
  const status = STATUS_VARIANT_CLASSES[statusVariant];

  return (
    <Pressable
      onPress={detailRoute ? () => router.push(detailRoute as never) : undefined}
      disabled={!detailRoute}
      className="bg-card border-border gap-2 rounded-2xl border p-4 active:opacity-80"
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text
          className={cn('text-xs', config.textClassName)}
          style={{ fontFamily: 'app-font-bold' }}
        >
          {config.label}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className="text-muted-foreground text-xs"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {date}
          </Text>
          {time ? (
            <>
              <View className="bg-border h-1 w-1 rounded-full" />
              <Text
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {time}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-start justify-between gap-3">
        <Text
          numberOfLines={2}
          className="text-foreground flex-1 text-base leading-6"
          style={{ fontFamily: 'app-font-bold' }}
        >
          {title}
        </Text>
        {amount ? (
          <Text
            className="text-foreground text-base leading-6"
            style={{ fontFamily: 'app-font-bold' }}
          >
            {amount}
          </Text>
        ) : null}
      </View>

      {subtitle ? (
        <Text
          className="text-muted-foreground -mt-1.5 text-sm"
          style={{ fontFamily: 'app-font-semibold' }}
        >
          {subtitle}
        </Text>
      ) : null}

      {doctorName ? (
        <View className="flex-row items-center gap-2">
          <View className="bg-muted h-8 w-8 items-center justify-center rounded-full">
            <Icon as={User} size={14} className="text-muted-foreground" />
          </View>
          <View className="flex-1 items-start">
            <Text className="text-foreground text-sm" style={{ fontFamily: 'app-font-semibold' }}>
              {doctorName}
            </Text>
            {doctorSpecialty ? (
              <Text
                numberOfLines={1}
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
              >
                {doctorSpecialty}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {note ? (
        <View className="bg-muted rounded-xl px-3 py-2">
          <Text
            numberOfLines={3}
            className="text-muted-foreground text-xs leading-5"
            style={{ fontFamily: 'app-font-semibold' }}
          >
            {note}
          </Text>
        </View>
      ) : null}

      {statusLabel || detailRoute ? (
        <View className="flex-row items-center justify-between pt-0.5">
          {statusLabel ? (
            <View className={cn('rounded-full px-2.5 py-1', status.chip)}>
              <Text className={cn('text-xs', status.text)} style={{ fontFamily: 'app-font-bold' }}>
                {statusLabel}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {detailRoute ? (
            <View className="flex-row items-center gap-0.5">
              <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-bold' }}>
                عرض التفاصيل
              </Text>
              <Icon as={ChevronLeft} size={14} className="text-primary" />
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
