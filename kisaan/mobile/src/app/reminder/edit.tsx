import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import DateField from '@/components/DateField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Card, Screen } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { cropName } from '@/data/crops';
import { todayISO } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { ReminderCategory } from '@/types/models';

const CATS: ReminderCategory[] = ['irrigation', 'fertilizer', 'pesticide', 'sowing', 'harvest', 'payment', 'other'];

export default function ReminderEditScreen() {
  const params = useLocalSearchParams<{ id?: string; cropId?: string }>();
  const { t, lang, reminders, crops, farms, saveReminder, deleteReminder } = useApp();
  const router = useRouter();

  const existing = params.id ? reminders.find((r) => r.id === params.id) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title || '');
  const [date, setDate] = useState(existing?.date || todayISO());
  const [timeEnabled, setTimeEnabled] = useState(!!existing?.time);
  const [time, setTime] = useState(existing?.time || '09:00');
  const [category, setCategory] = useState<string>(existing?.category || '');
  const [cropId, setCropId] = useState(existing?.cropId || params.cropId || '');
  const [notify, setNotify] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});
  const [busy, setBusy] = useState(false);

  const cropOptions = useMemo(
    () => [
      { value: '', label: t('common.none') },
      ...crops.map((c) => {
        const farm = farms.find((f) => f.id === c.farmId);
        return { value: c.id, label: cropName(c.cropKey, lang, c.customName), sub: farm?.name };
      }),
    ],
    [crops, farms, lang, t],
  );

  const catOptions = useMemo(
    () => [
      { value: '', label: t('common.none') },
      ...CATS.map((c) => ({
        value: c,
        label:
          c === 'payment'
            ? lang === 'hi'
              ? 'भुगतान'
              : 'Payment'
            : t(`act.${c}`),
      })),
    ],
    [lang, t],
  );

  async function onSave() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = t('rem.errTitle');
    if (!date) e.date = t('rem.errDate');
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    await saveReminder({
      id: existing?.id,
      title: title.trim(),
      date,
      time: timeEnabled ? time : undefined,
      category: (category || undefined) as ReminderCategory | undefined,
      cropId: cropId || undefined,
      notify,
    });
    setBusy(false);
    router.back();
  }

  function onDelete() {
    if (!existing) return;
    Alert.alert(t('rem.deleteMsg'), t('common.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteReminder(existing.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: isEdit ? t('rem.edit') : t('rem.add') }} />

      <Input
        label={t('rem.titleField')}
        value={title}
        onChangeText={setTitle}
        placeholder={t('rem.titlePh')}
        error={errors.title}
      />

      <DateField label={t('rem.when')} value={date} onChange={setDate} error={errors.date} />

      <Card style={styles.switchCard}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>{t('common.time')}</Text>
          </View>
          <Switch
            value={timeEnabled}
            onValueChange={setTimeEnabled}
            trackColor={{ true: colors.primaryLight, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
        {timeEnabled ? (
          <View style={{ marginTop: spacing.md }}>
            <DateField label="" value={time} onChange={setTime} mode="time" />
          </View>
        ) : null}
      </Card>

      <Select
        label={t('common.category')}
        value={category}
        onChange={setCategory}
        options={catOptions}
        optionalLabel={t('common.optional')}
      />

      <Select
        label={t('fin.crop')}
        value={cropId}
        onChange={setCropId}
        options={cropOptions}
        optionalLabel={t('common.optional')}
      />

      <Card style={styles.switchCard}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>{t('rem.notify')}</Text>
            <Text style={styles.switchNote}>{t('rem.notifyNote')}</Text>
          </View>
          <Switch
            value={notify}
            onValueChange={setNotify}
            trackColor={{ true: colors.primaryLight, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Button title={t('common.save')} size="lg" fullWidth loading={busy} onPress={onSave} />

      {isEdit ? (
        <Button
          title={t('common.delete')}
          variant="danger"
          icon={Trash2}
          fullWidth
          onPress={onDelete}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchCard: { marginBottom: spacing.lg, padding: spacing.lg },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchLabel: { fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  switchNote: { fontSize: font.xs, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
});
