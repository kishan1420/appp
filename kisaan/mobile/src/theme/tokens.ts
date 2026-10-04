// Kisaan design tokens — colors, typography, spacing (Phase 2: Design System)
export const colors = {
  // Brand
  primary: '#166534', // deep field green
  primaryDark: '#14532D',
  primaryLight: '#22C55E',
  primarySoft: '#DCFCE7',
  accent: '#D97706', // harvest amber
  accentSoft: '#FEF3C7',

  // Surfaces
  bg: '#F4F6F1',
  surface: '#FFFFFF',
  border: '#E3E7DE',
  inputBg: '#FFFFFF',

  // Text
  text: '#1C2420',
  textMuted: '#66716A',
  textInverse: '#FFFFFF',

  // Semantic
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  info: '#0369A1',
  infoSoft: '#E0F2FE',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
} as const;

export const weight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadow = {
  card: {
    shadowColor: '#0F1A12',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;
