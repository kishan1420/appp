// Mandi (market) price sample dataset modelled on Agmarknet daily price format.
// NOTE: These are realistic SAMPLE prices for demo purposes, not a live feed.
// In production this data comes from the backend / Agmarknet API adapter.

export interface MandiPrice {
  id: string;
  cropKey: string; // key from CROP_CATALOG
  variety?: string;
  market: string;
  district: string;
  state: string;
  minPrice: number; // ₹ per quintal
  modalPrice: number;
  maxPrice: number;
  unit: string;
  date: string; // YYYY-MM-DD
}

export const MANDI_DATA_AS_OF = '2026-10-01';
export const MANDI_SOURCE = {
  en: 'Sample data in Agmarknet format (demo). Live prices will sync from agmarknet.gov.in.',
  hi: 'Agmarknet प्रारूप में नमूना डेटा (डेमो)। लाइव भाव agmarknet.gov.in से सिंक होंगे।',
};

export const MANDI_STATES = [
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Rajasthan',
  'Bihar',
  'Gujarat',
  'Karnataka',
  'Telangana',
  'West Bengal',
  'Delhi',
];

const q = '₹/quintal';

export const MANDI_PRICES: MandiPrice[] = [
  // ---- Wheat ----
  { id: 'm1', cropKey: 'wheat', variety: 'Lokwan', market: 'Muzaffarnagar', district: 'Muzaffarnagar', state: 'Uttar Pradesh', minPrice: 2580, modalPrice: 2650, maxPrice: 2720, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm2', cropKey: 'wheat', variety: 'Dara', market: 'Khanna', district: 'Ludhiana', state: 'Punjab', minPrice: 2520, modalPrice: 2610, maxPrice: 2700, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm3', cropKey: 'wheat', variety: 'Sharbati', market: 'Indore', district: 'Indore', state: 'Madhya Pradesh', minPrice: 2700, modalPrice: 2820, maxPrice: 2950, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm4', cropKey: 'wheat', variety: 'Dara', market: 'Karnal', district: 'Karnal', state: 'Haryana', minPrice: 2540, modalPrice: 2625, maxPrice: 2710, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Paddy ----
  { id: 'm5', cropKey: 'paddy', variety: 'Common', market: 'Saharanpur', district: 'Saharanpur', state: 'Uttar Pradesh', minPrice: 2280, modalPrice: 2350, maxPrice: 2420, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm6', cropKey: 'paddy', variety: 'Basmati 1121', market: 'Karnal', district: 'Karnal', state: 'Haryana', minPrice: 3850, modalPrice: 4100, maxPrice: 4350, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm7', cropKey: 'paddy', variety: 'Sona Masoori', market: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', minPrice: 2320, modalPrice: 2400, maxPrice: 2480, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm8', cropKey: 'paddy', variety: 'Common', market: 'Raipur', district: 'Raipur', state: 'Chhattisgarh', minPrice: 2250, modalPrice: 2320, maxPrice: 2400, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Maize ----
  { id: 'm9', cropKey: 'maize', variety: 'Yellow', market: 'Davangere', district: 'Davangere', state: 'Karnataka', minPrice: 2100, modalPrice: 2200, maxPrice: 2300, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm10', cropKey: 'maize', variety: 'Yellow', market: 'Nizamabad', district: 'Nizamabad', state: 'Telangana', minPrice: 2050, modalPrice: 2150, maxPrice: 2260, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm11', cropKey: 'maize', variety: 'Hybrid Red', market: 'Khanna', district: 'Ludhiana', state: 'Punjab', minPrice: 2120, modalPrice: 2210, maxPrice: 2320, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Mustard ----
  { id: 'm12', cropKey: 'mustard', variety: 'Black', market: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', minPrice: 5450, modalPrice: 5650, maxPrice: 5900, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm13', cropKey: 'mustard', variety: 'Black', market: 'Alwar', district: 'Alwar', state: 'Rajasthan', minPrice: 5400, modalPrice: 5600, maxPrice: 5850, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm14', cropKey: 'mustard', variety: 'Black', market: 'Morena', district: 'Morena', state: 'Madhya Pradesh', minPrice: 5350, modalPrice: 5550, maxPrice: 5800, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Soybean ----
  { id: 'm15', cropKey: 'soybean', variety: 'Yellow', market: 'Indore', district: 'Indore', state: 'Madhya Pradesh', minPrice: 4350, modalPrice: 4550, maxPrice: 4780, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm16', cropKey: 'soybean', variety: 'Yellow', market: 'Latur', district: 'Latur', state: 'Maharashtra', minPrice: 4300, modalPrice: 4500, maxPrice: 4750, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Cotton ----
  { id: 'm17', cropKey: 'cotton', variety: 'Medium Staple', market: 'Jalna', district: 'Jalna', state: 'Maharashtra', minPrice: 7100, modalPrice: 7400, maxPrice: 7700, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm18', cropKey: 'cotton', variety: 'J-34', market: 'Bathinda', district: 'Bathinda', state: 'Punjab', minPrice: 7200, modalPrice: 7500, maxPrice: 7800, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm19', cropKey: 'cotton', variety: 'Medium Staple', market: 'Rajkot', district: 'Rajkot', state: 'Gujarat', minPrice: 7050, modalPrice: 7350, maxPrice: 7650, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Potato ----
  { id: 'm20', cropKey: 'potato', variety: 'Local', market: 'Agra', district: 'Agra', state: 'Uttar Pradesh', minPrice: 1150, modalPrice: 1300, maxPrice: 1500, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm21', cropKey: 'potato', variety: 'Local', market: 'Hooghly', district: 'Hooghly', state: 'West Bengal', minPrice: 1400, modalPrice: 1600, maxPrice: 1850, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm22', cropKey: 'potato', variety: 'Badshah', market: 'Jalandhar', district: 'Jalandhar', state: 'Punjab', minPrice: 1250, modalPrice: 1400, maxPrice: 1600, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Onion ----
  { id: 'm23', cropKey: 'onion', variety: 'Local', market: 'Lasalgaon (Niphad)', district: 'Nashik', state: 'Maharashtra', minPrice: 1300, modalPrice: 1600, maxPrice: 2100, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm24', cropKey: 'onion', variety: 'Local', market: 'Azadpur', district: 'North Delhi', state: 'Delhi', minPrice: 1500, modalPrice: 1900, maxPrice: 2500, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm25', cropKey: 'onion', variety: 'Local', market: 'Patna City', district: 'Patna', state: 'Bihar', minPrice: 1600, modalPrice: 1950, maxPrice: 2300, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Tomato ----
  { id: 'm26', cropKey: 'tomato', variety: 'Local', market: 'Kolar', district: 'Kolar', state: 'Karnataka', minPrice: 900, modalPrice: 1250, maxPrice: 1700, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm27', cropKey: 'tomato', variety: 'Hybrid', market: 'Nashik', district: 'Nashik', state: 'Maharashtra', minPrice: 850, modalPrice: 1200, maxPrice: 1600, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm28', cropKey: 'tomato', variety: 'Local', market: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', minPrice: 1000, modalPrice: 1400, maxPrice: 1800, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Chickpea ----
  { id: 'm29', cropKey: 'chickpea', variety: 'Desi', market: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', minPrice: 5250, modalPrice: 5450, maxPrice: 5700, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm30', cropKey: 'chickpea', variety: 'Desi', market: 'Kalpi', district: 'Jalaun', state: 'Uttar Pradesh', minPrice: 5200, modalPrice: 5400, maxPrice: 5650, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Bajra ----
  { id: 'm31', cropKey: 'bajra', variety: 'Hybrid', market: 'Jaipur (Grain)', district: 'Jaipur', state: 'Rajasthan', minPrice: 2400, modalPrice: 2550, maxPrice: 2700, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm32', cropKey: 'bajra', variety: 'Hybrid', market: 'Hisar', district: 'Hisar', state: 'Haryana', minPrice: 2380, modalPrice: 2520, maxPrice: 2680, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Groundnut ----
  { id: 'm33', cropKey: 'groundnut', variety: 'Bold', market: 'Rajkot', district: 'Rajkot', state: 'Gujarat', minPrice: 6400, modalPrice: 6650, maxPrice: 6950, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm34', cropKey: 'groundnut', variety: 'Local', market: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', minPrice: 6200, modalPrice: 6500, maxPrice: 6800, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Arhar / Tur ----
  { id: 'm35', cropKey: 'arhar', variety: 'Red', market: 'Latur', district: 'Latur', state: 'Maharashtra', minPrice: 10200, modalPrice: 10800, maxPrice: 11400, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm36', cropKey: 'arhar', variety: 'Red', market: 'Kalaburagi', district: 'Kalaburagi', state: 'Karnataka', minPrice: 10100, modalPrice: 10700, maxPrice: 11300, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Moong ----
  { id: 'm37', cropKey: 'moong', variety: 'Green (Saba)', market: 'Etawah', district: 'Etawah', state: 'Uttar Pradesh', minPrice: 7600, modalPrice: 8000, maxPrice: 8400, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm38', cropKey: 'moong', variety: 'Green', market: 'Bhind', district: 'Bhind', state: 'Madhya Pradesh', minPrice: 7500, modalPrice: 7900, maxPrice: 8300, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Barley ----
  { id: 'm39', cropKey: 'barley', variety: 'Local', market: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', minPrice: 2100, modalPrice: 2250, maxPrice: 2400, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Sugarcane ----
  { id: 'm40', cropKey: 'sugarcane', variety: 'Co 0238', market: 'Muzaffarnagar', district: 'Muzaffarnagar', state: 'Uttar Pradesh', minPrice: 340, modalPrice: 355, maxPrice: 370, unit: q, date: MANDI_DATA_AS_OF },
  { id: 'm41', cropKey: 'sugarcane', variety: 'Co 86032', market: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', minPrice: 320, modalPrice: 340, maxPrice: 360, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Urad ----
  { id: 'm42', cropKey: 'urad', variety: 'Black', market: 'Guna', district: 'Guna', state: 'Madhya Pradesh', minPrice: 6900, modalPrice: 7200, maxPrice: 7500, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Guar ----
  { id: 'm43', cropKey: 'guar', variety: 'Local', market: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', minPrice: 4800, modalPrice: 5100, maxPrice: 5400, unit: q, date: MANDI_DATA_AS_OF },
  // ---- Jowar ----
  { id: 'm44', cropKey: 'jowar', variety: 'Hybrid', market: 'Solapur', district: 'Solapur', state: 'Maharashtra', minPrice: 2900, modalPrice: 3100, maxPrice: 3350, unit: q, date: MANDI_DATA_AS_OF },
];
