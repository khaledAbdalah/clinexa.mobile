import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';
import {
  ONBOARDING_TOTAL_STEPS,
  getOnboardingStepNumber,
  type OnboardingStepRoute,
} from '@/constants/onboarding-steps';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

interface OnboardingStepIndicatorProps {
  step: OnboardingStepRoute;
}

export function OnboardingStepIndicator({ step }: OnboardingStepIndicatorProps) {
  const currentStep = getOnboardingStepNumber(step);

  return (
    <View className="px-6 pt-2 pb-2">
      <View className="flex-row items-center gap-3" style={{ direction: 'ltr' }}>
        <Pressable onPress={() => router.back()} hitSlop={12} className="p-2">
          <Icon as={ChevronLeft} size={24} className="text-primary" />
        </Pressable>
        <Text
          className="text-muted-foreground flex-1 text-right text-sm"
          style={{ fontFamily: 'app-font-semibold' }}
        >
          {currentStep} من {ONBOARDING_TOTAL_STEPS}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-1.5">
        {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, index) => (
          <View
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              index < currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </View>
    </View>
  );
}
