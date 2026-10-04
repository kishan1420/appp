// Weather + geocoding via Open-Meteo (free, no API key).
// Cached on-device for 30 minutes; stale cache is shown when offline.

import { loadJSON, saveJSON, KEYS } from './storage';
import type { Language } from '@/types/models';

export interface Place {
  name: string;
  admin1?: string; // state
  country?: string;
  latitude: number;
  longitude: number;
}

export interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
}

export type WeatherCondition =
  | 'clear'
  | 'mainlyClear'
  | 'partCloud'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'snow'
  | 'showers'
  | 'thunder';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  rainChance: number | null;
  code: number;
}

export interface DayForecast {
  date: string; // YYYY-MM-DD
  min: number;
  max: number;
  rainChance: number | null;
  code: number;
}

export interface WeatherSnapshot {
  placeName: string;
  lat: number;
  lon: number;
  fetchedAt: number; // epoch ms
  current: CurrentWeather;
  daily: DayForecast[];
}

const CACHE_TTL_MS = 30 * 60 * 1000;

export function weatherCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partCloud';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code === 61 || code === 63 || code === 66 || code === 67) return 'rain';
  if (code === 65 || code === 82) return 'heavyRain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code === 80 || code === 81) return 'showers';
  return 'thunder'; // 95, 96, 99
}

/** i18n key for the condition label: wxc.clear, wxc.rain, … */
export function conditionLabelKey(code: number): string {
  return `wxc.${weatherCondition(code)}`;
}

export async function geocode(query: string, lang: Language): Promise<Place[]> {
  const url =
    'https://geocoding-api.open-meteo.com/v1/search?count=6&format=json' +
    `&language=${lang === 'hi' ? 'hi' : 'en'}&name=${encodeURIComponent(query.trim())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geocode ${res.status}`);
  const json = await res.json();
  const results: any[] = json?.results ?? [];
  return results.map((r) => ({
    name: r.name as string,
    admin1: r.admin1 as string | undefined,
    country: r.country as string | undefined,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
  }));
}

export async function fetchWeather(
  loc: SavedLocation,
  lang: Language,
  forceRefresh = false,
): Promise<{ snapshot: WeatherSnapshot; fromCache: boolean; stale: boolean }> {
  const cacheKey = KEYS.weatherCache(loc.lat, loc.lon);

  if (!forceRefresh) {
    const cached = await loadJSON<WeatherSnapshot>(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return { snapshot: cached, fromCache: true, stale: false };
    }
  }

  try {
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${loc.lat}&longitude=${loc.lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=auto&forecast_days=7';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`weather ${res.status}`);
    const json = await res.json();

    const snapshot: WeatherSnapshot = {
      placeName: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      fetchedAt: Date.now(),
      current: {
        temp: Math.round(json.current.temperature_2m),
        feelsLike: Math.round(json.current.apparent_temperature),
        humidity: Math.round(json.current.relative_humidity_2m),
        wind: Math.round(json.current.wind_speed_10m),
        rainChance:
          json.current.precipitation_probability == null
            ? null
            : Math.round(json.current.precipitation_probability),
        code: json.current.weather_code,
      },
      daily: (json.daily.time as string[]).map((date, i) => ({
        date,
        min: Math.round(json.daily.temperature_2m_min[i]),
        max: Math.round(json.daily.temperature_2m_max[i]),
        rainChance:
          json.daily.precipitation_probability_max?.[i] == null
            ? null
            : Math.round(json.daily.precipitation_probability_max[i]),
        code: json.daily.weather_code[i],
      })),
    };
    await saveJSON(cacheKey, snapshot);
    return { snapshot, fromCache: false, stale: false };
  } catch (e) {
    // Offline or API failure — fall back to any cached data, even stale.
    const cached = await loadJSON<WeatherSnapshot>(cacheKey);
    if (cached) return { snapshot: cached, fromCache: true, stale: true };
    throw e;
  }
}

// --- Saved location helpers -------------------------------------------------

export async function loadSavedLocation(): Promise<SavedLocation | null> {
  return loadJSON<SavedLocation>(KEYS.location);
}

export async function saveLocation(loc: SavedLocation): Promise<void> {
  await saveJSON(KEYS.location, loc);
}
