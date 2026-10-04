import type { Language } from '@/types/models';
import { en, type TKey } from './en';
import { hi } from './hi';

const dicts: Record<Language, Record<string, string>> = { en, hi };

/**
 * Translate a key, optionally interpolating {vars}.
 * Falls back to English, then to the key itself.
 */
export function translate(
  lang: Language,
  key: TKey | string,
  vars?: Record<string, string | number>,
): string {
  const dict = dicts[lang] || en;
  let s = dict[key as string] ?? en[key as TKey] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

export type TranslateFn = (key: TKey | string, vars?: Record<string, string | number>) => string;

export type { TKey };
