import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

const CELL_COUNT = 6;

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
};

/**
 * Six-box OTP input. RN has no native multi-cell text field, so this follows
 * the common pattern of one invisible `TextInput` capturing keystrokes/paste
 * while visual cells render the digits — keeps native keyboard/autofill
 * behavior instead of wiring six separate inputs with manual focus-jumping.
 *
 * The invisible input is sized to cover the whole row (not a 1x1 dot) —
 * Android's focus/soft-keyboard heuristics can refuse to refocus an
 * effectively-zero-size input once it blurs, which made the keyboard
 * impossible to reopen after the first dismiss.
 */
export function OtpInput({ value, onChangeText, autoFocus }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const activeIndex = Math.min(value.length, CELL_COUNT - 1);

  return (
    <View>
      <View className="flex-row justify-between" style={{ direction: 'ltr' }}>
        {Array.from({ length: CELL_COUNT }, (_, index) => {
          const digit = value[index] ?? '';
          const isActive = isFocused && index === activeIndex;

          return (
            <View
              key={index}
              className={cn(
                'border-input bg-background h-14 w-12 items-center justify-center rounded-xl border',
                isActive && 'border-primary'
              )}
            >
              <Text className="text-foreground text-xl" style={{ fontFamily: 'app-font-semibold' }}>
                {digit}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, '').slice(0, CELL_COUNT))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        maxLength={CELL_COUNT}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0 }}
      />
    </View>
  );
}
