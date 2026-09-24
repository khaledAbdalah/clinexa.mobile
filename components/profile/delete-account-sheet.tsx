import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Clock, Trash2, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { PasswordField } from '@/components/ui/password-field';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { useDeleteAccount } from '@/hooks/auth/use-delete-account';
import { cn } from '@/lib/utils';
import type { DeleteAccountType } from '@/types/auth.types';
import { deleteAccountSchema, type DeleteAccountInput } from '@/validation/account.validation';

type DeleteAccountSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type Step = 'choose' | 'confirm';

const OPTIONS: {
  type: DeleteAccountType;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    type: 'temporary',
    title: 'حذف مؤقت',
    description: 'بياناتك بتفضل محفوظة وتقدر ترجع لحسابك في أي وقت بمجرد تسجيل الدخول.',
    icon: Clock,
  },
  {
    type: 'permanent',
    title: 'حذف نهائي',
    description:
      'حسابك بيتحذف نهائيًا ومش هتقدر ترجع له تاني. السجلات الطبية بتفضل محفوظة عند العيادة.',
    icon: Trash2,
  },
];

function OptionCard({
  option,
  selected,
  onPress,
}: {
  option: (typeof OPTIONS)[number];
  selected: boolean;
  onPress: () => void;
}) {
  const isPermanent = option.type === 'permanent';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={cn(
        'bg-card flex-row items-center gap-3 rounded-2xl border-2 p-4 active:opacity-70',
        selected ? (isPermanent ? 'border-destructive' : 'border-primary') : 'border-border'
      )}
    >
      {/* Inline style: color-opacity classNames crash with a fake "navigation context" error. */}
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full',
          !isPermanent && 'bg-accent'
        )}
        style={isPermanent ? { backgroundColor: 'rgba(220, 38, 38, 0.12)' } : undefined}
      >
        <Icon
          as={option.icon}
          size={18}
          className={isPermanent ? 'text-destructive' : 'text-primary'}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text
          className={cn('text-sm', isPermanent ? 'text-destructive' : 'text-foreground')}
          style={{ fontFamily: 'app-font-semibold' }}
        >
          {option.title}
        </Text>
        <Text className="text-muted-foreground text-xs leading-5">{option.description}</Text>
      </View>
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border-2',
          selected ? (isPermanent ? 'border-destructive' : 'border-primary') : 'border-border'
        )}
      >
        {selected ? (
          <View
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              isPermanent ? 'bg-destructive' : 'bg-primary'
            )}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Two-step "delete my account" sheet opened from the Profile screen: pick temporary vs.
 * permanent deletion, then confirm with the password (permanent also needs an explicit
 * acknowledgement checkbox).
 */
export function DeleteAccountSheet({ visible, onClose }: DeleteAccountSheetProps) {
  const [step, setStep] = useState<Step>('choose');
  const [acknowledged, setAcknowledged] = useState(false);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { type: 'temporary', password: '' },
  });
  const type = form.watch('type');
  const isPermanent = type === 'permanent';

  const { mutate, isPending } = useDeleteAccount();

  const resetAndClose = () => {
    form.reset();
    setStep('choose');
    setAcknowledged(false);
    onClose();
  };

  const handleClose = () => {
    if (isPending) return;
    resetAndClose();
  };

  const handleConfirm = form.handleSubmit((data) => {
    Keyboard.dismiss();
    // Only close on success — on failure the sheet stays open so the error/toast is in context.
    mutate(data, { onSuccess: resetAndClose });
  });

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="حذف الحساب" avoidKeyboard>
      {step === 'choose' ? (
        <View className="gap-4 px-5 pt-1">
          <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
            اختار نوع الحذف
          </Text>
          {OPTIONS.map((option) => (
            <OptionCard
              key={option.type}
              option={option}
              selected={type === option.type}
              onPress={() => {
                form.setValue('type', option.type);
                setAcknowledged(false);
              }}
            />
          ))}
          <PillButton
            label="متابعة"
            variant="solid"
            className={cn(isPermanent && 'bg-destructive active:bg-destructive/90')}
            onPress={() => setStep('confirm')}
          />
        </View>
      ) : (
        <View className="gap-5 px-5 pt-1">
          <Text className="text-foreground text-base" style={{ fontFamily: 'app-font-semibold' }}>
            {isPermanent
              ? 'هل أنت متأكد إنك عايز تحذف حسابك نهائيًا؟'
              : 'هل أنت متأكد إنك عايز تعطّل حسابك مؤقتًا؟'}
          </Text>
          <Text className="text-muted-foreground text-sm leading-6">
            {isPermanent
              ? 'هيتم حذف حسابك نهائيًا وإلغاء مواعيدك القادمة، ومش هتقدر تسترجعه تاني. السجلات الطبية والفواتير هتفضل محفوظة عند العيادة.'
              : 'هيتم تعطيل حسابك وإلغاء مواعيدك القادمة، وبياناتك هتفضل محفوظة. سجّل دخول في أي وقت وحسابك هيرجع.'}
          </Text>

          {isPermanent ? (
            <Pressable
              onPress={() => setAcknowledged((value) => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acknowledged }}
              className="border-destructive bg-card flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
            >
              <View
                className={cn(
                  'h-5 w-5 items-center justify-center rounded border-2',
                  acknowledged ? 'border-destructive bg-destructive' : 'border-destructive'
                )}
              >
                {acknowledged ? (
                  <Icon as={Check} size={14} className="text-destructive-foreground" />
                ) : null}
              </View>
              <Text className="text-destructive flex-1 text-sm">
                فاهم إن الحذف نهائي ومش هينفع أرجع لحسابي تاني
              </Text>
            </Pressable>
          ) : null}

          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <PasswordField
                label="كلمة المرور"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                autoComplete="current-password"
                returnKeyType="send"
                onSubmitEditing={handleConfirm}
              />
            )}
          />

          <View className="flex-row gap-3">
            <PillButton
              label={isPermanent ? 'احذف نهائيًا' : 'عطّل حسابي'}
              variant="solid"
              className={cn(
                'flex-1',
                isPermanent
                  ? 'bg-destructive active:bg-destructive/90'
                  : 'bg-primary active:bg-primary/90'
              )}
              onPress={handleConfirm}
              isLoading={isPending}
              disabled={isPermanent && !acknowledged}
            />
            <PillButton
              label="رجوع"
              variant="outline"
              icon={null}
              onPress={() => setStep('choose')}
              disabled={isPending}
            />
          </View>
        </View>
      )}
    </BottomSheet>
  );
}
