import type { QueryKey } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/auth.types';

export interface CursorPage<T> {
  data: T[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UseListQueryOptions<T, P extends CursorPage<T> = CursorPage<T>> {
  queryKey: QueryKey;
  /** Called with no cursor for the first page, and with `nextCursor` for `loadMore`. */
  queryFn: (cursor?: string) => Promise<P>;
  enabled?: boolean;
  staleTime?: number;
}

export interface UseDetailQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean | 'always';
}

export interface UseApiMutationOptions<TData, TVariables, TContext = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueryKeys?: QueryKey[];
  /** Runs before the request fires — apply an optimistic update here and return a snapshot for rollback. */
  onMutate?: (variables: TVariables) => TContext | Promise<TContext>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** `context` is whatever `onMutate` returned — use it to roll back the optimistic update. */
  onError?: (
    error: AxiosError<ApiError>,
    variables: TVariables,
    context: TContext | undefined
  ) => void;
  /** Maps field-level API validation errors (422) onto a form, e.g. react-hook-form's `setError`. */
  setFieldErrors?: (field: string, message: string) => void;
}

export type { ApiError };
