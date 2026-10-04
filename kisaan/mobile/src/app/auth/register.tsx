import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { INDIAN_STATES } from '@/data/crops';
import { colors, font, radius, shadow, spacing, weight } from '@/theme/tokens';
import { isPhoneValid } from '@/utils/helpers';
import type { Language } from '@/types/models';

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  state?: string;
}

export default function RegisterScreen() {
  const { t, lang, setLang, register } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [language, setLanguage] = useState<Language>(lang);
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim()) e.name = t('auth.errName');
    if (!isPhoneValid(phone)) e.phone = t('auth.errPhone');
    if (password.length < 4) e.password = t('auth.errPasswordMin');
    if (password !== confirm) e.confirm = t('auth.errMismatch');
    if (!state) e.state = t('auth.errState');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit() {
    if (!validate()) return;
    setBusy(true);
    setLang(language);
    await register({ name, phone, password, village, district, state, language });
    setBusy(false);
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.langRow}>
          <Segmented
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिंदी' },
            ]}
            value={language}
            onChange={(l) => {
              setLanguage(l as Language);
              setLang(l as Language);
            }}
            style={{ width: 180 }}
          />
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.sub}>{t('auth.registerSub')}</Text>
        </View>

        <View style={styles.card}>
          <Input
            label={t('auth.fullName')}
            value={name}
            onChangeText={setName}
            placeholder={lang === 'hi' ? 'जैसे रामेश कुमार' : 'e.g. Ramesh Kumar'}
            autoCapitalize="words"
            error={errors.name}
          />
          <Input
            label={t('auth.phone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="98765 43210"
            error={errors.phone}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            error={errors.confirm}
          />
          <Input
            label={t('auth.village')}
            value={village}
            onChangeText={setVillage}
            optionalLabel={t('common.optional')}
            autoCapitalize="words"
          />
          <Input
            label={t('auth.district')}
            value={district}
            onChangeText={setDistrict}
            optionalLabel={t('common.optional')}
            autoCapitalize="words"
          />
          <Select
            label={t('auth.state')}
            value={state}
            onChange={setState}
            searchable
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            error={errors.state}
          />

          <Button title={t('auth.register')} size="lg" fullWidth loading={busy} onPress={onSubmit} />

          <View style={{ height: spacing.lg }} />
          <Link href="/auth/login" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.link}>{t('auth.haveAccount')}</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.demoNote}>{t('auth.demoNote')}</Text>
        <View style={{ height: insets.bottom + spacing.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.lg },
  langRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  hero: { paddingTop: spacing.sm },
  title: { fontSize: font.xxl, fontWeight: weight.bold, color: colors.text },
  sub: { fontSize: font.sm, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  link: {
    color: colors.primary,
    fontSize: font.md,
    fontWeight: weight.semibold,
    textAlign: 'center',
  },
  demoNote: {
    color: colors.textMuted,
    fontSize: font.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 17,
  },
});
