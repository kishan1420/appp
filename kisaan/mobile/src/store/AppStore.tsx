// Central app store: local-first data (AsyncStorage), auth, and i18n.
// Screens consume everything through useApp().

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as Localization from 'expo-localization';

import type {
  Activity,
  AppData,
  Crop,
  Farm,
  Language,
  Profile,
  Reminder,
  Transaction,
} from '@/types/models';
import { emptyData } from '@/types/models';
import { KEYS, loadJSON, saveJSON } from '@/services/storage';
import { cancelReminderNotification, scheduleReminderNotification } from '@/services/notifications';
import { translate, type TranslateFn, type TKey } from '@/i18n';
import { genId, localHash, todayISO } from '@/utils/helpers';

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
  village: string;
  district: string;
  state: string;
  language: Language;
}

export interface SaveReminderInput {
  id?: string;
  title: string;
  date: string;
  time?: string;
  category?: Reminder['category'];
  cropId?: string;
  farmId?: string;
  done?: boolean;
  notify?: boolean;
}

interface AppContextValue extends AppData {
  ready: boolean;
  lang: Language;
  t: TranslateFn;
  setLang: (l: Language) => void;

  register: (input: RegisterInput) => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (patch: Partial<Omit<Profile, 'id' | 'passwordHash'>>) => void;

  saveFarm: (farm: Partial<Farm> & { id?: string }) => Farm;
  deleteFarm: (id: string) => void;

  saveCrop: (crop: Partial<Crop> & { id?: string }) => Crop;
  deleteCrop: (id: string) => void;

  saveActivity: (act: Partial<Activity> & { id?: string }) => Activity;
  deleteActivity: (id: string) => void;

  saveTransaction: (txn: Partial<Transaction> & { id?: string }) => Transaction;
  deleteTransaction: (id: string) => void;

  saveReminder: (rem: SaveReminderInput) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string, done: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function deviceLang(): Language {
  try {
    const code = Localization.getLocales()[0]?.languageCode;
    return code === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [lang, setLangState] = useState<Language>('en');
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  // --- Hydrate from storage ------------------------------------------------
  useEffect(() => {
    (async () => {
      const [stored, storedLang] = await Promise.all([
        loadJSON<AppData>(KEYS.data),
        loadJSON<Language>(KEYS.lang),
      ]);
      if (stored) setData({ ...emptyData, ...stored });
      setLangState(stored?.profile?.language ?? storedLang ?? deviceLang());
      hydrated.current = true;
      setReady(true);
    })();
  }, []);

  // --- Persist on change ---------------------------------------------------
  useEffect(() => {
    if (!hydrated.current) return;
    saveJSON(KEYS.data, data);
  }, [data]);

  useEffect(() => {
    if (!hydrated.current) return;
    saveJSON(KEYS.lang, lang);
  }, [lang]);

  const t = useCallback<TranslateFn>(
    (key: TKey | string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );

  const setLang = useCallback(
    (l: Language) => {
      setLangState(l);
      setData((d) => (d.profile ? { ...d, profile: { ...d.profile, language: l } } : d));
    },
    [],
  );

  // --- Auth ----------------------------------------------------------------
  const register = useCallback(async (input: RegisterInput) => {
    const now = new Date().toISOString();
    const profile: Profile = {
      id: genId('p'),
      name: input.name.trim(),
      phone: input.phone.trim(),
      passwordHash: localHash(input.password),
      village: input.village.trim(),
      district: input.district.trim(),
      state: input.state,
      language: input.language,
      createdAt: now,
    };
    setLangState(input.language);
    setData((d) => ({ ...emptyData, profile }));
  }, []);

  const login = useCallback(
    async (phone: string, password: string): Promise<boolean> => {
      const p = data.profile;
      if (!p) return false;
      return p.phone === phone.trim() && p.passwordHash === localHash(password);
    },
    [data.profile],
  );

  const logout = useCallback(() => {
    setData((d) => ({ ...emptyData }));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Omit<Profile, 'id' | 'passwordHash'>>) => {
      setData((d) => (d.profile ? { ...d, profile: { ...d.profile, ...patch } } : d));
      if (patch.language) setLangState(patch.language);
    },
    [],
  );

  // --- Farms ----------------------------------------------------------------
  const saveFarm = useCallback((farm: Partial<Farm> & { id?: string }): Farm => {
    const now = new Date().toISOString();
    let saved!: Farm;
    setData((d) => {
      if (farm.id) {
        const idx = d.farms.findIndex((f) => f.id === farm.id);
        if (idx < 0) return d;
        saved = { ...d.farms[idx], ...farm, updatedAt: now } as Farm;
        const farms = [...d.farms];
        farms[idx] = saved;
        return { ...d, farms };
      }
      saved = {
        id: genId('f'),
        name: '',
        areaValue: 0,
        areaUnit: 'acre',
        irrigation: 'irrigated',
        createdAt: now,
        updatedAt: now,
        ...farm,
      } as Farm;
      return { ...d, farms: [saved, ...d.farms] };
    });
    return saved;
  }, []);

  const deleteFarm = useCallback((id: string) => {
    setData((d) => {
      const cropIds = d.crops.filter((c) => c.farmId === id).map((c) => c.id);
      return {
        ...d,
        farms: d.farms.filter((f) => f.id !== id),
        crops: d.crops.filter((c) => c.farmId !== id),
        activities: d.activities.filter((a) => !cropIds.includes(a.cropId)),
        reminders: d.reminders.map((r) =>
          r.farmId === id || (r.cropId && cropIds.includes(r.cropId))
            ? { ...r, farmId: undefined, cropId: undefined }
            : r,
        ),
      };
    });
  }, []);

  // --- Crops -----------------------------------------------------------------
  const saveCrop = useCallback((crop: Partial<Crop> & { id?: string }): Crop => {
    const now = new Date().toISOString();
    let saved!: Crop;
    setData((d) => {
      if (crop.id) {
        const idx = d.crops.findIndex((c) => c.id === crop.id);
        if (idx < 0) return d;
        saved = { ...d.crops[idx], ...crop, updatedAt: now } as Crop;
        const crops = [...d.crops];
        crops[idx] = saved;
        return { ...d, crops };
      }
      saved = {
        id: genId('c'),
        farmId: '',
        cropKey: 'other',
        season: 'kharif',
        sowingDate: todayISO(),
        status: 'planned',
        createdAt: now,
        updatedAt: now,
        ...crop,
      } as Crop;
      return { ...d, crops: [saved, ...d.crops] };
    });
    return saved;
  }, []);

  const deleteCrop = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      crops: d.crops.filter((c) => c.id !== id),
      activities: d.activities.filter((a) => a.cropId !== id),
      reminders: d.reminders.map((r) => (r.cropId === id ? { ...r, cropId: undefined } : r)),
    }));
  }, []);

  // --- Activities --------------------------------------------------------------
  const saveActivity = useCallback(
    (act: Partial<Activity> & { id?: string }): Activity => {
      let saved!: Activity;
      setData((d) => {
        if (act.id) {
          const idx = d.activities.findIndex((a) => a.id === act.id);
          if (idx < 0) return d;
          saved = { ...d.activities[idx], ...act } as Activity;
          const activities = [...d.activities];
          activities[idx] = saved;
          return { ...d, activities };
        }
        saved = {
          id: genId('a'),
          cropId: '',
          type: 'other',
          date: todayISO(),
          ...act,
        } as Activity;
        return { ...d, activities: [saved, ...d.activities] };
      });
      return saved;
    },
    [],
  );

  const deleteActivity = useCallback((id: string) => {
    setData((d) => ({ ...d, activities: d.activities.filter((a) => a.id !== id) }));
  }, []);

  // --- Transactions --------------------------------------------------------------
  const saveTransaction = useCallback(
    (txn: Partial<Transaction> & { id?: string }): Transaction => {
      const now = new Date().toISOString();
      let saved!: Transaction;
      setData((d) => {
        if (txn.id) {
          const idx = d.transactions.findIndex((t) => t.id === txn.id);
          if (idx < 0) return d;
          saved = { ...d.transactions[idx], ...txn } as Transaction;
          const transactions = [...d.transactions];
          transactions[idx] = saved;
          return { ...d, transactions };
        }
        saved = {
          id: genId('t'),
          type: 'expense',
          amount: 0,
          category: 'other',
          date: todayISO(),
          createdAt: now,
          ...txn,
        } as Transaction;
        return { ...d, transactions: [saved, ...d.transactions] };
      });
      return saved;
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) }));
  }, []);

  // --- Reminders ------------------------------------------------------------------
  const saveReminder = useCallback(async (input: SaveReminderInput): Promise<Reminder> => {
    const now = new Date().toISOString();
    let saved!: Reminder;
    let previousNotificationId: string | undefined;

    setData((d) => {
      if (input.id) {
        const idx = d.reminders.findIndex((r) => r.id === input.id);
        if (idx < 0) return d;
        previousNotificationId = d.reminders[idx].notificationId;
        saved = {
          ...d.reminders[idx],
          ...input,
          done: input.done ?? d.reminders[idx].done,
          notificationId: undefined, // re-scheduled below if requested
        } as Reminder;
        const reminders = [...d.reminders];
        reminders[idx] = saved;
        return { ...d, reminders };
      }
      saved = {
        id: genId('r'),
        title: input.title,
        date: input.date,
        time: input.time,
        category: input.category,
        cropId: input.cropId,
        farmId: input.farmId,
        done: input.done ?? false,
        createdAt: now,
      } as Reminder;
      return { ...d, reminders: [saved, ...d.reminders] };
    });

    // Cancel any previously scheduled notification, schedule a new one if asked.
    await cancelReminderNotification(previousNotificationId);
    if (input.notify && !input.done) {
      const nid = await scheduleReminderNotification(
        saved.id,
        'Kisaan: ' + translate(lang, 'rem.title'),
        saved.title,
        saved.date,
        saved.time,
      );
      if (nid) {
        saved = { ...saved, notificationId: nid };
        setData((d) => ({
          ...d,
          reminders: d.reminders.map((r) => (r.id === saved.id ? saved : r)),
        }));
      }
    }
    return saved;
  }, [lang]);

  const deleteReminder = useCallback(async (id: string) => {
    let nid: string | undefined;
    setData((d) => {
      const target = d.reminders.find((r) => r.id === id);
      nid = target?.notificationId;
      return { ...d, reminders: d.reminders.filter((r) => r.id !== id) };
    });
    await cancelReminderNotification(nid);
  }, []);

  const toggleReminder = useCallback(async (id: string, done: boolean) => {
    let nid: string | undefined;
    setData((d) => ({
      ...d,
      reminders: d.reminders.map((r) => {
        if (r.id !== id) return r;
        nid = r.notificationId;
        return { ...r, done, notificationId: done ? undefined : r.notificationId };
      }),
    }));
    if (done) await cancelReminderNotification(nid);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...data,
      ready,
      lang,
      t,
      setLang,
      register,
      login,
      logout,
      updateProfile,
      saveFarm,
      deleteFarm,
      saveCrop,
      deleteCrop,
      saveActivity,
      deleteActivity,
      saveTransaction,
      deleteTransaction,
      saveReminder,
      deleteReminder,
      toggleReminder,
    }),
    [
      data, ready, lang, t, setLang, register, login, logout, updateProfile,
      saveFarm, deleteFarm, saveCrop, deleteCrop, saveActivity, deleteActivity,
      saveTransaction, deleteTransaction, saveReminder, deleteReminder, toggleReminder,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
