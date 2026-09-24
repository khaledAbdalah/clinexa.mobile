import { Calendar, Stethoscope, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

// Mirrors the backend's `AppointmentStatus` ('booked' | 'completed' | 'cancelled') one-to-one,
// under presentation-facing names. There is no backend equivalent for "arrived"/"in
// consultation"/"no show" (queue-arrival tracking doesn't exist yet) — don't add those back
// here without a real data source, since a UI-only status is fabricated data.
export type AppointmentStatus = 'reserved' | 'completed' | 'cancelled';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  reserved: { label: 'محجوز', className: 'bg-amber-100' },
  completed: { label: 'تمت', className: 'bg-emerald-100' },
  cancelled: { label: 'ملغى', className: 'bg-slate-200' },
};

const STATUS_TEXT_CLASS: Record<AppointmentStatus, string> = {
  reserved: 'text-amber-700',
  completed: 'text-emerald-700',
  cancelled: 'text-slate-600',
};

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  doctorName: string;
  doctorInitials: string;
  doctorSpecialty: string;
  dayName: string;
  date: string;
  queueNumber: string;
  /** Snapshot of the booked service, if one was picked at booking time (it's optional there). */
  serviceName?: string | null;
};

type AppointmentCardProps = Appointment & {
  /** Cancels this appointment. Omitted (or the card's status isn't `reserved`) → no
   * cancel affordance is rendered at all, e.g. for completed/cancelled appointments. */
  onCancel?: (id: string) => void;
  /** Shows a spinner on the confirm button instead of disabling the whole card, so the
   * confirmation sheet stays visible while the mutation is in flight. */
  isCancelling?: boolean;
};

export function AppointmentCard({
  id,
  status,
  doctorName,
  doctorInitials,
  doctorSpecialty,
  dayName,
  date,
  queueNumber,
  serviceName,
  onCancel,
  isCancelling,
}: AppointmentCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const canCancel = status === 'reserved' && Boolean(onCancel);
  const hasSpecialty = doctorSpecialty !== '—' && doctorSpecialty !== '';

  const handleConfirmCancel = () => {
    onCancel?.(id);
  };

  return (
    <>
      <View className="bg-card border-border mx-6 gap-4 rounded-2xl border p-4">
        {/* Doctor + status */}
        <View className="flex-row items-center gap-3">
          <Avatar alt={doctorName} className="h-12 w-12">
            <AvatarFallback className="bg-accent">
              <Text className="text-primary text-base" style={{ fontFamily: 'app-font-bold' }}>
                {doctorInitials}
              </Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 gap-0.5">
            <Text
              className="text-foreground text-base"
              style={{ fontFamily: 'app-font-bold' }}
              numberOfLines={1}
            >
              {doctorName}
            </Text>
            {hasSpecialty ? (
              <Text
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
                numberOfLines={1}
              >
                {doctorSpecialty}
              </Text>
            ) : null}
          </View>
          <View className={cn('rounded-full px-3 py-1', STATUS_CONFIG[status].className)}>
            <Text
              className={cn('text-xs', STATUS_TEXT_CLASS[status])}
              style={{ fontFamily: 'app-font-bold' }}
            >
              {STATUS_CONFIG[status].label}
            </Text>
          </View>
        </View>

        {serviceName ? (
          <View className="bg-accent flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5">
            <Icon as={Stethoscope} size={12} className="text-primary" />
            <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
              {serviceName}
            </Text>
          </View>
        ) : null}

        {/* Date + queue number: two separate tiles so neither is squeezed by the other. */}
        <View className="flex-row items-stretch gap-3">
          <View className="bg-muted flex-1 flex-row items-center gap-3 rounded-xl px-3 py-3">
            <View className="bg-card h-9 w-9 items-center justify-center rounded-full">
              <Icon as={Calendar} size={16} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text
                className="text-foreground text-sm"
                style={{ fontFamily: 'app-font-bold' }}
                numberOfLines={1}
              >
                {dayName}
              </Text>
              <Text
                className="text-muted-foreground text-xs"
                style={{ fontFamily: 'app-font-semibold' }}
                numberOfLines={1}
              >
                {date}
              </Text>
            </View>
          </View>

          <View className="bg-accent min-w-24 items-center justify-center rounded-xl px-4 py-3">
            <Text className="text-primary text-xs" style={{ fontFamily: 'app-font-semibold' }}>
              الدور رقم
            </Text>
            <Text
              className="text-primary text-2xl leading-8"
              style={{ fontFamily: 'app-font-bold' }}
            >
              {queueNumber}
            </Text>
          </View>
        </View>

        {canCancel ? (
          <Pressable
            onPress={() => setIsConfirmOpen(true)}
            className="h-11 flex-row items-center justify-center gap-2 rounded-full active:opacity-70"
            // Inline style: color-opacity classNames crash with a fake "navigation context" error.
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
          >
            <Icon as={X} size={16} className="text-destructive" />
            <Text className="text-destructive text-sm" style={{ fontFamily: 'app-font-bold' }}>
              إلغاء الموعد
            </Text>
          </Pressable>
        ) : null}
      </View>

      <BottomSheet
        visible={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="إلغاء الموعد"
        scrollable={false}
      >
        <View className="gap-5 px-5 pt-1">
          <View className="gap-2">
            <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
              هل أنت متأكد من إلغاء الموعد؟
            </Text>
            <Text className="text-muted-foreground text-sm leading-6">
              هيتم إلغاء موعدك مع {doctorName} يوم {dayName} {date}، ودورك رقم {queueNumber} هيتحذف
              من الطابور.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <PillButton
              label="إلغاء الموعد"
              variant="solid"
              className="bg-destructive active:bg-destructive/90 flex-1"
              onPress={handleConfirmCancel}
              isLoading={isCancelling}
            />
            <PillButton
              label="تراجع"
              variant="outline"
              icon={null}
              onPress={() => setIsConfirmOpen(false)}
              disabled={isCancelling}
            />
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
