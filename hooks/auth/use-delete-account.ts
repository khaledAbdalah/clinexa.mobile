import { router } from 'expo-router';

import { api } from '@/config/api';
import { endpoints } from '@/constants/endpoints';
import { routes } from '@/constants/routes';
import { useApiMutation } from '@/hooks/queries/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { usePushTokenStore } from '@/store/push-token';
import type { DeleteAccountRequest } from '@/types/auth.types';

/**
 * Deletes the current patient's account (`DELETE /account/profile`, password-confirmed).
 * `temporary` keeps all data and is reverted by the next login; `permanent` erases personal
 * identifiers while the server keeps de-identified clinical/financial records.
 *
 * Push-token unregistration runs BEFORE the delete call (it needs a live bearer
 * token). Afterwards the session is dead server-side, so we use `forceLogout`
 * (local-only: clears tokens/push record/query cache) instead of `logout`,
 * which would hit the now-unauthorized logout endpoint.
 */
export function useDeleteAccount() {
  const { showSuccess } = useToast();

  return useApiMutation<{ message: string }, DeleteAccountRequest>({
    mutationFn: async (body) => {
      await usePushTokenStore.getState().unregister();
      const { data } = await api.delete(endpoints.account.deleteAccount, { data: body });
      return data;
    },
    onSuccess: async (_data, { type }) => {
      await useAuthStore.getState().forceLogout();
      router.replace(routes.welcome);
      showSuccess(type === 'temporary' ? 'تم تعطيل حسابك مؤقتًا' : 'تم حذف حسابك نهائيًا');
    },
  });
}
