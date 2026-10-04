import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Info, MapPin, Search } from 'lucide-react-native';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Badge, Card, EmptyState, Screen, ScreenHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { MANDI_PRICES } from '@/data/mandi';
import { cropByKey } from '@/data/crops';
import { formatDate, formatINR } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';

export default function MarketScreen() {
  const { t, lang } = useApp();
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');

  const states = useMemo(() => {
    const set = Array.from(new Set(MANDI_PRICES.map((p) => p.state))).sort();
    return set;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MANDI_PRICES.filter((p) => {
      if (state && p.state !== state) return false;
      if (!q) return true;
      const info = cropByKey(p.cropKey);
      const en = (info?.en || p.cropKey).toLowerCase();
      const hi = info?.hi || '';
      return (
        en.includes(q) ||
        hi.includes(q) ||
        (p.variety || '').toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.cropKey.localeCompare(b.cropKey) || a.market.localeCompare(b.market));
  }, [query, state]);

  return (
    <Screen>
      <ScreenHeader title={t('mandi.title')} />

      {/* Data freshness note */}
      <View style={styles.noteRow}>
        <Info size={15} color={colors.info} />
        <Text style={styles.noteText}>
          {t('mandi.asOf', { date: formatDate(MANDI_PRICES[0]?.date) })} · {t('mandi.sourceNote')}
        </Text>
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder={t('mandi.searchPh')}
        icon={Search}
      />

      <Select
        label={t('auth.state')}
        value={state}
        onChange={setState}
        options={[
          { value: '', label: t('mandi.allStates') },
          ...states.map((s) => ({ value: s, label: s })),
        ]}
      />

      <Text style={styles.count}>{t('mandi.results', { n: filtered.length })}</Text>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Search} title={t('mandi.noResults')} subtitle={t('mandi.noResultsSub')} />
        </Card>
      ) : (
        filtered.map((p) => {
          const info = cropByKey(p.cropKey);
          const name = lang === 'hi' ? info?.hi || p.cropKey : info?.en || p.cropKey;
          return (
            <Card key={p.id}>
              <View style={styles.headRow}>
                <Text style={styles.cropName} numberOfLines={1}>{name}</Text>
                {p.variety ? <Badge tone="gray" label={p.variety} /> : null}
              </View>
              <View style={styles.marketRow}>
                <MapPin size={13} color={colors.textMuted} />
                <Text style={styles.marketText} numberOfLines={1}>
                  {p.market} · {p.district}, {p.state}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <PriceCol label={t('mandi.min')} value={p.minPrice} />
                <PriceCol label={t('mandi.modal')} value={p.modalPrice} highlight />
                <PriceCol label={t('mandi.max')} value={p.maxPrice} />
              </View>
              <Text style={styles.unitText}>{t('mandi.perQuintal')}</Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

function PriceCol({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <View style={[styles.priceCol, highlight && styles.priceColHighlight]}>
      <Text style={[styles.priceLabel, highlight && { color: colors.primary }]}>{label}</Text>
      <Text style={[styles.priceValue, highlight && { color: colors.primaryDark, fontSize: font.lg }]}>
        {formatINR(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noteRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.infoSoft,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  noteText: { flex: 1, fontSize: font.xs, color: '#075985', lineHeight: 17 },
  count: { fontSize: font.xs, color: colors.textMuted, marginBottom: spacing.xs },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  cropName: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text, flexShrink: 1 },
  marketRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  marketText: { fontSize: font.xs, color: colors.textMuted, flexShrink: 1 },
  priceRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  priceCol: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  priceColHighlight: { backgroundColor: colors.primarySoft },
  priceLabel: { fontSize: font.xs - 1, color: colors.textMuted, fontWeight: weight.medium },
  priceValue: { fontSize: font.md, fontWeight: weight.bold, color: colors.text },
  unitText: { fontSize: font.xs - 1, color: colors.textMuted, marginTop: 6, textAlign: 'right' },
});
