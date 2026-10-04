// Shared UI primitives: Screen, Card, SectionHeader, EmptyState, Badge,
// ProgressBar, Segmented, ScreenHeader, WeatherGlyph.

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from 'lucide-react-native';
import { colors, font, radius, shadow, spacing, weight } from '@/theme/tokens';
import type { WeatherCondition } from '@/services/weather';

// --- Screen -----------------------------------------------------------------

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  keyboardAvoid = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardAvoid?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
  );
  return (
    <KeyboardAvoidingView
      style={[styles.screen, style]}
      behavior={keyboardAvoid && Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

// --- ScreenHeader (for tab screens) -------------------------------------------

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.headerSub} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View style={{ marginLeft: spacing.sm }}>{right}</View> : null}
    </View>
  );
}

// --- Card ------------------------------------------------------------------

export function Card({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const inner = <View style={[styles.card, style]}>{children}</View>;
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

// --- SectionHeader -------------------------------------------------------------

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// --- EmptyState -------------------------------------------------------------

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Icon size={30} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
      {children ? <View style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}>{children}</View> : null}
    </View>
  );
}

// --- Badge --------------------------------------------------------------------

export type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'gray';

const badgeTones: Record<BadgeTone, { bg: string; fg: string }> = {
  green: { bg: colors.successSoft, fg: '#15803D' },
  amber: { bg: colors.accentSoft, fg: '#B45309' },
  red: { bg: colors.dangerSoft, fg: '#B91C1C' },
  blue: { bg: colors.infoSoft, fg: '#075985' },
  gray: { bg: '#EEF0EC', fg: colors.textMuted },
};

export function Badge({ label, tone = 'green' }: { label: string; tone?: BadgeTone }) {
  const c = badgeTones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

// --- ProgressBar ----------------------------------------------------------------

export function ProgressBar({ percent, color = colors.primary }: { percent: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }]}
      />
    </View>
  );
}

// --- Segmented --------------------------------------------------------------------

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segmented, style]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- WeatherGlyph ------------------------------------------------------------------

const weatherIcons: Record<WeatherCondition, { Icon: LucideIcon; color: string }> = {
  clear: { Icon: Sun, color: '#F59E0B' },
  mainlyClear: { Icon: Sun, color: '#F59E0B' },
  partCloud: { Icon: CloudSun, color: '#F59E0B' },
  overcast: { Icon: Cloud, color: '#6B7280' },
  fog: { Icon: CloudFog, color: '#6B7280' },
  drizzle: { Icon: CloudDrizzle, color: '#0EA5E9' },
  rain: { Icon: CloudRain, color: '#0284C7' },
  heavyRain: { Icon: CloudRainWind, color: '#1D4ED8' },
  snow: { Icon: CloudSnow, color: '#38BDF8' },
  showers: { Icon: CloudRain, color: '#0284C7' },
  thunder: { Icon: CloudLightning, color: '#7C3AED' },
};

export function WeatherGlyph({
  condition,
  size = 28,
}: {
  condition: WeatherCondition;
  size?: number;
}) {
  const { Icon, color } = weatherIcons[condition] ?? weatherIcons.partCloud;
  return <Icon size={size} color={color} />;
}

// --- styles ---------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: spacing.lg, gap: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  headerTitle: { fontSize: font.xxl, fontWeight: weight.bold, color: colors.text },
  headerSub: { fontSize: font.sm, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text },
  sectionAction: { fontSize: font.sm, fontWeight: weight.semibold, color: colors.primary },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text, textAlign: 'center' },
  emptySub: {
    fontSize: font.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  badge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: font.xs, fontWeight: weight.semibold },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E7EAE4',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E9ECE6',
    borderRadius: radius.md,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: colors.surface, ...shadow.card },
  segmentText: { fontSize: font.sm, color: colors.textMuted, fontWeight: weight.medium },
  segmentTextActive: { color: colors.primary, fontWeight: weight.bold },
});
