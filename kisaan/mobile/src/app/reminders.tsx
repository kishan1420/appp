import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Bell, BellRing, CheckCircle2, ChevronDown, ChevronUp, Circle, Plus } from 'lucide-react-native';
import { Badge, Card, EmptyState, Screen, ScreenHeader, SectionHeader } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { cropName } from '@/data/crops';
import { daysBetween, formatDate, todayISO } from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { Reminder } from '@/types/models';

export default function RemindersScreen() {
  const { t, lang, reminders, crops, toggleReminder } = useApp();
  const router = useRouter();
  const today = todayISO();
  const [showDone, setShowDone] = useState(false);

  const { overdue, upcoming, completed } = useMemo(() => {
    const pending = reminders.filter((r) => !r.done).sort((a, b) => a.date.localeCompare(b.date));
    return {
      overdue: pending.filter((r) => r.date < today),
      upcoming: pending.filter((r) => r.date >= today),
      completed: reminders.filter((r) => r.done).sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [reminders, today]);

  function dueLabel(r: Reminder) {
    const d = daysBetween(today, r.date);
    if (d === 0) return t('rem.dueToday');
    if (d === 1) return lang === 'hi' ? 'कल' : 'Tomorrow';
    return formatDate(r.date);
  }

  function catLabel(c: string): string {
    if (c === 'payment') return lang === 'hi' ? 'भुगतान' : 'Payment';
    return t(`act.${c}`);
  }

  function Row({ r, tone }: { r: Reminder; tone: 'overdue' | 'normal' | 'done' }) {
    const crop = r.cropId ? crops.find((c) => c.id === r.cropId) : undefined;
    return (
      <View style={styles.remRow}>
        <Pressable
          onPress={() => toggleReminder(r.id, !r.done)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={r.done ? t('rem.markPending') : t('rem.markDone')}
        >
          {r.done ? (
            <CheckCircle2 size={26} color={colors.success} />
          ) : (
            <Circle size={26} color={tone === 'overdue' ? colors.danger : colors.textMuted} />
          )}
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={() => router.push(`/reminder/edit?id=${r.id}`)}>
          <Text style={[styles.remTitle, r.done && styles.remTitleDone]} numberOfLines={2}>
            {r.title}
          </Text>
          <View style={styles.remMetaRow}>
            <Text
              style={[
                styles.remMeta,
                tone === 'overdue' && { color: colors.danger, fontWeight: weight.semibold },
                r.done && { color: colors.textMuted },
              ]}
            >
              {r.done ? formatDate(r.date) : dueLabel(r)}
              {r.time && !r.done ? ` · ${r.time}` : ''}
            </Text>
            {r.category && r.category !== 'other' ? (
              <Badge tone="blue" label={catLabel(r.category)} />
            ) : null}
            {crop ? (
              <Badge tone="green" label={cropName(crop.cropKey, lang, crop.customName)} />
            ) : null}
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: t('rem.title') }} />
      <ScreenHeader
        title={t('rem.title')}
        right={
          <Pressable
            style={styles.addBtn}
            onPress={() => router.push('/reminder/edit')}
            accessibilityRole="button"
            accessibilityLabel={t('rem.add')}
          >
            <Plus size={22} color={colors.white} />
          </Pressable>
        }
      />

      {reminders.length === 0 ? (
        <Card>
          <EmptyState icon={BellRing} title={t('rem.noRem')} subtitle={t('rem.noRemSub')}>
            <Pressable style={styles.cta} onPress={() => router.push('/reminder/edit')}>
              <Plus size={18} color={colors.white} />
              <Text style={styles.ctaText}>{t('rem.add')}</Text>
            </Pressable>
          </EmptyState>
        </Card>
      ) : (
        <>
          {overdue.length > 0 ? (
            <View>
              <SectionHeader title={`${t('rem.overdue')} (${overdue.length})`} />
              <Card style={{ gap: spacing.lg }}>
                {overdue.map((r) => <Row key={r.id} r={r} tone="overdue" />)}
              </Card>
            </View>
          ) : null}

          {upcoming.length > 0 ? (
            <View>
              <SectionHeader title={`${t('rem.upcoming')} (${upcoming.length})`} />
              <Card style={{ gap: spacing.lg }}>
                {upcoming.map((r) => <Row key={r.id} r={r} tone="normal" />)}
              </Card>
            </View>
          ) : null}

          {completed.length > 0 ? (
            <View>
              <Pressable style={styles.doneHeader} onPress={() => setShowDone((s) => !s)}>
                <Text style={styles.doneHeaderText}>
                  {t('rem.completed')} ({completed.length})
                </Text>
                {showDone ? <ChevronUp size={18} color={colors.textMuted} /> : <ChevronDown size={18} color={colors.textMuted} />}
              </Pressable>
              {showDone ? (
                <Card style={{ gap: spacing.lg, opacity: 0.85 }}>
                  {completed.map((r) => <Row key={r.id} r={r} tone="done" />)}
                </Card>
              ) : null}
            </View>
          ) : null}

          {overdue.length === 0 && upcoming.length === 0 && completed.length > 0 ? (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Bell size={20} color={colors.success} />
                <Text style={{ flex: 1, color: colors.textMuted, fontSize: font.sm }}>
                  {t('dash.noReminders')} 🎉
                </Text>
              </View>
            </Card>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  ctaText: { color: colors.white, fontWeight: weight.semibold, fontSize: font.md },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  remTitle: { fontSize: font.md, color: colors.text, fontWeight: weight.medium },
  remTitleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  remMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' },
  remMeta: { fontSize: font.xs, color: colors.textMuted },
  doneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  doneHeaderText: { fontSize: font.lg, fontWeight: weight.bold, color: colors.textMuted },
});
