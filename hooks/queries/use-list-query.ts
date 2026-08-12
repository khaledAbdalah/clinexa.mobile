import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiError, CursorPage, UseListQueryOptions } from './types';

/**
 * Generic hook for cursor-paginated list queries.
 * Pass a service method as queryFn - this hook never talks to `api` directly.
 * Exposes `setItems` so callers can apply optimistic patches (with a snapshot for rollback).
 */
export function useListQuery<T, P extends CursorPage<T> = CursorPage<T>>(
  options: UseListQueryOptions<T, P>
) {
  const { queryKey, queryFn, enabled = true, staleTime = 1000 * 60 * 5 } = options;

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: () => queryFn(),
    enabled,
    staleTime,
  });

  // Seed state from the query's cached data on mount (lazy initializers) rather than
  // starting empty and waiting for a sync. On a stack screen that re-mounts on every
  // entry (unlike a persistent tab), an empty first render would flash the empty state.
  const [items, setItems] = useState<T[]>(() => data?.data ?? []);
  const [nextCursor, setNextCursor] = useState<string | null>(() => data?.nextCursor ?? null);
  const [hasMore, setHasMore] = useState(() => data?.hasMore ?? false);
  const [total, setTotal] = useState(() => data?.total ?? 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Raw latest page, so callers can read extra response fields (e.g. facets) from
  // cached data - available even on a cache hit where queryFn never re-runs.
  const [lastPage, setLastPage] = useState<P | undefined>(() => data);

  // Resync the locally-mutated list back to server state whenever `data` changes - e.g.
  // the first page resolving, or an invalidation from a mutation/socket event.
  //
  // This runs DURING render (React's "adjusting state when a prop changes" pattern) rather
  // than in a layout/passive effect on purpose: an effect syncs `items` one commit AFTER
  // `data` arrives, leaving a window where react-query already reports `isLoading`/`isFetching`
  // as false (data present) but `items` is still stale/empty. Any unrelated re-render that
  // commits inside that window (e.g. cart/wishlist queries resolving for a logged-in user)
  // paints an empty list / `NoResultsState` before the sync lands - the "blank page then rows
  // pop in" bug. Syncing during render means no committed frame ever has `data` and `items`
  // disagreeing, whatever triggers the render.
  const syncedData = useRef(data);
  if (syncedData.current !== data) {
    syncedData.current = data;
    setItems(data?.data ?? []);
    setNextCursor(data?.nextCursor ?? null);
    setHasMore(data?.hasMore ?? false);
    setTotal(data?.total ?? 0);
    setLastPage(data);
  }

  const loadMore = async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);
    try {
      const page = await queryFn(nextCursor);
      setItems((prev) => [...prev, ...page.data]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
      setLastPage(page);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    items,
    setItems,
    total,
    hasMore,
    lastPage,
    isLoading,
    isFetching,
    isLoadingMore,
    loadMore,
    error: error as AxiosError<ApiError> | null,
    refetch,
  };
}
