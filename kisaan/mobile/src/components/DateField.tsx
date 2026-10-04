import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays, Clock, X } from 'lucide-react-native';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';
import { parseISODate, toISODate } from '@/utils/helpers';

interface Props {
  label?: string;
  /** date mode: 'YYYY-MM-DD' | '' ; time mode: 'HH:mm' | '' */
  value: string;
  onChange: (v: string) => void;
  mode?: 'date' | 'time';
  optionalLabel?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  allowEmpty?: boolean;
}

function fmtDate(iso: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  return `${`${d.getDate()}`.padStart(2, '0')}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${d.getFullYear()}`;
}

export default function DateField({
  label,
  value,
  onChange,
  mode = 'date',
  optionalLabel,
  error,
  minimumDate,
  maximumDate,
  allowEmpty,
}: Props) {
  const [iosOpen, setIosOpen] = useState(false);
  const [androidOpen, setAndroidOpen] = useState(false);

  const current =
    mode === 'date'
      ? value
        ? parseISODate(value)
        : new Date()
      : (() => {
          const [h, m] = (value || '09:00').split(':').map(Number);
          const d = new Date();
          d.setHours(h || 9, m || 0, 0, 0);
          return d;
        })();

  const display = mode === 'date' ? fmtDate(value) : value;
  const Icon = mode === 'date' ? CalendarDays : Clock;

  const commit = (d: Date | undefined) => {
    if (!d) return;
    if (mode === 'date') {
      onChange(toISODate(d));
    } else {
      onChange(`${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`);
    }
  };

  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {optionalLabel ? <Text style={styles.optional}> ({optionalLabel})</Text> : null}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        style={[styles.box, !!error && styles.boxError]}
        onPress={() => (Platform.OS === 'ios' ? setIosOpen((o) => !o) : setAndroidOpen(true))}
      >
        <Icon size={18} color={colors.textMuted} />
        <Text style={[styles.value, !display && styles.placeholder]}>
          {display || (allowEmpty ? '—' : fmtDate(toISODate(new Date())))}
        </Text>
        {allowEmpty && value ? (
          <Pressable hitSlop={8} onPress={() => onChange('')}>
            <X size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </Pressable>

      {Platform.OS === 'ios' && iosOpen ? (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={current}
            mode={mode}
            display="spinner"
            onChange={(_, d) => d && commit(d)}
            minuteInterval={5}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          <Pressable style={styles.doneBtn} onPress={() => setIosOpen(false)}>
            <Text style={styles.doneText}>OK</Text>
          </Pressable>
        </View>
      ) : null}

      {Platform.OS === 'android' && androidOpen ? (
        <DateTimePicker
          value={current}
          mode={mode}
          display="default"
          onChange={(e, d) => {
            setAndroidOpen(false);
            if (e.type === 'set' && d) commit(d);
          }}
          minuteInterval={5}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  boxError: { borderColor: colors.danger },
  value: { flex: 1, fontSize: font.md, color: colors.text },
  placeholder: { color: colors.textMuted },
  iosPicker: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  doneBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl },
  doneText: { color: colors.primary, fontWeight: weight.semibold, fontSize: font.md },
  error: { fontSize: font.xs, color: colors.danger, marginTop: 6 },
});
