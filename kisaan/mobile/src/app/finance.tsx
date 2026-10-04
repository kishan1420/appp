import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Beef,
  Bug,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Droplets,
  FlaskConical,
  Landmark,
  MapPin,
  MoreHorizontal,
  Plus,
  Sprout,
  Tractor,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wheat,
} from 'lucide-react-native';
import { Badge, Card, EmptyState, Screen, ScreenHeader, SectionHeader, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { cropName } from '@/data/crops';
import {
  formatDate,
  formatINR,
  monthOf,
  shiftMonth,
  todayISO,
  formatMonth,
} from '@/utils/helpers';
import { colors, font, spacing, weight } from '@/theme/tokens';
import type { ExpenseCategory, IncomeCategory, Transaction } from '@/types/models';

const CAT_ICONS: Record<string, typeof Sprout> = {
  seed: Sprout,
  fertilizer: FlaskConical,
  pesticide: Bug,
  irrigation: Droplets,
  labour: Users,
  machinery: Tractor,
  land: MapPin,
  transport: Truck,
  cropSale: Wheat,
  livestock: Beef,
  subsidy: Landmark,
  rental: CircleDollarSign,
  other: MoreHorizontal,
};

export default function FinanceScreen() {
  const { t, lang, transactions, crops, farms } = useApp();
  const router = useRouter();
  const [month, setMonth] = useState(monthOf(todayISO()));
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const monthTxns = useMemo(
    () =>
      transactions
        .filter((tx) => monthOf(tx.date) === month)
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [transactions, month],
  );

  const income = monthTxns.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expense = monthTxns.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  const net = income - expense;

  const byCrop = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const tx of monthTxns) {
      if (!tx.cropId) continue;
      const cur = map.get(tx.cropId) || { income: 0, expense: 0 };
      if (tx.type === 'income') cur.income += tx.amount;
      else cur.expense += tx.amount;
      map.set(tx.cropId, cur);
    }
    return Array.from(map.entries())
      .map(([cropId, v]) => ({
        cropId,
        crop: crops.find((c) => c.id === cropId),
        ...v,
        net: v.income - v.expense,
      }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }, [monthTxns, crops]);

  const shown = monthTxns.filter((tx) => filter === 'all' || tx.type === filter);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('fin.title') }} />
      <ScreenHeader
        title={t('fin.title')}
        right={
          <Pressable
            style={styles.addBtn}
            onPress={() => router.push('/finance/edit')}
            accessibilityRole="button"
            accessibilityLabel={t('fin.add')}
          >
            <Plus size={22} color={colors.white} />
          </Pressable>
        }
      />

      {/* Month navigation */}
      <View style={styles.monthRow}>
        <Pressable style={styles.monthBtn} onPress={() => setMonth(shiftMonth(month, -1))} hitSlop={6}>
          <ChevronLeft size={20} color={colors.primary} />
        </Pressable>
        <Text style={styles.monthLabel}>{formatMonth(month)}</Text>
        <Pressable
          style={styles.monthBtn}
          onPress={() => setMonth(shiftMonth(month, 1))}
          hitSlop={6}
          disabled={month >= monthOf(todayISO())}
        >
          <ChevronRight size={20} color={month >= monthOf(todayISO()) ? colors.border : colors.primary} />
        </Pressable>
      </View>

      {/* Summary */}
      <Card>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.successSoft }]}>
              <TrendingUp size={16} color={colors.success} />
            </View>
            <Text style={styles.summaryLabel}>{t('fin.income')}</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]} numberOfLines={1}>
              {formatINR(income)}
            </Text>
          </View>
          <View style={styles.summaryCol}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.dangerSoft }]}>
              <TrendingDown size={16} color={colors.danger} />
            </View>
            <Text style={styles.summaryLabel}>{t('fin.expense')}</Text>
            <Text style={[styles.summaryValue, { color: colors.danger }]} numberOfLines={1}>
              {formatINR(expense)}
            </Text>
          </View>
          <View style={styles.summaryCol}>
            <View style={[styles.summaryIcon, { backgroundColor: net >= 0 ? colors.primarySoft : colors.dangerSoft }]}>
              <Wallet size={16} color={net >= 0 ? colors.primary : colors.danger} />
            </View>
            <Text style={styles.summaryLabel}>{t('fin.net')}</Text>
            <Text style={[styles.summaryValue, { color: net >= 0 ? colors.primary : colors.danger }]} numberOfLines={1}>
              {formatINR(net)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Crop-wise */}
      {byCrop.length > 0 ? (
        <View>
          <SectionHeader title={t('fin.byCrop')} />
          <Card style={{ gap: spacing.md }}>
            {byCrop.map((row) => (
              <View key={row.cropId} style={styles.cropRow}>
                <Text style={styles.cropRowName} numberOfLines={1}>
                  {row.crop
                    ? cropName(row.crop.cropKey, lang, row.crop.customName)
                    : '—'}
                </Text>
                <Text style={[styles.cropRowNet, { color: row.net >= 0 ? colors.success : colors.danger }]}>
                  {formatINR(row.net)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      {/* Filter */}
      <Segmented
        options={[
          { value: 'all', label: t('common.all') },
          { value: 'income', label: t('fin.income') },
          { value: 'expense', label: t('fin.expense') },
        ]}
        value={filter}
        onChange={(v) => setFilter(v as typeof filter)}
      />

      {/* Transactions */}
      {shown.length === 0 ? (
        <Card>
          <EmptyState icon={Wallet} title={t('fin.noTxns')} subtitle={t('fin.noTxnsSub')} />
        </Card>
      ) : (
        <Card style={{ gap: spacing.md }}>
          {shown.map((tx) => (
            <TxnRow
              key={tx.id}
              tx={tx}
              onPress={() => router.push(`/finance/edit?id=${tx.id}`)}
            />
          ))}
        </Card>
      )}
    </Screen>
  );
}

function TxnRow({ tx, onPress }: { tx: Transaction; onPress: () => void }) {
  const { t, lang, crops, farms } = useApp();
  const Icon = CAT_ICONS[tx.category] || MoreHorizontal;
  const isIncome = tx.type === 'income';
  const crop = tx.cropId ? crops.find((c) => c.id === tx.cropId) : undefined;
  const farm = tx.farmId ? farms.find((f) => f.id === tx.farmId) : undefined;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.txnRow}>
        <View style={[styles.txnIcon, { backgroundColor: isIncome ? colors.successSoft : colors.dangerSoft }]}>
          <Icon size={17} color={isIncome ? colors.success : colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.txnCat}>{t(`fin.cat.${tx.category}`)}</Text>
          <View style={styles.txnMetaRow}>
            <Text style={styles.txnMeta}>{formatDate(tx.date)}</Text>
            {crop ? (
              <Badge
                tone="green"
                label={cropName(crop.cropKey, lang, crop.customName)}
              />
            ) : farm ? (
              <Badge tone="gray" label={farm.name} />
            ) : null}
          </View>
        </View>
        <Text style={[styles.txnAmount, { color: isIncome ? colors.success : colors.danger }]}>
          {isIncome ? '+' : '−'}{formatINR(tx.amount)}
        </Text>
      </View>
    </Pressable>
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
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: -spacing.sm,
  },
  monthBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: { fontSize: font.md, fontWeight: weight.bold, color: colors.text, minWidth: 100, textAlign: 'center' },
  summaryRow: { flexDirection: 'row' },
  summaryCol: { flex: 1, alignItems: 'center', gap: 4 },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: { fontSize: font.xs, color: colors.textMuted },
  summaryValue: { fontSize: font.md, fontWeight: weight.bold },
  cropRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  cropRowName: { flex: 1, fontSize: font.sm, color: colors.text, fontWeight: weight.medium },
  cropRowNet: { fontSize: font.sm, fontWeight: weight.bold },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  txnIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnCat: { fontSize: font.md, color: colors.text, fontWeight: weight.medium },
  txnMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  txnMeta: { fontSize: font.xs, color: colors.textMuted },
  txnAmount: { fontSize: font.md, fontWeight: weight.bold },
});
