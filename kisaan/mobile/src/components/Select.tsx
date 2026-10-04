import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, ChevronDown, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';
import { useApp } from '@/store/AppStore';

export interface SelectOption {
  value: string;
  label: string;
  sub?: string;
}

interface Props {
  label?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  optionalLabel?: string;
}

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
  searchable,
  error,
  optionalLabel,
}: Props) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.sub || '').toLowerCase().includes(q),
    );
  }, [options, query]);

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
        onPress={() => {
          setQuery('');
          setOpen(true);
        }}
        style={[styles.box, !!error && styles.boxError]}
      >
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder || t('common.select')}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={[styles.backdrop, { paddingBottom: insets.bottom }]}>
          <Pressable style={styles.backdropTouch} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label || t('common.select')}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Text style={styles.cancel}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
            {searchable ? (
              <View style={styles.searchBox}>
                <Search size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t('common.search')}
                  placeholderTextColor={colors.textMuted}
                  autoCorrect={false}
                />
              </View>
            ) : null}
            <FlatList
              data={filtered}
              keyExtractor={(o) => o.value}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 380 }}
              ListEmptyComponent={
                <Text style={styles.empty}>{t('common.none')}</Text>
              }
              renderItem={({ item }) => {
                const isSel = item.value === value;
                return (
                  <Pressable
                    style={[styles.option, isSel && styles.optionSelected]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionLabel, isSel && styles.optionLabelSel]}>
                        {item.label}
                      </Text>
                      {item.sub ? <Text style={styles.optionSub}>{item.sub}</Text> : null}
                    </View>
                    {isSel ? <Check size={18} color={colors.primary} /> : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    gap: spacing.sm,
  },
  boxError: { borderColor: colors.danger },
  value: { flex: 1, fontSize: font.md, color: colors.text },
  placeholder: { color: colors.textMuted },
  error: { fontSize: font.xs, color: colors.danger, marginTop: 6 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,26,18,0.45)' },
  backdropTouch: { flex: 1 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text },
  cancel: { fontSize: font.md, color: colors.primary, fontWeight: weight.semibold },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: font.md, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  optionSelected: { backgroundColor: colors.primarySoft, borderRadius: radius.sm },
  optionLabel: { fontSize: font.md, color: colors.text },
  optionLabelSel: { fontWeight: weight.semibold, color: colors.primaryDark },
  optionSub: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: spacing.sm },
  empty: { padding: spacing.xl, textAlign: 'center', color: colors.textMuted },
});
