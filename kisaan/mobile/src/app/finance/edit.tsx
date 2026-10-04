import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';
import DateField from '@/components/DateField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Screen, Segmented } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { cropName } from '@/data/crops';
import { todayISO } from '@/utils/helpers';
import { spacing } from '@/theme/tokens';
import type { ExpenseCategory, IncomeCategory, TxnType } from '@/types/models';

const EXPENSE_CATS: ExpenseCategory[] = [
  'seed', 'fertilizer', 'pesticide', 'irrigation', 'labour', 'machinery', 'land', 'transport', 'other',
];
const INCOME_CATS: IncomeCategory[] = ['cropSale', 'livestock', 'subsidy', 'rental', 'labour', 'other'];

export default function FinanceEditScreen() {
  const params = useLocalSearchParams<{ id?: string; type?: string; cropId?: string }>();
  const { t, lang, transactions, crops, farms, saveTransaction, deleteTransaction } = useApp();
  const router = useRouter();

  const existing = params.id ? transactions.find((tx) => tx.id === params.id) : undefined;
  const isEdit = !!existing;

  const [type, setType] = useState<TxnType>(
    existing?.type || (params.type === 'income' ? 'income' : 'expense'),
  );
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [category, setCategory] = useState<string>(existing?.category || '');
  const [date, setDate] = useState(existing?.date || todayISO());
  const [cropId, setCropId] = useState(existing?.cropId || params.cropId || '');
  const [farmId, setFarmId] = useState(existing?.farmId || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  useEffect(() => {
    // Reset category if it doesn't belong to the newly selected type
    const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;
    if (category && !(cats as string[]).includes(category)) setCategory('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const categoryOptions = useMemo(
    () =>
      (type === 'income' ? INCOME_CATS : EXPENSE_CATS).map((c) => ({
        value: c,
        label: t(`fin.cat.${c}`),
      })),
    [type, t],
  );

  const cropOptions = useMemo(
    () => [
      { value: '', label: t('common.none') },
      ...crops.map((c) => {
        const farm = farms.find((f) => f.id === c.farmId);
        return {
          value: c.id,
          label: cropName(c.cropKey, lang, c.customName),
          sub: farm?.name,
        };
      }),
    ],
    [crops, farms, lang, t],
  );

  const farmOptions = useMemo(
    () => [
      { value: '', label: t('common.none') },
      ...farms.map((f) => ({ value: f.id, label: f.name })),
    ],
    [farms, t],
  );

  function onSave() {
    const e: typeof errors = {};
    const amountNum = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(amountNum) || amountNum <= 0) e.amount = t('fin.errAmount');
    if (!category) e.category = t('fin.errCategory');
    setErrors(e);
    if (Object.keys(e).length) return;

    saveTransaction({
      id: existing?.id,
      type,
      amount: amountNum,
      category: category as ExpenseCategory | IncomeCategory,
      date,
      cropId: cropId || undefined,
      farmId: farmId || undefined,
      notes: notes.trim() || undefined,
    });
    router.back();
  }

  function onDelete() {
    if (!existing) return;
    Alert.alert(t('fin.deleteMsg'), t('common.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteTransaction(existing.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: isEdit ? t('fin.editEntry') : t('fin.add') }} />

      <Segmented
        options={[
          { value: 'expense', label: t('fin.expense') },
          { value: 'income', label: t('fin.income') },
        ]}
        value={type}
        onChange={(v) => setType(v as TxnType)}
        style={{ marginBottom: spacing.lg }}
      />

      <Input
        label={t('fin.amount')}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="1500"
        error={errors.amount}
      />

      <Select
        label={t('common.category')}
        value={category}
        onChange={setCategory}
        options={categoryOptions}
        error={errors.category}
      />

      <DateField label={t('common.date')} value={date} onChange={setDate} />

      <Select
        label={t('fin.crop')}
        value={cropId}
        onChange={setCropId}
        options={cropOptions}
        optionalLabel={t('common.optional')}
      />

      <Select
        label={t('fin.farm')}
        value={farmId}
        onChange={setFarmId}
        options={farmOptions}
        optionalLabel={t('common.optional')}
      />

      <Input
        label={t('common.notes')}
        value={notes}
        onChangeText={setNotes}
        optionalLabel={t('common.optional')}
      />

      <Button title={t('common.save')} size="lg" fullWidth onPress={onSave} />

      {isEdit ? (
        <Button
          title={t('common.delete')}
          variant="danger"
          icon={Trash2}
          fullWidth
          onPress={onDelete}
          style={styles.deleteBtn}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  deleteBtn: { marginTop: spacing.sm },
});
