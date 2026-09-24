import { Calendar, FileText, Receipt, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type PreviewTile = {
  icon: LucideIcon;
  label: string;
};

const TILES: PreviewTile[] = [
  { icon: Calendar, label: 'مواعيدك' },
  { icon: FileText, label: 'روشتاتك' },
  { icon: Receipt, label: 'فواتيرك' },
];

/**
 * "What you'll see here later" preview — muted/outline tiles (not styled as
 * broken/empty) that hint at the sections that activate once the patient has
 * real history, without implying they're available now.
 */
export function EmptyHomePreviewTiles() {
  return (
    <View className="mx-6 flex-row gap-3">
      {TILES.map(({ icon, label }) => (
        <View
          key={label}
          className="border-primary/25 bg-primary/5 flex-1 items-center gap-2 rounded-2xl border border-dashed px-3 py-4"
        >
          <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
            <Icon as={icon} size={18} className="text-primary/70" />
          </View>
          <Text className="text-primary/70 text-xs" style={{ fontFamily: 'app-font-semibold' }}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
