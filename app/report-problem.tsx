import { Image } from 'expo-image';
import { Plus, X } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { useReportProblemForm } from '@/hooks/report-problem/use-report-problem-form';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { FieldLabel, FieldRow } from '@/components/form-field';
import { TabHeader } from '@/components/shared/tab-header';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PillButton } from '@/components/ui/pill-button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';

export default function ReportProblemScreen() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const { form, images, pickImages, removeImage, handleSubmit, isSubmitting, maxImages } =
    useReportProblemForm();

  return (
    <View className="bg-background flex-1">
      <KeyboardAwareScrollView
        bottomOffset={120}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + BottomTabInset,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TabHeader
          title="الإبلاغ عن مشكلة"
          subtitle="ساعدنا في تحسين التطبيق بإبلاغك عن أي مشكلة"
        />

        <View className="gap-6 px-6">
          <View className="gap-2">
            <FieldLabel label="عنوان المشكلة" required />
            <FieldRow className={form.formState.errors.title ? 'border-destructive' : undefined}>
              <Controller
                control={form.control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="text-foreground h-14 flex-1 border-0 bg-transparent text-right text-lg leading-7 shadow-none"
                    placeholder="مثال: التطبيق يتوقف عند حجز موعد"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FieldRow>
            {form.formState.errors.title ? (
              <Text className="text-destructive text-xs" style={{ fontFamily: 'app-font-regular' }}>
                {form.formState.errors.title.message}
              </Text>
            ) : null}
          </View>

          <View className="gap-2">
            <FieldLabel label="وصف المشكلة" required />
            <Controller
              control={form.control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  className="text-right"
                  placeholder="اشرح المشكلة بالتفصيل: ماذا حدث، ومتى، وما الذي كنت تحاول فعله"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {form.formState.errors.description ? (
              <Text className="text-destructive text-xs" style={{ fontFamily: 'app-font-regular' }}>
                {form.formState.errors.description.message}
              </Text>
            ) : null}
          </View>

          <View className="gap-2">
            <FieldLabel label="صور (اختياري)" optionalHint={`${images.length}/${maxImages}`} />
            <View className="flex-row flex-wrap gap-3">
              {images.map((image) => (
                <View key={image.uri} className="h-20 w-20 overflow-hidden rounded-xl">
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => removeImage(image.uri)}
                    hitSlop={8}
                    className="bg-foreground/70 absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Icon as={X} size={14} className="text-background" />
                  </Pressable>
                </View>
              ))}
              {images.length < maxImages ? (
                <Pressable
                  onPress={pickImages}
                  className="border-input bg-background h-20 w-20 items-center justify-center rounded-xl border border-dashed"
                >
                  <Icon as={Plus} size={22} className="text-muted-foreground" />
                </Pressable>
              ) : null}
            </View>
            {form.formState.errors.images ? (
              <Text className="text-destructive text-xs" style={{ fontFamily: 'app-font-regular' }}>
                {form.formState.errors.images.message as string}
              </Text>
            ) : null}
          </View>
        </View>

        <PillButton
          label="إرسال البلاغ"
          variant="solid"
          className="mx-6 mt-2"
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
