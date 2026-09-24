import { Eye, EyeOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Pressable, View, type TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

type PasswordFieldProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label?: string;
  required?: boolean;
  hint?: ReactNode;
  errorMessage?: string;
};

export function PasswordField({
  label = 'كلمة المرور',
  required = true,
  hint,
  errorMessage,
  placeholder = 'أدخل كلمة المرور',
  autoComplete = 'password',
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Flipping `secureTextEntry` can drop focus (and the keyboard with it) on Android, so
  // put focus back if the field was focused when the eye was tapped.
  const toggleVisible = () => {
    const wasFocused = inputRef.current?.isFocused() ?? false;
    setVisible((v) => !v);
    if (wasFocused) requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <View className="gap-2">
      <FieldLabel label={label} required={required} />
      <FieldRow className={cn(errorMessage && 'border-destructive')}>
        <Input
          ref={inputRef}
          className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
          placeholder={placeholder}
          secureTextEntry={!visible}
          autoComplete={autoComplete}
          {...inputProps}
        />
        <Pressable onPress={toggleVisible} hitSlop={8}>
          <Icon as={visible ? Eye : EyeOff} size={18} className="text-muted-foreground" />
        </Pressable>
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
