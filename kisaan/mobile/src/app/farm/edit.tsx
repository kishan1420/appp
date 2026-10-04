import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Screen, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { INDIAN_STATES, SOIL_TYPES } from '@/data/crops';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { AreaUnit, IrrigationType } from '@/types/models';

export default function FarmEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t, lang, farms, profile, saveFarm, deleteFarm } = useApp();
  const router = useRouter();

  const existing = id ? farms.find((f) => f.id === id) : undefined;
  const isEdit = !!existing;

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acre');
  const [irrigation, setIrrigation] = useState<IrrigationType>('irrigated');
  const [soilType, setSoilType] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; area?: string }>({});

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setVillage(existing.village || '');
      setDistrict(existing.district || '');
      setState(existing.state || '');
      setArea(String(existing.areaValue));
      setAreaUnit(existing.areaUnit);
      setIrrigation(existing.irrigation);
      setSoilType(existing.soilType || '');
      setNotes(existing.notes || '');
    } else {
      // Sensible defaults from profile
      setVillage(profile?.village || '');
      setDistrict(profile?.district || '');
      setState(profile?.state || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function onSave() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t('farm.errName');
    const areaNum = parseFloat(area.replace(',', '.'));
    if (!area || isNaN(areaNum) || areaNum <= 0) e.area = t('farm.errArea');
    setErrors(e);
    if (Object.keys(e).length) return;

    saveFarm({
      id: existing?.id,
      name: name.trim(),
      village: village.trim() || undefined,
      district: district.trim() || undefined,
      state: state || undefined,
      areaValue: areaNum,
      areaUnit,
      irrigation,
      soilType: soilType || undefined,
      notes: notes.trim() || undefined,
    });
    router.back();
  }

  function onDelete() {
    if (!existing) return;
    Alert.alert(t('farm.deleteTitle'), t('farm.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteFarm(existing.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: isEdit ? t('farm.edit') : t('farm.add') }} />

      <Input
        label={t('farm.name')}
        value={name}
        onChangeText={setName}
        placeholder={t('farm.namePh')}
        error={errors.name}
        autoCapitalize="words"
      />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Input
            label={t('auth.village')}
            value={village}
            onChangeText={setVillage}
            optionalLabel={t('common.optional')}
            autoCapitalize="words"
          />
        </View>
        <View style={{ width: spacing.md }} />
        <View style={{ flex: 1 }}>
          <Input
            label={t('auth.district')}
            value={district}
            onChangeText={setDistrict}
            optionalLabel={t('common.optional')}
            autoCapitalize="words"
          />
        </View>
      </View>

      <Select
        label={t('auth.state')}
        value={state}
        onChange={setState}
        searchable
        optionalLabel={t('common.optional')}
        options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
      />

      <Text style={styles.groupLabel}>{t('farm.area')}</Text>
      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Input
            value={area}
            onChangeText={setArea}
            keyboardType="decimal-pad"
            placeholder="2.5"
            error={errors.area}
          />
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

      <Text style={styles.groupLabel}>{t('farm.irrigation')}</Text>
      <Segmented
        options={[
          { value: 'irrigated', label: t('farm.irrigated') },
          { value: 'rainfed', label: t('farm.rainfed') },
          { value: 'both', label: t('farm.both') },
        ]}
        value={irrigation}
        onChange={(v) => setIrrigation(v as IrrigationType)}
        style={{ marginBottom: spacing.lg }}
      />

      <Select
        label={t('farm.soil')}
        value={soilType}
        onChange={setSoilType}
        optionalLabel={t('common.optional')}
        placeholder={t('common.select')}
        options={SOIL_TYPES.map((s) => ({
          value: s.key,
          label: lang === 'hi' ? s.hi : s.en,
        }))}
      />

      <Input
        label={t('farm.notes')}
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
  row2: { flexDirection: 'row', alignItems: 'flex-start' },
  groupLabel: {
    fontSize: font.sm,
    fontWeight: weight.semibold,
    color: colors.text,
    marginBottom: 8,
  },
});
