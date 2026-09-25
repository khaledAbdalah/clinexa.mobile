import { router } from 'expo-router';
import { MessageCircleOff, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { KeyboardAvoidingView, KeyboardEvents } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessageBubble } from '@/components/chat/chat-message-bubble';
import { TabHeader } from '@/components/shared/tab-header';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { routes } from '@/constants/routes';
import { useChat } from '@/hooks/chat/use-chat';
import { useRequireAuth } from '@/hooks/use-require-auth';
import type { ChatMessage } from '@/types/chat.types';

export default function ChatScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const {
    messages,
    isBootstrapping,
    bootstrapError,
    hasMoreOlder,
    isLoadingOlder,
    loadOlderMessages,
    sendMessage,
    isSending,
  } = useChat();

  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = KeyboardEvents.addListener('keyboardWillShow', () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = KeyboardEvents.addListener('keyboardWillHide', () =>
      setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const reversedMessages = [...messages].reverse();

  const handleSend = () => {
    const body = draft.trim();
    if (!body || isSending) return;
    setDraft('');
    sendMessage(body);
  };

  return (
    <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        <TabHeader
          title="محادثة العيادة"

          onBackPress={() => router.navigate(routes.tabsHome)}
          bordered
        />

        {isBootstrapping ? (
          <ActivityIndicator className="flex-1" color="#0d9488" />
        ) : bootstrapError ? (
          <View className="flex-1 items-center justify-center gap-3 px-6">
            <Icon as={MessageCircleOff} size={40} className="text-muted-foreground" />
            <Text
              className="text-muted-foreground text-center text-sm"
              style={{ fontFamily: 'app-font-semibold' }}
            >
              تعذر تحميل المحادثة، حاول مرة أخرى
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            className="flex-1"
            inverted
            data={reversedMessages}
            keyExtractor={(item) => item.clientId ?? item.id}
            renderItem={({ item }) => <ChatMessageBubble message={item} />}
            onEndReached={() => hasMoreOlder && loadOlderMessages()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isLoadingOlder ? <ActivityIndicator className="py-4" color="#0d9488" /> : null
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center gap-3 px-6 py-24">
                <Icon as={MessageCircleOff} size={40} className="text-muted-foreground" />
                <Text
                  className="text-muted-foreground text-center text-sm"
                  style={{ fontFamily: 'app-font-semibold' }}
                >
                  ابدأ محادثتك مع العيادة، سيتم الرد عليك في أقرب وقت
                </Text>
              </View>
            }
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View
          className="border-border flex-row items-center gap-2 border-t px-4 py-2.5"

          style={{ paddingBottom: isKeyboardVisible ? 8 : insets.bottom + 8 }}
        >
          <Input
            value={draft}
            onChangeText={setDraft}
            placeholder="اكتب رسالتك..."
            className="flex-1 rounded-full text-right"
            multiline
            maxLength={5000}
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!draft.trim() || isSending}
            className="bg-primary h-11 w-11 items-center justify-center rounded-full disabled:opacity-40"
          >
            <Icon as={Send} size={18} className="text-primary-foreground" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
