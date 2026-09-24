import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/format-date';
import type { ChatMessage } from '@/types/chat.types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isOwn = message.senderType === 'patient';

  return (
    <View className={cn('px-4 py-1', isOwn ? 'items-end' : 'items-start')}>
      <View
        className={cn(
          'max-w-[80%] gap-1 rounded-2xl px-4 py-2.5',
          isOwn ? 'bg-primary' : 'bg-card border-border border'
        )}
      >
        <Text
          className={cn(
            'text-[15px] leading-5',
            isOwn ? 'text-primary-foreground' : 'text-foreground'
          )}
          style={{ fontFamily: 'app-font-regular' }}
        >
          {message.body}
        </Text>
        <Text
          className={cn(
            'text-[10px]',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
          style={{ fontFamily: 'app-font-regular' }}
        >
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
