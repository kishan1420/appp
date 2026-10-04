import { Router } from 'express';
import { query, queryOne } from '../db';
import { asyncHandler, auth, type AuthRequest } from '../middleware/auth';
import { activitySchema, cropSchema, validate } from '../validation';

export const cropsRouter = Router();
cropsRouter.use(auth);

interface CropRow {
  id: string;
  farm_id: string;
  crop_key: string;
  custom_name: string | null;
  variety: string | null;
  season: string;
  sowing_date: string;
  expected_harvest_date: string | null;
  area_value: string | null;
  area_unit: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ActivityRow {
  id: string;
  crop_id: string;
  type: string;
  date: string;
  notes: string | null;
  cost: string | null;
}

const toCrop = (r: CropRow) => ({
  id: r.id,
  farmId: r.farm_id,
  cropKey: r.crop_key,
  customName: r.custom_name,
  variety: r.variety,
  season: r.season,
  sowingDate: r.sowing_date,
  expectedHarvestDate: r.expected_harvest_date,
  areaValue: r.area_value != null ? Number(r.area_value) : null,
  areaUnit: r.area_unit,
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toActivity = (r: ActivityRow) => ({
  id: r.id,
  cropId: r.crop_id,
  type: r.type,
  date: r.date,
  notes: r.notes,
  cost: r.cost != null ? Number(r.cost) : null,
});

cropsRouter.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const farmId = req.query.farmId as string | undefined;
    const rows = farmId
      ? await query<CropRow>(
          'SELECT * FROM crops WHERE user_id = $1 AND farm_id = $2 ORDER BY sowing_date DESC',
          [req.userId, farmId],
        )
      : await query<CropRow>(
          'SELECT * FROM crops WHERE user_id = $1 ORDER BY sowing_date DESC',
          [req.userId],
        );
    res.json({ crops: rows.map(toCrop) });
  }),
);

cropsRouter.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(cropSchema, req.body);
    if (!data) return res.status(400).json({ error });
    const farm = await queryOne('SELECT id FROM farms WHERE id=$1 AND user_id=$2', [
      data.farmId,
      req.userId,
    ]);
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const rows = await query<CropRow>(
      `INSERT INTO crops (user_id, farm_id, crop_key, custom_name, variety, season,
        sowing_date, expected_harvest_date, area_value, area_unit, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        req.userId,
        data.farmId,
        data.cropKey,
        data.customName ?? null,
        data.variety ?? null,
        data.season,
        data.sowingDate,
        data.expectedHarvestDate ?? null,
        data.areaValue ?? null,
        data.areaUnit ?? null,
        data.status,
        data.notes ?? null,
      ],
    );
    res.status(201).json({ crop: toCrop(rows[0]) });
  }),
);

cropsRouter.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const row = await queryOne<CropRow>(
      'SELECT * FROM crops WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId],
    );
    if (!row) return res.status(404).json({ error: 'Crop not found' });
    res.json({ crop: toCrop(row) });
  }),
);

cropsRouter.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(cropSchema.partial(), req.body);
    if (!data) return res.status(400).json({ error });
    const row = await queryOne<CropRow>(
      'SELECT * FROM crops WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId],
    );
    if (!row) return res.status(404).json({ error: 'Crop not found' });

    const m = { ...toCrop(row), ...data };
    const rows = await query<CropRow>(
      `UPDATE crops SET farm_id=$3, crop_key=$4, custom_name=$5, variety=$6, season=$7,
        sowing_date=$8, expected_harvest_date=$9, area_value=$10, area_unit=$11,
        status=$12, notes=$13, updated_at=now()
       WHERE id=$1 AND user_id=$2 RETURNING *`,
      [
        row.id,
        req.userId,
        m.farmId,
        m.cropKey,
        m.customName ?? null,
        m.variety ?? null,
        m.season,
        m.sowingDate,
        m.expectedHarvestDate ?? null,
        m.areaValue ?? null,
        m.areaUnit ?? null,
        m.status,
        m.notes ?? null,
      ],
    );
    res.json({ crop: toCrop(rows[0]) });
  }),
);

cropsRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    await query('DELETE FROM crops WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ deleted: true });
  }),
);

// --- Activities -------------------------------------------------------------

cropsRouter.get(
  '/:id/activities',
  asyncHandler(async (req: AuthRequest, res) => {
    const rows = await query<ActivityRow>(
      'SELECT * FROM activities WHERE crop_id = $1 AND user_id = $2 ORDER BY date DESC',
      [req.params.id, req.userId],
    );
    res.json({ activities: rows.map(toActivity) });
  }),
);

cropsRouter.post(
  '/:id/activities',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(activitySchema, req.body);
    if (!data) return res.status(400).json({ error });
    const crop = await queryOne('SELECT id FROM crops WHERE id=$1 AND user_id=$2', [
      req.params.id,
      req.userId,
    ]);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    const rows = await query<ActivityRow>(
      `INSERT INTO activities (user_id, crop_id, type, date, notes, cost)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.userId, req.params.id, data.type, data.date, data.notes ?? null, data.cost ?? null],
    );
    res.status(201).json({ activity: toActivity(rows[0]) });
  }),
);

cropsRouter.delete(
  '/activities/:activityId',
  asyncHandler(async (req: AuthRequest, res) => {
    await query('DELETE FROM activities WHERE id = $1 AND user_id = $2', [
      req.params.activityId,
      req.userId,
    ]);
    res.json({ deleted: true });
  }),
);
