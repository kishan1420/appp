import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'md' | 'lg';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  disabled,
  fullWidth,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        size === 'lg' && styles.lg,
        fullWidth && styles.fullWidth,
        (isDisabled || pressed) && styles.dim,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary} />
      ) : (
        <View style={styles.content}>
          {Icon ? (
            <Icon
              size={size === 'lg' ? 20 : 18}
              color={variant === 'primary' || variant === 'danger' ? colors.white : variant === 'ghost' ? colors.primary : colors.primary}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              size === 'lg' && styles.labelLg,
              variant === 'primary' || variant === 'danger'
                ? styles.labelLight
                : styles.labelDark,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 46,
  },
  lg: { minHeight: 52, borderRadius: radius.lg },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: colors.primarySoft },
  dim: { opacity: 0.55 },
  label: { fontSize: font.md, fontWeight: weight.semibold },
  labelLg: { fontSize: font.lg },
  labelLight: { color: colors.white },
  labelDark: { color: colors.primary },
});
