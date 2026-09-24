import { useMemo } from 'react';

import type {
  TimelineCategory,
  TimelineEvent,
  TimelineStatusVariant,
} from '@/components/timeline/timeline-event-card';
import { useCurrency } from '@/hooks/use-currency';
import { formatDayMonth, formatMonth, formatTime } from '@/lib/format-date';
import type { Appointment, AppointmentStatus } from '@/types/appointment.types';
import type { Encounter } from '@/types/encounter.types';
import type { Invoice, InvoiceStatus, Payment } from '@/types/invoice.types';
import type { Prescription } from '@/types/prescription.types';
import type { TimelineEntry } from '@/types/timeline.types';

export type TimelineFilter = 'all' | TimelineCategory;

export type TimelineRow =
  | { type: 'monthHeader'; key: string; month: string; count: number; isFirst: boolean }
  | { type: 'event'; key: string; event: TimelineEvent; isLast: boolean };

type StatusConfig = { label: string; variant: TimelineStatusVariant };
type FormatPrice = (amount: number) => string;

// The backend has no equivalent for "arrived" / "in consultation" / "no show" — only
// booked/completed/cancelled (see app/(tabs)/appointments.tsx's STATUS_MAP for the same
// mapping against AppointmentCard).
const APPOINTMENT_STATUS: Record<AppointmentStatus, StatusConfig> = {
  booked: { label: 'محجوز', variant: 'warning' },
  completed: { label: 'مكتمل', variant: 'success' },
  cancelled: { label: 'ملغي', variant: 'neutral' },
};

// Real enum verified against api/app/validators/invoice.ts:123 — 'unpaid' | 'partial' | 'paid'.
const INVOICE_STATUS: Record<InvoiceStatus, StatusConfig> = {
  paid: { label: 'مدفوعة', variant: 'success' },
  partial: { label: 'مدفوعة جزئياً', variant: 'warning' },
  unpaid: { label: 'غير مدفوعة', variant: 'warning' },
};

function medicineCountLabel(count: number) {
  if (count === 0) return undefined;
  if (count === 1) return 'دواء واحد';
  if (count === 2) return 'دواءان';
  return `${count} أدوية`;
}

function mapAppointment(id: string, appointment: Appointment): TimelineEvent {
  const status = APPOINTMENT_STATUS[appointment.status];
  return {
    id,
    category: 'appointment',
    // `serviceName` is the booked service snapshot (e.g. "كشف") — optional at booking.
    title: appointment.serviceName ? `حجز ${appointment.serviceName}` : 'حجز موعد',
    doctorName: appointment.doctor?.fullName,
    doctorSpecialty: appointment.doctor?.specialty ?? undefined,
    note: appointment.notes ?? undefined,
    // `scheduledDate` is a date-only column (`@column.date()` in
    // api/database/schema.ts's AppointmentSchema) — no time to show.
    date: formatDayMonth(appointment.scheduledDate),
    statusLabel: status.label,
    statusVariant: status.variant,
  };
}

function mapEncounter(id: string, encounter: Encounter): TimelineEvent {
  return {
    id,
    category: 'visit',
    title: 'كشف عند الدكتور',
    // Clinical details (complaint/diagnosis) are intentionally not shown to the patient here.
    doctorName: encounter.doctor?.fullName,
    doctorSpecialty: encounter.doctor?.specialty ?? undefined,
    date: formatDayMonth(encounter.createdAt),
    time: formatTime(encounter.createdAt),
  };
}

function mapPrescription(id: string, prescription: Prescription): TimelineEvent {
  return {
    id,
    category: 'prescription',
    title: 'روشتة طبية',
    // `PrescriptionTransformer` is flat — no nested encounter/doctor on a
    // prescription timeline entry (see the Prescription type's doc comment), so
    // doctorName is intentionally omitted here.
    subtitle: medicineCountLabel(prescription.items?.length ?? 0),
    date: formatDayMonth(prescription.createdAt),
    time: formatTime(prescription.createdAt),
  };
}

function mapInvoice(id: string, invoice: Invoice, formatPrice: FormatPrice): TimelineEvent {
  const status = INVOICE_STATUS[invoice.status];
  return {
    id,
    category: 'invoice',
    title: `فاتورة ${invoice.invoiceNumber}`,
    date: formatDayMonth(invoice.createdAt),
    amount: formatPrice(invoice.total),
    statusLabel: status.label,
    statusVariant: status.variant,
  };
}

function mapPayment(id: string, payment: Payment, formatPrice: FormatPrice): TimelineEvent {
  return {
    id,
    category: 'payment',
    title: 'دفعة',
    date: formatDayMonth(payment.paidAt),
    amount: formatPrice(payment.amount),
    // Payment has no status column (api/database/schema.ts's PaymentSchema) — a row
    // only exists once money was actually received, so it's always "successful".
    // `method` is a free-form string (no enum), shown as the status chip's label.
    statusLabel: payment.method || undefined,
    statusVariant: 'success',
  };
}

function toTimelineEvent(entry: TimelineEntry, formatPrice: FormatPrice): TimelineEvent {
  switch (entry.type) {
    case 'appointment':
      return mapAppointment(entry.id, entry.data);
    case 'encounter':
      return mapEncounter(entry.id, entry.data);
    case 'prescription':
      return mapPrescription(entry.id, entry.data);
    case 'invoice':
      return mapInvoice(entry.id, entry.data, formatPrice);
    case 'payment':
      return mapPayment(entry.id, entry.data, formatPrice);
  }
}

type MonthGroup = { month: string; events: TimelineEvent[] };

/**
 * Turns the timeline feed into the flat header/event rows a `FlatList` needs, filtered
 * by category and grouped by month. Groups follow the backend's order and are keyed on
 * the entry's own `date` (what the backend sorts by), not the per-type display date.
 */
export function useTimelineRows(entries: TimelineEntry[] | undefined, filter: TimelineFilter) {
  const { formatPrice } = useCurrency();

  return useMemo(() => {
    const groups: MonthGroup[] = [];

    for (const entry of entries ?? []) {
      const event = toTimelineEvent(entry, formatPrice);
      if (filter !== 'all' && event.category !== filter) continue;

      const month = formatMonth(entry.date);
      const current = groups.at(-1);
      if (current?.month === month) current.events.push(event);
      else groups.push({ month, events: [event] });
    }

    const rows: TimelineRow[] = [];
    groups.forEach((group, groupIndex) => {
      const isLastGroup = groupIndex === groups.length - 1;
      rows.push({
        type: 'monthHeader',
        key: `month-${group.month}`,
        month: group.month,
        count: group.events.length,
        isFirst: groupIndex === 0,
      });
      group.events.forEach((event, index) => {
        rows.push({
          type: 'event',
          key: event.id,
          event,
          isLast: isLastGroup && index === group.events.length - 1,
        });
      });
    });

    return rows;
  }, [entries, filter, formatPrice]);
}
