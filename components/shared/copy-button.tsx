import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type CopyButtonProps = {
  value: string;
  /** Toast title shown after copying, e.g. "تم نسخ رقم الفاتورة". */
  successMessage: string;
  accessibilityLabel: string;
};

const COPIED_FEEDBACK_MS = 1500;

/** Icon button that copies `value`; the icon turns into a check briefly as confirmation. */
export function CopyButton({ value, successMessage, accessibilityLabel }: CopyButtonProps) {
  const { showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    showSuccess(successMessage);
  };

  return (
    <Pressable
      onPress={handleCopy}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="bg-muted h-8 w-8 items-center justify-center rounded-lg active:opacity-70"
    >
      <Icon
        as={copied ? Check : Copy}
        size={15}
        className={copied ? 'text-primary' : 'text-muted-foreground'}
      />
    </Pressable>
  );
}
