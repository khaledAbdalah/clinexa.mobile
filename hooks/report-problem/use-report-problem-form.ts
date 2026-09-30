import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';
import { useSubmitReport } from '@/hooks/report-problem/use-submit-report';
import type { ProblemReportImage } from '@/types/problem-report.types';
import {
  reportProblemSchema,
  type ReportProblemInput,
} from '@/validation/report-problem.validation';

const MAX_IMAGES = 5;

/** Form state + image picking + submit handler for the "report a problem" screen. */
export function useReportProblemForm() {
  const { showError } = useToast();
  const form = useForm<ReportProblemInput>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: { title: '', description: '', images: [] },
  });

  const { mutate, isPending } = useSubmitReport();

  const images = form.watch('images');

  const pickImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      showError('يمكنك إرفاق 5 صور كحد أقصى');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showError('يحتاج التطبيق إذن الوصول إلى الصور لإرفاقها');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const picked: ProblemReportImage[] = result.assets.map((asset, index) => ({
      uri: asset.uri,
      name: asset.fileName ?? `report-image-${Date.now()}-${index}.jpg`,
      type: asset.mimeType ?? 'image/jpeg',
    }));

    form.setValue('images', [...images, ...picked].slice(0, MAX_IMAGES), {
      shouldValidate: true,
    });
  };

  const removeImage = (uri: string) => {
    form.setValue(
      'images',
      images.filter((image) => image.uri !== uri),
      { shouldValidate: true }
    );
  };

  const handleSubmit = form.handleSubmit((data) => {
    Keyboard.dismiss();
    mutate(data, {
      onSuccess: () => {
        router.back();
      },
    });
  });

  return {
    form,
    images,
    pickImages,
    removeImage,
    handleSubmit,
    isSubmitting: isPending,
    maxImages: MAX_IMAGES,
  };
}
