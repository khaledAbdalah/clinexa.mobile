import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiError, UseDetailQueryOptions } from './types';

/**
 * Generic hook for fetching a single resource.
 * Pass a service method as queryFn - this hook never talks to `api` directly.
 */
export function useDetailQuery<T>(options: UseDetailQueryOptions<T>) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 1000 * 60 * 5,
    gcTime,
    refetchOnMount,
  } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    refetchOnMount,
  });

  return {
    data,
    isLoading,
    error: error as AxiosError<ApiError> | null,
    refetch,
  };
}
