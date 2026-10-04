import type { CropSeason } from '@/types/models';

export interface CropInfo {
  key: string;
  en: string;
  hi: string;
  /** typical days from sowing to harvest */
  durationDays: number;
  seasons: CropSeason[];
}

export const CROP_CATALOG: CropInfo[] = [
  { key: 'wheat', en: 'Wheat', hi: 'गेहूं', durationDays: 140, seasons: ['rabi'] },
  { key: 'paddy', en: 'Paddy (Rice)', hi: 'धान (चावल)', durationDays: 150, seasons: ['kharif'] },
  { key: 'maize', en: 'Maize', hi: 'मक्का', durationDays: 120, seasons: ['kharif', 'rabi'] },
  { key: 'mustard', en: 'Mustard', hi: 'सरसों', durationDays: 130, seasons: ['rabi'] },
  { key: 'soybean', en: 'Soybean', hi: 'सोयाबीन', durationDays: 110, seasons: ['kharif'] },
  { key: 'cotton', en: 'Cotton', hi: 'कपास', durationDays: 180, seasons: ['kharif'] },
  { key: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना', durationDays: 360, seasons: ['kharif', 'zaid'] },
  { key: 'potato', en: 'Potato', hi: 'आलू', durationDays: 90, seasons: ['rabi'] },
  { key: 'onion', en: 'Onion', hi: 'प्याज', durationDays: 110, seasons: ['kharif', 'rabi'] },
  { key: 'tomato', en: 'Tomato', hi: 'टमाटर', durationDays: 90, seasons: ['kharif', 'rabi', 'zaid'] },
  { key: 'chickpea', en: 'Chickpea (Gram)', hi: 'चना (ग्राम)', durationDays: 100, seasons: ['rabi'] },
  { key: 'bajra', en: 'Pearl Millet (Bajra)', hi: 'बाजरा', durationDays: 85, seasons: ['kharif'] },
  { key: 'jowar', en: 'Sorghum (Jowar)', hi: 'ज्वार', durationDays: 100, seasons: ['kharif', 'rabi'] },
  { key: 'groundnut', en: 'Groundnut', hi: 'मूंगफली', durationDays: 120, seasons: ['kharif'] },
  { key: 'arhar', en: 'Pigeon Pea (Arhar/Tur)', hi: 'अरहर/तुअर', durationDays: 160, seasons: ['kharif'] },
  { key: 'moong', en: 'Green Gram (Moong)', hi: 'मूंग', durationDays: 70, seasons: ['zaid', 'kharif'] },
  { key: 'urad', en: 'Black Gram (Urad)', hi: 'उड़द', durationDays: 90, seasons: ['kharif'] },
  { key: 'barley', en: 'Barley', hi: 'जौ', durationDays: 130, seasons: ['rabi'] },
  { key: 'sesame', en: 'Sesame (Til)', hi: 'तिल', durationDays: 90, seasons: ['kharif'] },
  { key: 'guar', en: 'Guar (Cluster Bean)', hi: 'ग्वार', durationDays: 120, seasons: ['kharif'] },
  { key: 'jute', en: 'Jute', hi: 'पटसन', durationDays: 120, seasons: ['kharif'] },
  { key: 'chilli', en: 'Chilli', hi: 'मिर्च', durationDays: 150, seasons: ['kharif', 'rabi'] },
  { key: 'brinjal', en: 'Brinjal', hi: 'बैंगन', durationDays: 120, seasons: ['kharif', 'rabi', 'zaid'] },
  { key: 'cauliflower', en: 'Cauliflower', hi: 'फूलगोभी', durationDays: 90, seasons: ['rabi'] },
  { key: 'banana', en: 'Banana', hi: 'केला', durationDays: 300, seasons: ['kharif', 'rabi', 'zaid'] },
  { key: 'mango', en: 'Mango (orchard)', hi: 'आम (बाग)', durationDays: 365, seasons: ['kharif', 'rabi', 'zaid'] },
  { key: 'other', en: 'Other crop', hi: 'अन्य फसल', durationDays: 120, seasons: ['kharif', 'rabi', 'zaid'] },
];

export function cropByKey(key: string): CropInfo | undefined {
  return CROP_CATALOG.find((c) => c.key === key);
}

export function cropName(key: string, lang: 'en' | 'hi', customName?: string): string {
  if (key === 'other' && customName) return customName;
  const info = cropByKey(key);
  if (!info) return customName || key;
  return lang === 'hi' ? info.hi : info.en;
}

export const SOIL_TYPES = [
  { key: 'alluvial', en: 'Alluvial soil', hi: 'जलोढ़ मिट्टी' },
  { key: 'black', en: 'Black soil (Regur)', hi: 'काली मिट्टी (रेगुर)' },
  { key: 'red', en: 'Red soil', hi: 'लाल मिट्टी' },
  { key: 'laterite', en: 'Laterite soil', hi: 'लेटेराइट मिट्टी' },
  { key: 'sandy', en: 'Sandy soil', hi: 'रेतीली मिट्टी' },
  { key: 'loamy', en: 'Loamy soil', hi: 'दोमट मिट्टी' },
  { key: 'clay', en: 'Clay soil', hi: 'चिकनी मिट्टी' },
  { key: 'mixed', en: 'Mixed / Not sure', hi: 'मिश्रित / पता नहीं' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
