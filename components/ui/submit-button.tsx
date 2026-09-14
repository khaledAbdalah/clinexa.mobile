import { ActivityIndicator } from 'react-native';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface SubmitButtonProps extends Omit<ButtonProps, 'children'> {
  isLoading?: boolean;
  spinnerColor?: string;
  children?: React.ReactNode;
}

export function SubmitButton({
  isLoading,
  disabled,
  spinnerColor = '#ffffff',
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? <ActivityIndicator color={spinnerColor} /> : <Text>{children}</Text>}
    </Button>
  );
}
