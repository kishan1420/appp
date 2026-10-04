import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight, Droplets, MapPin, Pencil, Plus, Sprout, Trash2 } from 'lucide-react-native';
import { Alert } from 'react-native';
import Button from '@/components/Button';
import { Badge, Card, EmptyState, ProgressBar, Screen, SectionHeader, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { SOIL_TYPES } from '@/data/crops';
import { cropName } from '@/data/crops';
import { getCropProgress } from '@/utils/cropProgress';
import { formatDate, formatNumber, todayISO } from '@/utils/helpers';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, farms, crops, deleteFarm } = useApp();
  const router = useRouter();
  const today = todayISO();

  const farm = farms.find((f) => f.id === id);

  if (!farm) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('farm.title') }} />
        <EmptyState icon={Sprout} title={t('farm.emptyTitle')} />
      </Screen>
    );
  }

  const farmCrops = crops
    .filter((c) => c.farmId === farm.id)
    .sort((a, b) => b.sowingDate.localeCompare(a.sowingDate));
  const soil = SOIL_TYPES.find((s) => s.key === farm.soilType);
  const loc = [farm.village, farm.district, farm.state].filter(Boolean).join(', ');

  function onDelete() {
    Alert.alert(t('farm.deleteTitle'), t('farm.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteFarm(farm!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: farm.name }} />

      {/* Details card */}
      <Card>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{farm.name}</Text>
          <Badge
            tone={farm.irrigation === 'rainfed' ? 'amber' : 'blue'}
            label={t(`farm.${farm.irrigation}`)}
          />
        </View>
        {loc ? (
          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={styles.meta}>{loc}</Text>
          </View>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {formatNumber(farm.areaValue)} {t(`farm.${farm.areaUnit}`)}
            </Text>
            <Text style={styles.statLabel}>{t('farm.area')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{farmCrops.filter((c) => c.status !== 'harvested').length}</Text>
            <Text style={styles.statLabel}>{t('dash.activeCrops')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue} numberOfLines={1}>
              {soil ? (lang === 'hi' ? soil.hi : soil.en) : '—'}
            </Text>
            <Text style={styles.statLabel}>{t('farm.soil')}</Text>
          </View>
        </View>

        {farm.notes ? (
          <Text style={styles.notes}>{farm.notes}</Text>
        ) : null}

        <View style={styles.actionsRow}>
          <Button
            title={t('common.edit')}
            variant="secondary"
            icon={Pencil}
            style={{ flex: 1 }}
            onPress={() => router.push(`/farm/edit?id=${farm.id}`)}
          />
          <Button
            title={t('common.delete')}
            variant="danger"
            icon={Trash2}
            style={{ flex: 1 }}
            onPress={onDelete}
          />
        </View>
      </Card>

      {/* Crops */}
      <View>
        <SectionHeader
          title={t('farm.crops')}
          action={t('common.add')}
          onAction={() => router.push(`/crop/edit?farmId=${farm.id}`)}
        />
        {farmCrops.length === 0 ? (
          <Card>
            <EmptyState icon={Sprout} title={t('farm.noCrops')}>
              <Button
                title={t('farm.addCropHere')}
                icon={Plus}
                onPress={() => router.push(`/crop/edit?farmId=${farm.id}`)}
              />
            </EmptyState>
          </Card>
        ) : (
          <Card style={{ gap: spacing.lg }}>
            {farmCrops.map((crop) => {
              const p = getCropProgress(crop, today);
              const harvested = crop.status === 'harvested';
              return (
                <Pressable
                  key={crop.id}
                  onPress={() => router.push(`/crop/${crop.id}`)}
                  accessibilityRole="button"
                >
                  <View style={styles.cropTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cropName} numberOfLines={1}>
                        {cropName(crop.cropKey, lang, crop.customName)}
                        {crop.variety ? ` · ${crop.variety}` : ''}
                      </Text>
                      <Text style={styles.cropMeta}>
                        {t(`crop.${crop.season}`)} · {t('crop.sowingDate')}: {formatDate(crop.sowingDate)}
                      </Text>
                    </View>
                    <Badge
                      tone={harvested ? 'gray' : p.stage === 'done' ? 'amber' : 'green'}
                      label={harvested ? t('crop.harvested') : t(`crop.stage.${p.stage}`)}
                    />
                  </View>
                  {!harvested ? (
                    <View style={{ marginTop: spacing.sm }}>
                      <ProgressBar
                        percent={p.percent}
                        color={p.stage === 'done' ? colors.accent : colors.primaryLight}
                      />
                      <Text style={styles.cropMeta}>
                        {p.stage === 'done'
                          ? t('dash.harvestReady')
                          : p.daysLeft >= 0
                            ? t('dash.daysLeft', { n: p.daysLeft })
                            : t('crop.overdue')}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
            <Pressable
              style={styles.addCropRow}
              onPress={() => router.push(`/crop/edit?farmId=${farm.id}`)}
            >
              <Plus size={18} color={colors.primary} />
              <Text style={styles.addCropText}>{t('farm.addCropHere')}</Text>
              <ChevronRight size={18} color={colors.primary} />
            </Pressable>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text, flexShrink: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  meta: { fontSize: font.sm, color: colors.textMuted },
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
  notes: { fontSize: font.sm, color: colors.textMuted, marginTop: spacing.md, lineHeight: 20 },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  cropTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cropName: { fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  cropMeta: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  addCropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'center',
  },
  addCropText: { color: colors.primary, fontWeight: weight.semibold, fontSize: font.sm, flex: 1 },
});
