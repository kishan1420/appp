import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { AlertCircle, Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';

interface Props {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon?: LucideIcon;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  optionalLabel?: string;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  onBlur?: () => void;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon: Icon,
  keyboardType,
  secureTextEntry,
  multiline,
  maxLength,
  optionalLabel,
  autoFocus,
  autoCapitalize,
  editable = true,
  onBlur,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {optionalLabel ? <Text style={styles.optional}> ({optionalLabel})</Text> : null}
        </View>
      ) : null}
      <View
        style={[
          styles.box,
          focused && styles.boxFocused,
          !!error && styles.boxError,
          !editable && styles.boxDisabled,
        ]}
      >
        {Icon ? <Icon size={18} color={colors.textMuted} style={styles.icon} /> : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !reveal}
          multiline={multiline}
          numberOfLines={multiline ? 3 : undefined}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxLength={maxLength}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          accessibilityLabel={label}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setReveal((r) => !r)}
            hitSlop={8}
            accessibilityRole="button"
          >
            {reveal ? (
              <EyeOff size={18} color={colors.textMuted} />
            ) : (
              <Eye size={18} color={colors.textMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <AlertCircle size={14} color={colors.danger} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: font.sm, fontWeight: weight.semibold, color: colors.text },
  optional: { fontSize: font.xs, color: colors.textMuted },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    gap: spacing.sm,
  },
  boxFocused: { borderColor: colors.primary },
  boxError: { borderColor: colors.danger, backgroundColor: '#FFF7F7' },
  boxDisabled: { backgroundColor: '#F1F3EF' },
  icon: { marginRight: 0 },
  input: {
    flex: 1,
    fontSize: font.md,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputMultiline: { minHeight: 76, paddingTop: spacing.md },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  error: { fontSize: font.xs, color: colors.danger, flexShrink: 1 },
});
