import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Card, Screen, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { INDIAN_STATES } from '@/data/crops';
import { isPhoneValid } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { Language } from '@/types/models';

export default function ProfileScreen() {
  const { t, profile, updateProfile } = useApp();

  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [village, setVillage] = useState(profile?.village || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [state, setState] = useState(profile?.state || '');
  const [language, setLanguage] = useState<Language>(profile?.language || 'en');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function onSave() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t('profile.errName');
    if (!isPhoneValid(phone)) e.phone = t('profile.errPhone');
    setErrors(e);
    if (Object.keys(e).length) return;

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim(),
      district: district.trim(),
      state,
      language,
    });
    Alert.alert(t('common.saved'), t('profile.saved'));
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: t('profile.title') }} />

      <Card style={styles.headerCard}>
        <View style={styles.avatar}>
          <UserRound size={30} color={colors.primary} />
        </View>
        <Text style={styles.headerName}>{profile?.name}</Text>
        <Text style={styles.headerPhone}>{profile?.phone}</Text>
      </Card>

      <Input
        label={t('profile.name')}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        error={errors.name}
      />
      <Input
        label={t('profile.phone')}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.phone}
      />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Input
            label={t('profile.village')}
            value={village}
            onChangeText={setVillage}
            autoCapitalize="words"
          />
        </View>
        <View style={{ width: spacing.md }} />
        <View style={{ flex: 1 }}>
          <Input
            label={t('profile.district')}
            value={district}
            onChangeText={setDistrict}
            autoCapitalize="words"
          />
        </View>
      </View>

      <Select
        label={t('profile.state')}
        value={state}
        onChange={setState}
        searchable
        options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
      />

      <Text style={styles.groupLabel}>{t('common.language')}</Text>
      <Segmented
        options={[
          { value: 'en', label: 'English' },
          { value: 'hi', label: 'हिंदी' },
        ]}
        value={language}
        onChange={(l) => setLanguage(l as Language)}
        style={{ marginBottom: spacing.xl }}
      />

      <Button title={t('common.save')} size="lg" fullWidth onPress={onSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: { alignItems: 'center', gap: 4, paddingVertical: spacing.xl },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  headerName: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text },
  headerPhone: { fontSize: font.sm, color: colors.textMuted },
  row2: { flexDirection: 'row', alignItems: 'flex-start' },
  groupLabel: {
    fontSize: font.sm,
    fontWeight: weight.semibold,
    color: colors.text,
    marginBottom: 8,
  },
});
