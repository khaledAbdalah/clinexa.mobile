import React, { useState } from 'react';
import { Image as ExpoImage, ImageProps } from 'expo-image';
import { ImageOff, User } from 'lucide-react-native';
import { View, type DimensionValue } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  showPlaceholder?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  errorFallback?: React.ReactNode;
  className?: string;
}

/**
 * expo-image wrapper with a skeleton placeholder while loading and a fallback
 * on error, so callers don't reimplement loading/error state per usage.
 */
export function CachedImage({
  uri,
  width = '100%',
  height = 200,
  borderRadius = 8,
  showPlaceholder = true,
  onLoadStart,
  onLoadEnd,
  errorFallback,
  style,
  className,
  ...props
}: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && errorFallback) {
    return <>{errorFallback}</>;
  }

  return (
    <View
      className={cn('bg-muted relative overflow-hidden', className)}
      style={{ width, height, borderRadius }}
    >
      {showPlaceholder && isLoading && (
        <Skeleton className="absolute inset-0" style={{ borderRadius }} />
      )}

      <ExpoImage
        source={{ uri }}
        style={[{ width: '100%', height: '100%', borderRadius }, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        cachePolicy="memory-disk"
        {...props}
      />

      {hasError && !errorFallback && (
        <View className="bg-muted absolute inset-0 items-center justify-center">
          <Icon as={ImageOff} className="text-muted-foreground" size={24} />
        </View>
      )}
    </View>
  );
}

/**
 * Circular variant for user avatars, with a generic fallback icon on error.
 */
export function AvatarImage({
  uri,
  size = 40,
  borderRadius,
}: {
  uri: string;
  size?: number;
  borderRadius?: number;
}) {
  return (
    <CachedImage
      uri={uri}
      width={size}
      height={size}
      borderRadius={borderRadius ?? size / 2}
      showPlaceholder={false}
      errorFallback={
        <View
          className="bg-secondary items-center justify-center"
          style={{ width: size, height: size, borderRadius: borderRadius ?? size / 2 }}
        >
          <Icon as={User} className="text-secondary-foreground" size={size / 2} />
        </View>
      }
    />
  );
}
