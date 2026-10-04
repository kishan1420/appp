import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Bug,
  CalendarCheck,
  Droplets,
  FlaskConical,
  MoreHorizontal,
  Pencil,
  Plus,
  Scissors,
  Sprout,
  Trash2,
  Wallet,
  Wheat,
  X,
} from 'lucide-react-native';
import Button from '@/components/Button';
import DateField from '@/components/DateField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Badge, Card, EmptyState, ProgressBar, Screen, SectionHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { cropByKey, cropName } from '@/data/crops';
import { getCropProgress, STAGE_ORDER, type StageKey } from '@/utils/cropProgress';
import { formatDate, formatINR, todayISO } from '@/utils/helpers';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';
import type { ActivityType } from '@/types/models';

const ACTIVITY_ICONS: Record<ActivityType, typeof Sprout> = {
  sowing: Sprout,
  irrigation: Droplets,
  fertilizer: FlaskConical,
  pesticide: Bug,
  weeding: Scissors,
  harvest: Wheat,
  other: MoreHorizontal,
};

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang, farms, crops, activities, saveCrop, deleteCrop, saveActivity, deleteActivity } =
    useApp();
  const router = useRouter();
  const today = todayISO();

  const crop = crops.find((c) => c.id === id);
  const [actOpen, setActOpen] = useState(false);

  if (!crop) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('crop.title') }} />
        <EmptyState icon={Sprout} title={t('crop.emptyTitle')} />
      </Screen>
    );
  }

  const farm = farms.find((f) => f.id === crop.farmId);
  const info = cropByKey(crop.cropKey);
  const p = getCropProgress(crop, today);
  const cropActivities = activities
    .filter((a) => a.cropId === crop.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const name = cropName(crop.cropKey, lang, crop.customName);

  function onDelete() {
    Alert.alert(t('crop.deleteTitle'), t('crop.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteCrop(crop!.id);
          router.back();
        },
      },
    ]);
  }

  function onMarkHarvested() {
    saveCrop({
      id: crop!.id,
      status: 'harvested',
      expectedHarvestDate: crop!.expectedHarvestDate || today,
    });
  }

  const stageIndex = STAGE_ORDER.indexOf(p.stage as StageKey);

  return (
    <Screen>
      <Stack.Screen options={{ title: name }} />

      {/* Hero / progress */}
      <Card>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cropName}>{name}</Text>
            <Text style={styles.heroSub} numberOfLines={1}>
              {farm?.name || '—'}
              {crop.variety ? ` · ${crop.variety}` : ''}
            </Text>
          </View>
          <Badge
            tone={crop.status === 'harvested' ? 'gray' : crop.status === 'planned' ? 'blue' : 'green'}
            label={t(`crop.${crop.status}`)}
          />
        </View>

        <View style={styles.badgeRow}>
          <Badge tone="amber" label={t(`crop.${crop.season}`)} />
          {crop.areaValue ? (
            <Badge tone="blue" label={`${crop.areaValue} ${t(`farm.${crop.areaUnit || 'acre'}`)}`} />
          ) : null}
          {info ? (
            <Badge tone="gray" label={`${info.durationDays} ${lang === 'hi' ? 'दिन' : 'days'}`} />
          ) : null}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <View style={styles.progressHead}>
            <Text style={styles.progressTitle}>{t('crop.progress')}</Text>
            <Text style={styles.progressPct}>
              {crop.status === 'harvested' ? t('dash.harvested') : `${p.percent}%`}
            </Text>
          </View>
          <ProgressBar
            percent={p.percent}
            color={crop.status === 'harvested' ? colors.textMuted : p.stage === 'done' ? colors.accent : colors.primaryLight}
          />
          <View style={styles.stageRow}>
            {STAGE_ORDER.map((s, i) => (
              <View key={s} style={styles.stageItem}>
                <View
                  style={[
                    styles.stageDot,
                    i <= stageIndex && crop.status !== 'planned'
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: '#D5DAD1' },
                  ]}
                />
                <Text
                  style={[
                    styles.stageText,
                    i === stageIndex && crop.status !== 'harvested' && { color: colors.primary, fontWeight: weight.bold },
                  ]}
                  numberOfLines={1}
                >
                  {t(`crop.stage.${s}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{t('crop.sownOn', { date: formatDate(crop.sowingDate) })}</Text>
          <Text style={styles.dateText}>
            {crop.status === 'harvested'
              ? t('dash.harvested')
              : crop.expectedHarvestDate
                ? t('crop.harvestOn', { date: formatDate(crop.expectedHarvestDate) })
                : info
                  ? t('crop.harvestOn', { date: '≈' + formatDate(addDaysSafe(crop.sowingDate, info.durationDays)) })
                  : ''}
          </Text>
        </View>

        {crop.status !== 'harvested' ? (
          <Text style={[styles.daysLeft, p.daysLeft < 0 && { color: colors.danger }]}>
            {p.stage === 'done' || p.daysLeft < 0 ? t('crop.overdue') : t('crop.daysLeft', { n: p.daysLeft })}
          </Text>
        ) : null}
      </Card>

      {/* Actions */}
      <View style={styles.actionsGrid}>
        <Button title={t('crop.addActivity')} icon={Plus} onPress={() => setActOpen(true)} style={{ flex: 1 }} />
        <Button
          title={t('crop.logExpense')}
          icon={Wallet}
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => router.push(`/finance/edit?cropId=${crop.id}`)}
        />
      </View>
      <View style={styles.actionsGrid}>
        {crop.status !== 'harvested' ? (
          <Button
            title={t('crop.markHarvested')}
            icon={CalendarCheck}
            variant="ghost"
            style={{ flex: 1 }}
            onPress={onMarkHarvested}
          />
        ) : null}
        <Button
          title={t('common.edit')}
          icon={Pencil}
          variant="ghost"
          style={{ flex: 1 }}
          onPress={() => router.push(`/crop/edit?id=${crop.id}`)}
        />
        <Button title={t('common.delete')} icon={Trash2} variant="danger" style={{ flex: 1 }} onPress={onDelete} />
      </View>

      {/* Activities */}
      <View>
        <SectionHeader title={t('crop.activities')} />
        {cropActivities.length === 0 ? (
          <Card>
            <Text style={styles.noActs}>{t('crop.noActivities')}</Text>
          </Card>
        ) : (
          <Card style={{ gap: spacing.md }}>
            {cropActivities.map((a) => {
              const Icon = ACTIVITY_ICONS[a.type] || MoreHorizontal;
              return (
                <View key={a.id} style={styles.actRow}>
                  <View style={styles.actIcon}>
                    <Icon size={17} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actTitle}>{t(`act.${a.type}`)}</Text>
                    <Text style={styles.actMeta}>
                      {formatDate(a.date)}
                      {a.notes ? ` · ${a.notes}` : ''}
                    </Text>
                  </View>
                  {a.cost ? <Text style={styles.actCost}>{formatINR(a.cost)}</Text> : null}
                  <Pressable
                    hitSlop={8}
                    onPress={() =>
                      Alert.alert(t('act.deleteMsg'), undefined, [
                        { text: t('common.cancel'), style: 'cancel' },
                        { text: t('common.delete'), style: 'destructive', onPress: () => deleteActivity(a.id) },
                      ])
                    }
                  >
                    <Trash2 size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
              );
            })}
          </Card>
        )}
      </View>

      <ActivityModal
        visible={actOpen}
        onClose={() => setActOpen(false)}
        onSave={(input) => {
          saveActivity({ cropId: crop.id, ...input });
          setActOpen(false);
        }}
      />
    </Screen>
  );
}

function addDaysSafe(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ActivityModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (input: { type: ActivityType; date: string; cost?: number; notes?: string }) => void;
}) {
  const { t } = useApp();
  const [type, setType] = useState<ActivityType>('irrigation');
  const [date, setDate] = useState(todayISO());
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const typeOptions: { value: ActivityType; label: string }[] = [
    'sowing', 'irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'other',
  ].map((k) => ({ value: k as ActivityType, label: t(`act.${k}`) }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>{t('act.title')}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <Select
            label={t('act.type')}
            value={type}
            onChange={(v) => setType(v as ActivityType)}
            options={typeOptions}
          />
          <DateField label={t('act.date')} value={date} onChange={setDate} />
          <Input
            label={t('act.cost')}
            value={cost}
            onChangeText={setCost}
            keyboardType="number-pad"
            optionalLabel={t('common.optional')}
          />
          <Input
            label={t('common.notes')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('act.notesPh')}
            optionalLabel={t('common.optional')}
          />
          <Button
            title={t('common.save')}
            size="lg"
            fullWidth
            onPress={() => {
              const costNum = cost ? parseFloat(cost) : undefined;
              onSave({
                type,
                date,
                cost: costNum && !isNaN(costNum) && costNum > 0 ? costNum : undefined,
                notes: notes.trim() || undefined,
              });
              setCost('');
              setNotes('');
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  cropName: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text },
  heroSub: { fontSize: font.sm, color: colors.textMuted, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: { fontSize: font.sm, fontWeight: weight.semibold, color: colors.text },
  progressPct: { fontSize: font.sm, fontWeight: weight.bold, color: colors.primary },
  stageRow: { flexDirection: 'row', marginTop: spacing.sm },
  stageItem: { flex: 1, alignItems: 'center', gap: 4 },
  stageDot: { width: 8, height: 8, borderRadius: 4 },
  stageText: { fontSize: 9, color: colors.textMuted, textAlign: 'center' },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  dateText: { fontSize: font.xs, color: colors.textMuted, flexShrink: 1 },
  daysLeft: { fontSize: font.sm, color: colors.primary, fontWeight: weight.semibold, marginTop: spacing.sm },
  actionsGrid: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  noActs: { color: colors.textMuted, fontSize: font.sm, textAlign: 'center', paddingVertical: spacing.sm },
  actRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTitle: { fontSize: font.md, color: colors.text, fontWeight: weight.medium },
  actMeta: { fontSize: font.xs, color: colors.textMuted, marginTop: 1 },
  actCost: { fontSize: font.sm, fontWeight: weight.bold, color: colors.text },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,26,18,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text },
});
