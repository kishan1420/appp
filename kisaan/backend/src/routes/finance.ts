import { Router } from 'express';
import { query } from '../db';
import { asyncHandler, auth, type AuthRequest } from '../middleware/auth';
import { transactionSchema, validate } from '../validation';

export const financeRouter = Router();
financeRouter.use(auth);

interface TxnRow {
  id: string;
  type: string;
  amount: string;
  category: string;
  crop_id: string | null;
  farm_id: string | null;
  date: string;
  notes: string | null;
  created_at: string;
}

const toTxn = (r: TxnRow) => ({
  id: r.id,
  type: r.type,
  amount: Number(r.amount),
  category: r.category,
  cropId: r.crop_id,
  farmId: r.farm_id,
  date: r.date,
  notes: r.notes,
  createdAt: r.created_at,
});

financeRouter.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const { month, type, cropId } = req.query as Record<string, string | undefined>;
    const params: unknown[] = [req.userId];
    const where: string[] = ['user_id = $1'];
    if (month) {
      params.push(month);
      where.push(`to_char(date, 'YYYY-MM') = $${params.length}`);
    }
    if (type) {
      params.push(type);
      where.push(`type = $${params.length}`);
    }
    if (cropId) {
      params.push(cropId);
      where.push(`crop_id = $${params.length}`);
    }
    const rows = await query<TxnRow>(
      `SELECT * FROM transactions WHERE ${where.join(' AND ')} ORDER BY date DESC, created_at DESC`,
      params,
    );
    res.json({ transactions: rows.map(toTxn) });
  }),
);

financeRouter.get(
  '/summary',
  asyncHandler(async (req: AuthRequest, res) => {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const rows = await query<{ type: string; total: string }>(
      `SELECT type, COALESCE(SUM(amount),0)::text AS total FROM transactions
       WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2 GROUP BY type`,
      [req.userId, month],
    );
    const income = Number(rows.find((r) => r.type === 'income')?.total ?? 0);
    const expense = Number(rows.find((r) => r.type === 'expense')?.total ?? 0);

    const byCrop = await query<{ crop_id: string; type: string; total: string }>(
      `SELECT crop_id, type, COALESCE(SUM(amount),0)::text AS total FROM transactions
       WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2 AND crop_id IS NOT NULL
       GROUP BY crop_id, type`,
      [req.userId, month],
    );
    const cropMap = new Map<string, { income: number; expense: number }>();
    for (const r of byCrop) {
      const cur = cropMap.get(r.crop_id) || { income: 0, expense: 0 };
      if (r.type === 'income') cur.income = Number(r.total);
      else cur.expense = Number(r.total);
      cropMap.set(r.crop_id, cur);
    }

    res.json({
      month,
      income,
      expense,
      net: income - expense,
      byCrop: Array.from(cropMap.entries()).map(([cropId, v]) => ({
        cropId,
        ...v,
        net: v.income - v.expense,
      })),
    });
  }),
);

financeRouter.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(transactionSchema, req.body);
    if (!data) return res.status(400).json({ error });
    const rows = await query<TxnRow>(
      `INSERT INTO transactions (user_id, type, amount, category, crop_id, farm_id, date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.userId,
        data.type,
        data.amount,
        data.category,
        data.cropId ?? null,
        data.farmId ?? null,
        data.date,
        data.notes ?? null,
      ],
    );
    res.status(201).json({ transaction: toTxn(rows[0]) });
  }),
);

financeRouter.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(transactionSchema.partial(), req.body);
    if (!data) return res.status(400).json({ error });
    const rows = await query<TxnRow>(
      `UPDATE transactions SET
         type = COALESCE($3, type), amount = COALESCE($4, amount),
         category = COALESCE($5, category), crop_id = $6, farm_id = $7,
         date = COALESCE($8, date), notes = $9
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [
        req.params.id,
        req.userId,
        data.type ?? null,
        data.amount ?? null,
        data.category ?? null,
        data.cropId === undefined ? undefined : data.cropId,
        data.farmId === undefined ? undefined : data.farmId,
        data.date ?? null,
        data.notes === undefined ? undefined : data.notes,
      ],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction: toTxn(rows[0]) });
  }),
);

financeRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    await query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.userId,
    ]);
    res.json({ deleted: true });
  }),
);
