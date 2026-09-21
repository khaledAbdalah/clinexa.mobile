import { BellOff } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { NotificationFeedItem } from '@/components/notifications/notification-feed-item';
import { NotificationStatusChips } from '@/components/notifications/notification-status-chips';
import { TabHeader } from '@/components/shared/tab-header';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNotificationsPage } from '@/hooks/notifications/use-notifications-page';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function NotificationsScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const {
    status,
    setStatus,
    notifications,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    unreadCount,
    handleOpenNotification,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification,
    refreshing,
    onRefresh,
  } = useNotificationsPage();

  return (
    <FlatList
      className="bg-background flex-1"
      style={{ paddingTop: insets.top }}
      data={notifications}
      renderItem={({ item }) => (
        <NotificationFeedItem
          notification={item}
          onPress={() => handleOpenNotification(item)}
          onRemove={() => deleteNotification(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => hasMore && loadMore()}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <>
          <TabHeader title="الإشعارات" />

          <View className="h-2" />
          <NotificationStatusChips active={status} onChange={setStatus} unreadCount={unreadCount} />

          {unreadCount > 0 ? (
            <View className="items-start px-4 pt-2">
              <Pressable onPress={markAllAsRead} disabled={isMarkingAllRead}>
                <Text className="text-primary text-sm" style={{ fontFamily: 'app-font-semibold' }}>
                  تحديد الكل كمقروء
                </Text>
              </Pressable>
            </View>
          ) : null}

          <View className="h-2" />
        </>
      }
      ListFooterComponent={
        isLoadingMore ? <ActivityIndicator className="py-4" color="#0d9488" /> : null
      }
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator className="py-16" color="#0d9488" />
        ) : (
          <View className="flex-1 items-center justify-center gap-3 px-4 py-16">
            <Icon as={BellOff} size={40} className="text-muted-foreground" />
            <Text
              className="text-muted-foreground text-center text-sm"
              style={{ fontFamily: 'app-font-regular' }}
            >
              لا توجد إشعارات حتى الآن
            </Text>
          </View>
        )
      }
      contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + BottomTabInset + 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
