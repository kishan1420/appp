import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import {
  Bell,
  ChevronRight,
  CloudSun,
  Landmark,
  LogOut,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import { Card, Screen, ScreenHeader, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { colors, font, spacing, weight } from '@/theme/tokens';

export default function MoreScreen() {
  const { t, lang, setLang, profile, logout, reminders } = useApp();
  const router = useRouter();
  const pendingCount = reminders.filter((r) => !r.done).length;

  function onLogout() {
    Alert.alert(t('more.logout'), t('more.logoutMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('more.logout'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth/login');
        },
      },
    ]);
  }

  return (
    <Screen>
      <ScreenHeader title={t('more.title')} />

      {/* Profile card */}
      <Card onPress={() => router.push('/profile')} style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={26} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName} numberOfLines={1}>{profile?.name}</Text>
          <View style={styles.profileMetaRow}>
            <Phone size={12} color={colors.textMuted} />
            <Text style={styles.profileMeta}>{profile?.phone}</Text>
          </View>
          {profile?.village || profile?.district ? (
            <View style={styles.profileMetaRow}>
              <MapPin size={12} color={colors.textMuted} />
              <Text style={styles.profileMeta} numberOfLines={1}>
                {[profile?.village, profile?.district].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </Card>

      {/* Menu */}
      <Card style={{ paddingVertical: spacing.sm, gap: 0 }}>
        <MenuRow
          icon={Wallet}
          color={colors.success}
          bg={colors.successSoft}
          label={t('more.finance')}
          onPress={() => router.push('/finance')}
        />
        <MenuRow
          icon={Bell}
          color={colors.info}
          bg={colors.infoSoft}
          label={t('more.reminders')}
          badge={pendingCount > 0 ? String(pendingCount) : undefined}
          onPress={() => router.push('/reminders')}
        />
        <MenuRow
          icon={CloudSun}
          color="#0284C7"
          bg={colors.infoSoft}
          label={t('more.weather')}
          onPress={() => router.push('/weather')}
        />
        <MenuRow
          icon={Store}
          color={colors.accent}
          bg={colors.accentSoft}
          label={t('more.mandi')}
          onPress={() => router.navigate('/market')}
        />
        <MenuRow
          icon={Landmark}
          color="#7C3AED"
          bg="#F3E8FF"
          label={t('more.schemes')}
          onPress={() => router.navigate('/schemes')}
          last
        />
      </Card>

      {/* Language */}
      <Card>
        <Text style={styles.langLabel}>{t('more.language')}</Text>
        <Segmented
          options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिंदी' },
          ]}
          value={lang}
          onChange={(l) => setLang(l as 'en' | 'hi')}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      {/* About */}
      <Card
        onPress={() =>
          Alert.alert(
            t('more.about'),
            t('more.aboutText', {
              version: Constants.expoConfig?.version ?? '1.0.0',
            }),
          )
        }
      >
        <View style={styles.aboutRow}>
          <View style={[styles.aboutIcon, { backgroundColor: colors.primarySoft }]}>
            <ShieldCheck size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aboutTitle}>{t('more.about')}</Text>
            <Text style={styles.aboutSub}>{t('more.dataNote')}</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </Card>

      {/* Logout */}
      <Pressable style={styles.logoutBtn} onPress={onLogout} accessibilityRole="button">
        <LogOut size={18} color={colors.danger} />
        <Text style={styles.logoutText}>{t('more.logout')}</Text>
      </Pressable>

      <Text style={styles.version}>
        {t('app.name')} v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </Screen>
  );
}

function MenuRow({
  icon: Icon,
  color,
  bg,
  label,
  badge,
  onPress,
  last,
}: {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  badge?: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.menuRow,
        !last && styles.menuRowBorder,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: bg }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {badge ? (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text },
  profileMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  profileMeta: { fontSize: font.xs, color: colors.textMuted, flexShrink: 1 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: font.md, color: colors.text, fontWeight: weight.medium },
  menuBadge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBadgeText: { color: colors.white, fontSize: 11, fontWeight: weight.bold },
  langLabel: { fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  aboutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutTitle: { fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  aboutSub: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutText: { color: colors.danger, fontSize: font.md, fontWeight: weight.semibold },
  version: { textAlign: 'center', fontSize: font.xs, color: colors.textMuted },
});
