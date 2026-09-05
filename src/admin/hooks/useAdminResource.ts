import { useCallback, useEffect, useRef, useState } from 'react';
import { adminErrorMessage } from '../services/adminApi';

interface UseAdminResourceResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  /** True while a background (non-first) refresh is in flight. */
  refreshing: boolean;
}

/**
 * Loads an admin resource from the backend with loading/error state and an
 * optional polling interval (auto-refresh). Re-fetches whenever `deps` change
 * or `reload()` is called.
 */
export function useAdminResource<T>(
  load: () => Promise<T>,
  deps: unknown[] = [],
  pollMs?: number,
): UseAdminResourceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const hasLoaded = useRef(false);

  const reload = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let active = true;
    hasLoaded.current = data !== null;

    const run = async () => {
      if (hasLoaded.current) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const result = await load();
        if (active) {
          setData(result);
          hasLoaded.current = true;
          setLoading(false);
          setRefreshing(false);
        }
      } catch (cause) {
        if (active) {
          setLoading(false);
          setRefreshing(false);
          setError(adminErrorMessage(cause));
        }
      }
    };

    void run();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  useEffect(() => {
    if (!pollMs) return;
    const id = window.setInterval(() => setTick(t => t + 1), pollMs);
    return () => window.clearInterval(id);
  }, [pollMs]);

  return { data, loading, error, reload, refreshing };
}
