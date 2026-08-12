import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

// Module-level singleton (rather than created inside the provider via useState) so that
// code outside React — e.g. store/auth.ts on logout — can import it and clear cached
// data that belongs to the previous user's session.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      // Don't retry 401s — the axios interceptor already handles refresh-and-retry once;
      // retrying here just re-triggers a doomed refresh (and forceLogout) per query.
      retry: (failureCount, error) =>
        (error as AxiosError)?.response?.status !== 401 && failureCount < 1,
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
