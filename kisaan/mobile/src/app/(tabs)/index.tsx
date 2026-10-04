import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  CloudSun,
  Droplets,
  Landmark,
  MapPin,
  Plus,
  Sprout,
  Tractor,
  Wallet,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, ProgressBar, Screen, SectionHeader, WeatherGlyph } from '@/components/ui';
import Button from '@/components/Button';
import { useApp } from '@/store/AppStore';
import { useWeather } from '@/hooks/useWeather';
import { conditionLabelKey, weatherCondition } from '@/services/weather';
import { cropName } from '@/data/crops';
import { getCropProgress } from '@/utils/cropProgress';
import {
  daysBetween,
  formatDate,
  formatINR,
  formatNumber,
  monthOf,
  todayISO,
} from '@/utils/helpers';
import { colors, font, radius, spacing, weight } from '@/theme/tokens';
import type { Reminder } from '@/types/models';

export default function DashboardScreen() {
  const { t, lang, profile, farms, crops, reminders, transactions, toggleReminder } = useApp();
  const weather = useWeather();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const today = todayISO();
  const month = monthOf(today);

  const firstName = (profile?.name || '').split(' ')[0];

  const pendingReminders = useMemo(
    () =>
      reminders
        .filter((r) => !r.done)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [reminders],
  );
  const pendingCount = reminders.filter((r) => !r.done).length;

  const activeCrops = useMemo(
    () =>
      crops
        .filter((c) => c.status !== 'harvested')
        .sort((a, b) => b.sowingDate.localeCompare(a.sowingDate))
        .slice(0, 4),
    [crops],
  );

  const monthTxns = useMemo(
    () => transactions.filter((tx) => monthOf(tx.date) === month),
    [transactions, month],
  );
  const income = monthTxns.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expense = monthTxns.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);

  function reminderDue(r: Reminder) {
    const d = daysBetween(today, r.date);
    if (d < 0) return { label: t('rem.overdue'), tone: 'red' as const };
    if (d === 0) return { label: t('rem.dueToday'), tone: 'amber' as const };
    return { label: formatDate(r.date), tone: 'gray' as const };
  }

  return (
    <Screen>
      {/* Greeting header */}
      <View style={[styles.greetRow, { paddingTop: insets.top + spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greet}>
            {t('dash.greeting')}{firstName ? `, ${firstName}` : ''} 🙏
          </Text>
          {profile?.village || profile?.district ? (
            <View style={styles.locRow}>
              <MapPin size={13} color={colors.textMuted} />
              <Text style={styles.locText} numberOfLines={1}>
                {[profile?.village, profile?.district, profile?.state].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
        <Pressable
          style={styles.bellBtn}
          onPress={() => router.push('/reminders')}
          accessibilityRole="button"
          accessibilityLabel={t('rem.title')}
        >
          <Bell size={22} color={colors.primaryDark} />
          {pendingCount > 0 ? (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{pendingCount > 9 ? '9+' : pendingCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* Weather strip */}
      <Card
        style={styles.weatherCard}
        onPress={() => router.push('/weather')}
      >
        {weather.snapshot ? (
          <View style={styles.weatherRow}>
            <WeatherGlyph condition={weatherCondition(weather.snapshot.current.code)} size={42} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }}>
                <Text style={styles.temp}>{weather.snapshot.current.temp}°C</Text>
                <Text style={styles.weatherCond} numberOfLines={1}>
                  {t(conditionLabelKey(weather.snapshot.current.code))}
                </Text>
              </View>
              <View style={styles.weatherMeta}>
                <Text style={styles.weatherMetaText}>
                  {weather.snapshot.placeName}
                  {weather.snapshot.current.rainChance != null
                    ? `  ·  ${t('dash.rainChance')}: ${weather.snapshot.current.rainChance}%`
                    : ''}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </View>
        ) : weather.loading ? (
          <View style={[styles.weatherRow, { justifyContent: 'center', paddingVertical: spacing.sm }]}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.weatherRow}>
            <CloudSun size={34} color={colors.info} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.weatherCond}>{t('weather.noLocation')}</Text>
              <Text style={styles.weatherMetaText}>{t('dash.weatherTap')}</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </View>
        )}
      </Card>

      {/* Quick actions */}
      <View>
        <SectionHeader title={t('dash.quickActions')} />
        <View style={styles.quickGrid}>
          <QuickTile
            icon={Sprout}
            label={t('dash.addCrop')}
            bg={colors.primarySoft}
            fg={colors.primary}
            onPress={() => router.push('/crop/edit')}
          />
          <QuickTile
            icon={Wallet}
            label={t('dash.addMoney')}
            bg={colors.accentSoft}
            fg={colors.accent}
            onPress={() => router.push('/finance/edit')}
          />
          <QuickTile
            icon={Bell}
            label={t('dash.addReminder')}
            bg={colors.infoSoft}
            fg={colors.info}
            onPress={() => router.push('/reminder/edit')}
          />
          <QuickTile
            icon={Landmark}
            label={t('dash.viewSchemes')}
            bg="#F3E8FF"
            fg="#7C3AED"
            onPress={() => router.push('/schemes')}
          />
        </View>
      </View>

      {/* Upcoming reminders */}
      {pendingReminders.length > 0 ? (
        <View>
          <SectionHeader
            title={t('dash.upcomingReminders')}
            action={t('common.seeAll')}
            onAction={() => router.push('/reminders')}
          />
          <Card style={{ gap: spacing.md }}>
            {pendingReminders.map((r) => {
              const due = reminderDue(r);
              return (
                <View key={r.id} style={styles.remRow}>
                  <Pressable
                    onPress={() => toggleReminder(r.id, true)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={t('rem.markDone')}
                  >
                    <Circle size={24} color={colors.textMuted} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.remTitle} numberOfLines={1}>{r.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      {due.tone !== 'gray' ? (
                        <Text style={[styles.remDue, due.tone === 'red' && { color: colors.danger }, due.tone === 'amber' && { color: colors.warning }]}>
                          {due.label}
                        </Text>
                      ) : (
                        <Text style={styles.remDue}>{due.label}</Text>
                      )}
                      {r.time ? <Text style={styles.remDue}>· {r.time}</Text> : null}
                    </View>
                  </View>
                  {r.cropId ? (
                    <Badge
                      tone="green"
                      label={cropName(
                        crops.find((c) => c.id === r.cropId)?.cropKey ?? 'other',
                        lang,
                        crops.find((c) => c.id === r.cropId)?.customName,
                      )}
                    />
                  ) : null}
                </View>
              );
            })}
          </Card>
        </View>
      ) : null}

      {/* Active crops */}
      {activeCrops.length > 0 ? (
        <View>
          <SectionHeader
            title={t('dash.activeCrops')}
            action={t('nav.farms')}
            onAction={() => router.push('/farms')}
          />
          <Card style={{ gap: spacing.lg }}>
            {activeCrops.map((crop) => {
              const p = getCropProgress(crop, today);
              const farm = farms.find((f) => f.id === crop.farmId);
              return (
                <Pressable
                  key={crop.id}
                  onPress={() => router.push(`/crop/${crop.id}`)}
                  accessibilityRole="button"
                >
                  <View style={styles.cropRowTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cropName} numberOfLines={1}>
                        {cropName(crop.cropKey, lang, crop.customName)}
                        {crop.variety ? ` · ${crop.variety}` : ''}
                      </Text>
                      <Text style={styles.cropFarm} numberOfLines={1}>
                        {farm?.name || ''}
                        {crop.season ? ` · ${t(`crop.${crop.season}`)}` : ''}
                      </Text>
                    </View>
                    <Badge tone={p.stage === 'done' ? 'amber' : 'green'} label={t(`crop.stage.${p.stage}`)} />
                  </View>
                  <View style={{ marginTop: spacing.sm }}>
                    <ProgressBar percent={p.percent} color={p.stage === 'done' ? colors.accent : colors.primaryLight} />
                    <Text style={styles.cropDays}>
                      {p.stage === 'done'
                        ? t('dash.harvestReady')
                        : p.daysLeft >= 0
                          ? t('dash.daysLeft', { n: p.daysLeft })
                          : t('crop.overdue')}
                      {` · ${p.percent}%`}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Card>
        </View>
      ) : null}

      {/* Farms */}
      <View>
        <SectionHeader
          title={t('dash.yourFarms')}
          action={farms.length > 0 ? t('common.seeAll') : undefined}
          onAction={() => router.push('/farms')}
        />
        {farms.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm }}>
              <View style={styles.farmIconCircle}>
                <Tractor size={26} color={colors.primary} />
              </View>
              <Text style={styles.noFarmTitle}>{t('dash.noFarmsTitle')}</Text>
              <Text style={styles.noFarmSub}>{t('dash.noFarmsSub')}</Text>
              <Button
                title={t('dash.createFarm')}
                icon={Plus}
                onPress={() => router.push('/farm/edit')}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </Card>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
            {farms.slice(0, 5).map((f) => {
              const farmCrops = crops.filter((c) => c.farmId === f.id && c.status !== 'harvested');
              return (
                <Pressable key={f.id} onPress={() => router.push(`/farm/${f.id}`)}>
                  <Card style={styles.farmChip}>
                    <Text style={styles.farmChipName} numberOfLines={1}>{f.name}</Text>
                    <Text style={styles.farmChipMeta}>
                      {formatNumber(f.areaValue)} {t(`farm.${f.areaUnit}`)}
                    </Text>
                    <Text style={styles.farmChipMeta}>
                      {t('farm.activeCrops', { n: farmCrops.length })}
                    </Text>
                  </Card>
                </Pressable>
              );
            })}
            <Pressable
              style={styles.addFarmChip}
              onPress={() => router.push('/farm/edit')}
              accessibilityRole="button"
            >
              <Plus size={22} color={colors.primary} />
              <Text style={styles.addFarmText}>{t('farm.add')}</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>

      {/* This month money */}
      <View>
        <SectionHeader
          title={t('dash.monthMoney')}
          action={t('common.seeAll')}
          onAction={() => router.push('/finance')}
        />
        <Card onPress={() => router.push('/finance')}>
          <View style={styles.moneyRow}>
            <View style={styles.moneyCol}>
              <Text style={styles.moneyLabel}>{t('dash.income')}</Text>
              <Text style={[styles.moneyValue, { color: colors.success }]} numberOfLines={1}>
                {formatINR(income)}
              </Text>
            </View>
            <View style={styles.moneyDivider} />
            <View style={styles.moneyCol}>
              <Text style={styles.moneyLabel}>{t('dash.expense')}</Text>
              <Text style={[styles.moneyValue, { color: colors.danger }]} numberOfLines={1}>
                {formatINR(expense)}
              </Text>
            </View>
            <View style={styles.moneyDivider} />
            <View style={styles.moneyCol}>
              <Text style={styles.moneyLabel}>{t('dash.net')}</Text>
              <Text
                style={[styles.moneyValue, { color: income - expense >= 0 ? colors.text : colors.danger }]}
                numberOfLines={1}
              >
                {formatINR(income - expense)}
              </Text>
            </View>
          </View>
          {monthTxns.length === 0 ? (
            <View style={styles.moneyEmptyRow}>
              <Droplets size={14} color={colors.textMuted} />
              <Text style={styles.moneyEmptyText}>{t('fin.noTxnsSub')}</Text>
            </View>
          ) : null}
        </Card>
      </View>

      {/* No crops hint */}
      {crops.length === 0 && farms.length > 0 ? (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={{ flex: 1, color: colors.textMuted, fontSize: font.sm }}>{t('dash.noCrops')}</Text>
            <Pressable onPress={() => router.push('/crop/edit')}>
              <Text style={{ color: colors.primary, fontWeight: weight.semibold, fontSize: font.sm }}>
                {t('crop.add')}
              </Text>
            </Pressable>
          </View>
        </Card>
      ) : null}

      <View style={{ height: insets.bottom }} />
    </Screen>
  );
}

function QuickTile({
  icon: Icon,
  label,
  bg,
  fg,
  onPress,
}: {
  icon: typeof Sprout;
  label: string;
  bg: string;
  fg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.quickTile, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: bg }]}>
        <Icon size={24} color={fg} />
      </View>
      <Text style={styles.quickLabel} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  greet: { fontSize: font.xxl, fontWeight: weight.bold, color: colors.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locText: { fontSize: font.sm, color: colors.textMuted, flexShrink: 1 },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: { color: colors.white, fontSize: 10, fontWeight: weight.bold },
  weatherCard: { backgroundColor: colors.surface },
  weatherRow: { flexDirection: 'row', alignItems: 'center' },
  temp: { fontSize: font.xxl, fontWeight: weight.bold, color: colors.text },
  weatherCond: { fontSize: font.md, color: colors.text, fontWeight: weight.medium, flexShrink: 1 },
  weatherMeta: { flexDirection: 'row', marginTop: 2 },
  weatherMetaText: { fontSize: font.xs, color: colors.textMuted },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickTile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { flex: 1, fontSize: font.sm, fontWeight: weight.semibold, color: colors.text, lineHeight: 18 },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  remTitle: { fontSize: font.md, color: colors.text, fontWeight: weight.medium },
  remDue: { fontSize: font.xs, color: colors.textMuted },
  cropRowTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cropName: { fontSize: font.md, fontWeight: weight.semibold, color: colors.text },
  cropFarm: { fontSize: font.xs, color: colors.textMuted, marginTop: 2 },
  cropDays: { fontSize: font.xs, color: colors.textMuted, marginTop: 5 },
  farmIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFarmTitle: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text },
  noFarmSub: { fontSize: font.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  farmChip: { width: 150, gap: 2 },
  farmChipName: { fontSize: font.md, fontWeight: weight.bold, color: colors.text },
  farmChipMeta: { fontSize: font.xs, color: colors.textMuted },
  addFarmChip: {
    width: 110,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.md,
  },
  addFarmText: { fontSize: font.xs, color: colors.primary, fontWeight: weight.semibold },
  moneyRow: { flexDirection: 'row', alignItems: 'center' },
  moneyCol: { flex: 1, gap: 2 },
  moneyLabel: { fontSize: font.xs, color: colors.textMuted },
  moneyValue: { fontSize: font.lg, fontWeight: weight.bold },
  moneyDivider: { width: 1, height: 34, backgroundColor: colors.border },
  moneyEmptyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  moneyEmptyText: { fontSize: font.xs, color: colors.textMuted, flex: 1 },
});
