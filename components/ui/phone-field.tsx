import type { ReactNode } from 'react';
import { View, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

const COUNTRY_CODE = '+20';

type PhoneFieldProps = Omit<TextInputProps, 'keyboardType'> & {
  label?: string;
  required?: boolean;
  hint?: ReactNode;
  errorMessage?: string;
  showCountryCode?: boolean;
};

/**
 * Phone numbers stay LTR regardless of the app's RTL layout — the row itself
 * is pinned to `direction: 'ltr'` so "+20" renders on the physical left with
 * the digits reading left-to-right next to it, instead of getting mirrored
 * by the app-wide RTL direction.
 */
export function PhoneField({
  label = 'رقم الهاتف',
  required = true,
  hint,
  errorMessage,
  showCountryCode = true,
  placeholder = 'أدخل رقم هاتفك',
  autoComplete = 'tel',
  ...inputProps
}: PhoneFieldProps) {
  return (
    <View className="gap-2">
      <FieldLabel label={label} required={required} />
      <FieldRow style={{ direction: 'ltr' }} className={cn(errorMessage && 'border-destructive')}>
        {showCountryCode && (
          <>
            <Text
              className="text-foreground py-3 text-lg"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              {COUNTRY_CODE}
            </Text>
            <View className="bg-border mx-2 h-5 w-px" />
          </>
        )}
        <Input
          className="text-foreground h-14 flex-1 border-0 bg-transparent text-left text-lg leading-7 shadow-none"
          style={{ writingDirection: 'ltr' }}
          placeholder={placeholder}
          keyboardType="phone-pad"
          autoComplete={autoComplete}
          {...inputProps}
        />
      </FieldRow>
      {errorMessage ? (
        <Text className="text-destructive text-xs" style={{ fontFamily: 'app-font-regular' }}>
          {errorMessage}
        </Text>
      ) : (
        hint
      )}
    </View>
  );
}
