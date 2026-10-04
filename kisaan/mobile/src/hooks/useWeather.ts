// Weather data hook: resolves a saved location and keeps a snapshot fresh.

import { useCallback, useEffect, useState } from 'react';
import {
  fetchWeather,
  loadSavedLocation,
  saveLocation,
  type SavedLocation,
  type WeatherSnapshot,
} from '@/services/weather';
import { useApp } from '@/store/AppStore';

interface WeatherState {
  location: SavedLocation | null;
  snapshot: WeatherSnapshot | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  stale: boolean;
}

export function useWeather(autoLoad = true) {
  const { lang } = useApp();
  const [state, setState] = useState<WeatherState>({
    location: null,
    snapshot: null,
    loading: false,
    error: null,
    fromCache: false,
    stale: false,
  });

  const load = useCallback(
    async (loc: SavedLocation | null, force = false) => {
      const location = loc ?? (await loadSavedLocation());
      if (!location) {
        setState({ location: null, snapshot: null, loading: false, error: null, fromCache: false, stale: false });
        return;
      }
      setState((s) => ({ ...s, location, loading: true, error: null }));
      try {
        const res = await fetchWeather(location, lang, force);
        setState({
          location,
          snapshot: res.snapshot,
          loading: false,
          error: null,
          fromCache: res.fromCache,
          stale: res.stale,
        });
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: String(e) }));
      }
    },
    [lang],
  );

  const setLocation = useCallback(
    async (loc: SavedLocation) => {
      await saveLocation(loc);
      await load(loc, true);
    },
    [load],
  );

  const refresh = useCallback(() => load(null, true), [load]);

  useEffect(() => {
    if (autoLoad) load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, lang]);

  return { ...state, load, setLocation, refresh };
}
