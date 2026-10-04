import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Sprout, Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import DateField from '@/components/DateField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { EmptyState, Screen, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { CROP_CATALOG, cropByKey } from '@/data/crops';
import { addDays, todayISO } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { AreaUnit, CropSeason, CropStatus } from '@/types/models';

export default function CropEditScreen() {
  const params = useLocalSearchParams<{ id?: string; farmId?: string }>();
  const { t, lang, farms, crops, saveCrop, deleteCrop } = useApp();
  const router = useRouter();

  const existing = params.id ? crops.find((c) => c.id === params.id) : undefined;
  const isEdit = !!existing;

  const [farmId, setFarmId] = useState('');
  const [cropKey, setCropKey] = useState('');
  const [customName, setCustomName] = useState('');
  const [variety, setVariety] = useState('');
  const [season, setSeason] = useState<CropSeason>('kharif');
  const [sowingDate, setSowingDate] = useState(todayISO());
  const [harvestDate, setHarvestDate] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acre');
  const [status, setStatus] = useState<CropStatus>('planned');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ farmId?: string; cropKey?: string; customName?: string; sowingDate?: string }>({});

  useEffect(() => {
    if (existing) {
      setFarmId(existing.farmId);
      setCropKey(existing.cropKey);
      setCustomName(existing.customName || '');
      setVariety(existing.variety || '');
      setSeason(existing.season);
      setSowingDate(existing.sowingDate);
      setHarvestDate(existing.expectedHarvestDate || '');
      setArea(existing.areaValue ? String(existing.areaValue) : '');
      setAreaUnit(existing.areaUnit || 'acre');
      setStatus(existing.status);
      setNotes(existing.notes || '');
    } else if (params.farmId) {
      setFarmId(params.farmId);
      const farm = farms.find((f) => f.id === params.farmId);
      if (farm) setAreaUnit(farm.areaUnit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, params.farmId]);

  const cropOptions = useMemo(
    () =>
      CROP_CATALOG.map((c) => ({
        value: c.key,
        label: lang === 'hi' ? `${c.hi} (${c.en})` : c.en,
        sub: `${c.durationDays} ${lang === 'hi' ? 'दिन' : 'days'} · ${c.seasons.map((s) => t(`crop.${s}`)).join(', ')}`,
      })),
    [lang, t],
  );

  const farmOptions = useMemo(
    () => farms.map((f) => ({ value: f.id, label: f.name })),
    [farms],
  );

  // Auto-suggest expected harvest when crop + sowing date are known
  function onCropChange(key: string) {
    setCropKey(key);
    if (!harvestDate && sowingDate) {
      const info = cropByKey(key);
      if (info) setHarvestDate(addDays(sowingDate, info.durationDays));
    }
  }

  function onSowingChange(iso: string) {
    setSowingDate(iso);
    if (!harvestDate) {
      const info = cropByKey(cropKey);
      if (info && iso) setHarvestDate(addDays(iso, info.durationDays));
    }
  }

  function onSave() {
    const e: typeof errors = {};
    if (!farmId) e.farmId = t('crop.errFarm');
    if (!cropKey) e.cropKey = t('crop.errCrop');
    if (cropKey === 'other' && !customName.trim()) e.customName = t('crop.errCustomName');
    if (!sowingDate) e.sowingDate = t('crop.errSowing');
    setErrors(e);
    if (Object.keys(e).length) return;

    const areaNum = area ? parseFloat(area.replace(',', '.')) : undefined;

    saveCrop({
      id: existing?.id,
      farmId,
      cropKey,
      customName: cropKey === 'other' ? customName.trim() : undefined,
      variety: variety.trim() || undefined,
      season,
      sowingDate,
      expectedHarvestDate: harvestDate || undefined,
      areaValue: areaNum && !isNaN(areaNum) && areaNum > 0 ? areaNum : undefined,
      areaUnit: areaNum ? areaUnit : undefined,
      status,
      notes: notes.trim() || undefined,
    });
    router.back();
  }

  function onDelete() {
    if (!existing) return;
    Alert.alert(t('crop.deleteTitle'), t('crop.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteCrop(existing.id);
          router.back();
        },
      },
    ]);
  }

  if (farms.length === 0 && !isEdit) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('crop.add') }} />
        <EmptyState icon={Sprout} title={t('farm.emptyTitle')} subtitle={t('farm.emptySub')}>
          <Button title={t('dash.createFarm')} onPress={() => router.replace('/farm/edit')} />
        </EmptyState>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: isEdit ? t('crop.edit') : t('crop.add') }} />

      <Select
        label={t('crop.farm')}
        value={farmId}
        onChange={setFarmId}
        options={farmOptions}
        error={errors.farmId}
      />

      <Select
        label={t('crop.selectCrop')}
        value={cropKey}
        onChange={onCropChange}
        options={cropOptions}
        searchable
        error={errors.cropKey}
      />

      {cropKey === 'other' ? (
        <Input
          label={t('crop.customName')}
          value={customName}
          onChangeText={setCustomName}
          error={errors.customName}
        />
      ) : null}

      <Input
        label={t('crop.variety')}
        value={variety}
        onChangeText={setVariety}
        placeholder={t('crop.varietyPh')}
        optionalLabel={t('common.optional')}
      />

      <Text style={styles.groupLabel}>{t('crop.season')}</Text>
      <Segmented
        options={[
          { value: 'kharif', label: t('crop.kharif') },
          { value: 'rabi', label: t('crop.rabi') },
          { value: 'zaid', label: t('crop.zaid') },
        ]}
        value={season}
        onChange={(v) => setSeason(v as CropSeason)}
        style={{ marginBottom: spacing.lg }}
      />

      <DateField
        label={t('crop.sowingDate')}
        value={sowingDate}
        onChange={onSowingChange}
        error={errors.sowingDate}
      />

      <DateField
        label={t('crop.expectedHarvest')}
        value={harvestDate}
        onChange={setHarvestDate}
        optionalLabel={t('common.optional')}
        allowEmpty
      />

      <Text style={styles.groupLabel}>
        {t('crop.areaOpt')} ({t('common.optional')})
      </Text>
      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Input value={area} onChangeText={setArea} keyboardType="decimal-pad" placeholder="1.5" />
        </View>
        <View style={{ width: spacing.md }} />
        <View style={{ flex: 1.6 }}>
          <Segmented
            options={[
              { value: 'acre', label: t('farm.acre') },
              { value: 'hectare', label: t('farm.hectare') },
              { value: 'bigha', label: t('farm.bigha') },
            ]}
            value={areaUnit}
            onChange={(v) => setAreaUnit(v as AreaUnit)}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>

      <Text style={styles.groupLabel}>{t('crop.status')}</Text>
      <Segmented
        options={[
          { value: 'planned', label: t('crop.planned') },
          { value: 'sown', label: t('crop.sown') },
          { value: 'harvested', label: t('crop.harvested') },
        ]}
        value={status}
        onChange={(v) => setStatus(v as CropStatus)}
        style={{ marginBottom: spacing.lg }}
      />

      <Input
        label={t('common.notes')}
        value={notes}
        onChangeText={setNotes}
        optionalLabel={t('common.optional')}
        multiline
      />

      <Button title={t('common.save')} size="lg" fullWidth onPress={onSave} />

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
  row2: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  groupLabel: {
    fontSize: font.sm,
    fontWeight: weight.semibold,
    color: colors.text,
    marginBottom: 8,
  },
});
