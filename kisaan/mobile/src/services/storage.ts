import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  data: 'kisaan:data:v1',
  lang: 'kisaan:lang:v1',
  location: 'kisaan:location:v1',
  weatherCache: (lat: number, lon: number) => `kisaan:weather:${lat.toFixed(2)},${lon.toFixed(2)}`,
};

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage failures are non-fatal for the demo app
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
