import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Droplets, MapPin, Plus, Sprout, Tractor } from 'lucide-react-native';
import { Badge, Card, EmptyState, Screen, ScreenHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { SOIL_TYPES } from '@/data/crops';
import { formatNumber } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';

export default function FarmsScreen() {
  const { t, lang, farms, crops } = useApp();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader
        title={t('farm.title')}
        right={
          <Pressable
            style={styles.addBtn}
            onPress={() => router.push('/farm/edit')}
            accessibilityRole="button"
            accessibilityLabel={t('farm.add')}
          >
            <Plus size={22} color={colors.white} />
          </Pressable>
        }
      />

      {farms.length === 0 ? (
        <Card>
          <EmptyState icon={Tractor} title={t('farm.emptyTitle')} subtitle={t('farm.emptySub')}>
            <Pressable style={styles.cta} onPress={() => router.push('/farm/edit')}>
              <Plus size={18} color={colors.white} />
              <Text style={styles.ctaText}>{t('farm.add')}</Text>
            </Pressable>
          </EmptyState>
        </Card>
      ) : (
        farms.map((f) => {
          const farmCrops = crops.filter((c) => c.farmId === f.id);
          const active = farmCrops.filter((c) => c.status !== 'harvested').length;
          const soil = SOIL_TYPES.find((s) => s.key === f.soilType);
          const loc = [f.village, f.district, f.state].filter(Boolean).join(', ');
          return (
            <Card key={f.id} onPress={() => router.push(`/farm/${f.id}`)}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>{f.name}</Text>
                  {loc ? (
                    <View style={styles.metaRow}>
                      <MapPin size={13} color={colors.textMuted} />
                      <Text style={styles.meta} numberOfLines={1}>{loc}</Text>
                    </View>
                  ) : null}
                </View>
                <Badge
                  tone={f.irrigation === 'rainfed' ? 'amber' : 'blue'}
                  label={t(`farm.${f.irrigation}`)}
                />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {formatNumber(f.areaValue)} {t(`farm.${f.areaUnit}`)}
                  </Text>
                  <Text style={styles.statLabel}>{t('farm.area')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Sprout size={15} color={colors.primary} />
                    <Text style={styles.statValue}>{active}</Text>
                  </View>
                  <Text style={styles.statLabel}>{t('dash.activeCrops')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Droplets size={15} color={colors.info} />
                    <Text style={[styles.statValue, { fontSize: font.sm }]} numberOfLines={1}>
                      {soil ? (lang === 'hi' ? soil.hi : soil.en).split(' ')[0] : '—'}
                    </Text>
                  </View>
                  <Text style={styles.statLabel}>{t('farm.soil')}</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  ctaText: { color: colors.white, fontWeight: weight.semibold, fontSize: font.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  name: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  meta: { fontSize: font.xs, color: colors.textMuted, flexShrink: 1 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  stat: { flex: 1, gap: 2 },
  statValue: { fontSize: font.md, fontWeight: weight.bold, color: colors.text },
  statLabel: { fontSize: font.xs - 1, color: colors.textMuted },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },
});
