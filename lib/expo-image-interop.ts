import { Image, type ImageProps } from 'expo-image';
import { useCssElement } from 'react-native-css';

/**
 * expo-image is a third-party component, so react-native-css's babel/metro plugin
 * does NOT map `className` to it automatically (only core RN components get that for
 * free). Without this, width/height set via className are dropped and the image
 * renders at 0×0 — i.e. invisible everywhere it's used.
 *
 * Wraps expo-image's `Image` with `useCssElement` (the same pattern
 * `components/ui/icon.tsx` uses for Lucide icons) so `className` sizing works.
 * Use this in place of importing `Image` from `expo-image` directly whenever the
 * image needs Tailwind sizing classes rather than an explicit `style` prop.
 */
export function CssImage(props: ImageProps & { className?: string }) {
  return useCssElement(Image, props, { className: 'style' });
}
