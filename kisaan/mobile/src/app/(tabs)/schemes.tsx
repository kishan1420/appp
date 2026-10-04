import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Landmark, Search } from 'lucide-react-native';
import Input from '@/components/Input';
import { Badge, Card, EmptyState, Screen, ScreenHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { SCHEMES, SCHEME_CATEGORIES, type SchemeCategory } from '@/data/schemes';
import { formatDate } from '@/utils/helpers';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';

export default function SchemesScreen() {
  const { t, lang } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<SchemeCategory | ''>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHEMES.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.name.en.toLowerCase().includes(q) ||
        s.name.hi.includes(query.trim()) ||
        s.summary.en.toLowerCase().includes(q) ||
        s.summary.hi.includes(query.trim()) ||
        t(`schemes.cat.${s.category}`).toLowerCase().includes(q)
      );
    });
  }, [query, cat, t]);

  return (
    <Screen>
      <ScreenHeader title={t('schemes.title')} />

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder={t('schemes.searchPh')}
        icon={Search}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={{ marginBottom: spacing.sm, marginTop: -spacing.sm }}
      >
        <CatChip label={t('schemes.allCats')} active={cat === ''} onPress={() => setCat('')} />
        {SCHEME_CATEGORIES.map((c) => (
          <CatChip
            key={c}
            label={t(`schemes.cat.${c}`)}
            active={cat === c}
            onPress={() => setCat(cat === c ? '' : c)}
          />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Landmark} title={t('schemes.noResults')} subtitle={t('schemes.noResultsSub')} />
        </Card>
      ) : (
        filtered.map((s) => (
          <Card key={s.id} onPress={() => router.push(`/scheme/${s.id}`)}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={2}>
                  {lang === 'hi' ? s.name.hi : s.name.en}
                </Text>
                <View style={styles.badgeRow}>
                  <Badge tone="green" label={t(`schemes.cat.${s.category}`)} />
                </View>
                <Text style={styles.summary} numberOfLines={2}>
                  {lang === 'hi' ? s.summary.hi : s.summary.en}
                </Text>
                <Text style={styles.ministry} numberOfLines={1}>
                  {lang === 'hi' ? s.ministry.hi : s.ministry.en} · {t('schemes.verifiedOn', { date: formatDate(s.verifiedOn) })}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

function CatChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.xs, color: colors.textMuted, fontWeight: weight.medium },
  chipTextActive: { color: colors.white, fontWeight: weight.semibold },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  name: { fontSize: font.md, fontWeight: weight.bold, color: colors.text, lineHeight: 21 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  summary: { fontSize: font.sm, color: colors.textMuted, marginTop: 6, lineHeight: 19 },
  ministry: { fontSize: font.xs - 1, color: colors.textMuted, marginTop: 6, opacity: 0.8 },
});
