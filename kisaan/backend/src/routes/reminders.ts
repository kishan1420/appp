import { Router } from 'express';
import { query } from '../db';
import { asyncHandler, auth, type AuthRequest } from '../middleware/auth';
import { reminderSchema, validate } from '../validation';

export const remindersRouter = Router();
remindersRouter.use(auth);

interface ReminderRow {
  id: string;
  title: string;
  date: string;
  time: string | null;
  category: string | null;
  crop_id: string | null;
  farm_id: string | null;
  done: boolean;
  created_at: string;
}

const toReminder = (r: ReminderRow) => ({
  id: r.id,
  title: r.title,
  date: r.date,
  time: r.time,
  category: r.category,
  cropId: r.crop_id,
  farmId: r.farm_id,
  done: r.done,
  createdAt: r.created_at,
});

remindersRouter.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const rows = await query<ReminderRow>(
      'SELECT * FROM reminders WHERE user_id = $1 ORDER BY date ASC',
      [req.userId],
    );
    res.json({ reminders: rows.map(toReminder) });
  }),
);

remindersRouter.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(reminderSchema, req.body);
    if (!data) return res.status(400).json({ error });
    const rows = await query<ReminderRow>(
      `INSERT INTO reminders (user_id, title, date, time, category, crop_id, farm_id, done)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.userId,
        data.title,
        data.date,
        data.time ?? null,
        data.category ?? null,
        data.cropId ?? null,
        data.farmId ?? null,
        data.done ?? false,
      ],
    );
    res.status(201).json({ reminder: toReminder(rows[0]) });
  }),
);

remindersRouter.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(reminderSchema.partial(), req.body);
    if (!data) return res.status(400).json({ error });
    const rows = await query<ReminderRow>(
      `UPDATE reminders SET
         title = COALESCE($3, title), date = COALESCE($4, date), time = $5,
         category = $6, crop_id = $7, farm_id = $8, done = COALESCE($9, done)
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [
        req.params.id,
        req.userId,
        data.title ?? null,
        data.date ?? null,
        data.time === undefined ? undefined : data.time,
        data.category === undefined ? undefined : data.category,
        data.cropId === undefined ? undefined : data.cropId,
        data.farmId === undefined ? undefined : data.farmId,
        data.done ?? null,
      ],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ reminder: toReminder(rows[0]) });
  }),
);

remindersRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    await query('DELETE FROM reminders WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.userId,
    ]);
    res.json({ deleted: true });
  }),
);
