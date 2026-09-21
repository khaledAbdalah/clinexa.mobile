import { View } from 'react-native';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

type ProfileHeaderCardProps = {
  fullName: string;
  initials: string;
  phone: string;
};

export function ProfileHeaderCard({ fullName, initials, phone }: ProfileHeaderCardProps) {
  return (
    <View className="bg-primary items-center gap-1 rounded-3xl px-6 py-8 shadow-sm shadow-black/5">
      <Avatar alt={fullName} className="h-16 w-16">
        <AvatarFallback className="border border-white/25 bg-white/15">
          <Text className="text-2xl text-white" style={{ fontFamily: 'app-font-bold' }}>
            {initials}
          </Text>
        </AvatarFallback>
      </Avatar>

      <Text className="mt-3 text-center text-xl text-white" style={{ fontFamily: 'app-font-bold' }}>
        {fullName}
      </Text>
      <Text
        className="text-center text-sm text-white/70"
        style={{ fontFamily: 'app-font-regular', direction: 'ltr' }}
      >
        {phone}
      </Text>
    </View>
  );
}
