import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Phone, Sprout } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { colors, font, radius, shadow, spacing, weight } from '@/theme/tokens';
import { isPhoneValid } from '@/utils/helpers';

export default function LoginScreen() {
  const { t, lang, setLang, login, profile, updateProfile } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  // Already logged in? Go to the dashboard.
  useEffect(() => {
    if (profile) router.replace('/(tabs)');
  }, [profile, router]);

  async function onLogin() {
    const e: typeof errors = {};
    if (!isPhoneValid(phone)) e.phone = t('auth.errPhone');
    if (password.length < 4) e.password = t('auth.errPasswordMin');
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    const ok = await login(phone, password);
    setBusy(false);
    if (ok) {
      // Keep profile language in sync with any language switched at login.
      if (lang !== profile?.language) updateProfile({ language: lang });
      router.replace('/(tabs)');
    } else {
      setErrors({ form: t('auth.errInvalid') });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Language toggle */}
        <View style={styles.langRow}>
          <Segmented
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिंदी' },
            ]}
            value={lang}
            onChange={(l) => setLang(l as 'en' | 'hi')}
            style={{ width: 180 }}
          />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Sprout size={38} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{t('app.name')}</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
          <Text style={styles.sub}>{t('auth.loginSub')}</Text>

          <View style={{ height: spacing.lg }} />
          <Input
            label={t('auth.phone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="98765 43210"
            icon={Phone}
            error={errors.phone}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          {errors.form ? (
            <Text style={styles.formError}>{errors.form}</Text>
          ) : null}

          <Button title={t('auth.login')} size="lg" fullWidth loading={busy} onPress={onLogin} />

          <View style={{ height: spacing.lg }} />
          <Link href="/auth/register" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.link}>{t('auth.noAccount')}</Text>
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
  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  appName: { fontSize: font.hero, fontWeight: weight.bold, color: colors.primaryDark, letterSpacing: 0.5 },
  tagline: { fontSize: font.md, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  title: { fontSize: font.xl, fontWeight: weight.bold, color: colors.text },
  sub: { fontSize: font.sm, color: colors.textMuted, marginTop: 4 },
  formError: {
    color: colors.danger,
    fontSize: font.sm,
    marginBottom: spacing.md,
    fontWeight: weight.medium,
  },
  link: { color: colors.primary, fontSize: font.md, fontWeight: weight.semibold, textAlign: 'center' },
  demoNote: {
    color: colors.textMuted,
    fontSize: font.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 17,
  },
});
