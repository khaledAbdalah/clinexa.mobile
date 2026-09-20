import '@/lib/force-rtl';

import { useAuthBootstrap } from './use-auth-bootstrap';
import { useLoadFonts } from './use-load-fonts';

/**
 * Runs every app-boot task (fonts, auth, ...) in parallel — each task owns
 * its logic in its own hook; this one only orchestrates them and reports
 * readiness once all of them are done.
 */
export function useAppBootstrap() {
  const fontsLoaded = useLoadFonts();
  const authChecked = useAuthBootstrap();

  return fontsLoaded && authChecked;
}
