// Core data models for Kisaan (farmer-owned data)

export type Language = 'en' | 'hi';

export type AreaUnit = 'acre' | 'hectare' | 'bigha';
export type IrrigationType = 'irrigated' | 'rainfed' | 'both';
export type CropSeason = 'kharif' | 'rabi' | 'zaid';
export type CropStatus = 'planned' | 'sown' | 'harvested';

export type ActivityType =
  | 'sowing'
  | 'irrigation'
  | 'fertilizer'
  | 'pesticide'
  | 'weeding'
  | 'harvest'
  | 'other';

export type TxnType = 'income' | 'expense';

export type ExpenseCategory =
  | 'seed'
  | 'fertilizer'
  | 'pesticide'
  | 'irrigation'
  | 'labour'
  | 'machinery'
  | 'land'
  | 'transport'
  | 'other';

export type IncomeCategory =
  | 'cropSale'
  | 'livestock'
  | 'subsidy'
  | 'rental'
  | 'labour'
  | 'other';

export type ReminderCategory =
  | 'irrigation'
  | 'fertilizer'
  | 'pesticide'
  | 'sowing'
  | 'harvest'
  | 'payment'
  | 'other';

export interface Profile {
  id: string;
  name: string;
  phone: string;
  /** Demo-only local hash. The backend uses real bcrypt hashing. */
  passwordHash: string;
  village: string;
  district: string;
  state: string;
  language: Language;
  lat?: number | null;
  lon?: number | null;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  village?: string;
  district?: string;
  state?: string;
  areaValue: number;
  areaUnit: AreaUnit;
  irrigation: IrrigationType;
  soilType?: string; // key from SOIL_TYPES
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id: string;
  farmId: string;
  /** key from crop catalog, or 'other' */
  cropKey: string;
  /** free text name when cropKey === 'other' */
  customName?: string;
  variety?: string;
  season: CropSeason;
  sowingDate: string; // YYYY-MM-DD
  expectedHarvestDate?: string; // YYYY-MM-DD
  areaValue?: number;
  areaUnit?: AreaUnit;
  status: CropStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  cropId: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  notes?: string;
  cost?: number;
}

export interface Transaction {
  id: string;
  type: TxnType;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  cropId?: string;
  farmId?: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  category?: ReminderCategory;
  cropId?: string;
  farmId?: string;
  done: boolean;
  createdAt: string;
  /** local notification id if scheduled */
  notificationId?: string;
}

export interface AppData {
  profile: Profile | null;
  farms: Farm[];
  crops: Crop[];
  activities: Activity[];
  transactions: Transaction[];
  reminders: Reminder[];
}

export const emptyData: AppData = {
  profile: null,
  farms: [],
  crops: [],
  activities: [],
  transactions: [],
  reminders: [],
};
