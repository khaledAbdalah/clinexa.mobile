import { Link, type Href } from 'expo-router';
import { ArrowRight, SearchX } from 'lucide-react-native';
import { I18nManager, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { routes } from '@/constants/routes';

interface NotFoundStateProps {
  title: string;
  subtitle?: string;
  actionLabel: string;
  href?: Href;
}

export function NotFoundState({
  title,
  subtitle,
  actionLabel,
  href = routes.home,
}: NotFoundStateProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6 gap-6">
      <View className="w-20 h-20 bg-primary/10 rounded-full justify-center items-center">
        <Icon as={SearchX} size={40} className="text-primary" />
      </View>

      <View className="gap-2 items-center">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="muted" className="text-center max-w-xs">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Link href={href} asChild>
        <Button className="flex-row items-center gap-2.5 rounded-full py-1.5 pl-6 pr-1.5">
          <Text>{actionLabel}</Text>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
            <Icon
              as={ArrowRight}
              size={18}
              className="text-primary-foreground"
              style={{ transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }] }}
            />
          </View>
        </Button>
      </Link>
    </View>
  );
}
