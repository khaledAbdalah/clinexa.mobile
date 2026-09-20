import { useRef, useState } from 'react';
import { View } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSettingsStore } from '@/store/settings';

const RETRY_DEBOUNCE_MS = 3000;

export function MaintenanceScreen() {
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const [isChecking, setIsChecking] = useState(false);
  const lastCheckedAtRef = useRef(0);

  const handleRetry = async () => {
    const now = Date.now();
    if (isChecking || now - lastCheckedAtRef.current < RETRY_DEBOUNCE_MS) return;

    lastCheckedAtRef.current = now;
    setIsChecking(true);
    try {
      await fetchSettings();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-6 gap-6">
      <View className="w-20 h-20 bg-primary/10 rounded-full justify-center items-center">
        <Icon as={Wrench} size={40} className="text-primary" />
      </View>

      <View className="gap-2 items-center">
        <Text variant="h3" className="text-center">
          العيادة تحت الصيانة
        </Text>
        <Text variant="muted" className="text-center max-w-xs">
          إحنا بنعمل بعض التحديثات دلوقتي، برجاء المحاولة تاني بعد شوية
        </Text>
      </View>

      <Button className="w-full max-w-xs" onPress={handleRetry} disabled={isChecking}>
        <Text>{isChecking ? 'جاري التحقق...' : 'إعادة المحاولة'}</Text>
      </Button>
    </View>
  );
}
