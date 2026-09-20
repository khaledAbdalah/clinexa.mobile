import { Eye, EyeOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, View, type TextInputProps } from 'react-native';

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

  return (
    <View className="gap-2">
      <FieldLabel label={label} required={required} />
      <FieldRow className={cn(errorMessage && 'border-destructive')}>
        <Input
          className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
          placeholder={placeholder}
          secureTextEntry={!visible}
          autoComplete={autoComplete}
          {...inputProps}
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
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
