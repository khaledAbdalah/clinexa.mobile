import { View, Linking } from 'react-native';
import { DownloadCloud } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface ForceUpdateScreenProps {
  storeUrl: string | null;
}

export function ForceUpdateScreen({ storeUrl }: ForceUpdateScreenProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6 gap-6">
      <View className="w-20 h-20 bg-primary/10 rounded-full justify-center items-center">
        <Icon as={DownloadCloud} size={40} className="text-primary" />
      </View>

      <View className="gap-2 items-center">
        <Text variant="h3" className="text-center">
          يتوفر تحديث جديد
        </Text>
        <Text variant="muted" className="text-center max-w-xs">
          فيه إصدار جديد من التطبيق، حدّثه عشان تقدر تكمّل استخدامه
        </Text>
      </View>

      <Button
        className="w-full max-w-xs"
        disabled={!storeUrl}
        onPress={() => storeUrl && Linking.openURL(storeUrl)}
      >
        <Text>تحديث الآن</Text>
      </Button>
    </View>
  );
}
