import { Router } from 'express';
import { query, queryOne } from '../db';
import { asyncHandler, auth, type AuthRequest } from '../middleware/auth';
import { farmSchema, validate } from '../validation';

export const farmsRouter = Router();
farmsRouter.use(auth);

interface FarmRow {
  id: string;
  name: string;
  village: string | null;
  district: string | null;
  state: string | null;
  area_value: string;
  area_unit: string;
  irrigation: string;
  soil_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function toFarm(r: FarmRow) {
  return {
    id: r.id,
    name: r.name,
    village: r.village,
    district: r.district,
    state: r.state,
    areaValue: Number(r.area_value),
    areaUnit: r.area_unit,
    irrigation: r.irrigation,
    soilType: r.soil_type,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

farmsRouter.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const rows = await query<FarmRow>(
      'SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId],
    );
    res.json({ farms: rows.map(toFarm) });
  }),
);

farmsRouter.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(farmSchema, req.body);
    if (!data) return res.status(400).json({ error });
    const rows = await query<FarmRow>(
      `INSERT INTO farms (user_id, name, village, district, state, area_value, area_unit, irrigation, soil_type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        req.userId,
        data.name,
        data.village ?? null,
        data.district ?? null,
        data.state ?? null,
        data.areaValue,
        data.areaUnit,
        data.irrigation,
        data.soilType ?? null,
        data.notes ?? null,
      ],
    );
    res.status(201).json({ farm: toFarm(rows[0]) });
  }),
);

farmsRouter.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const row = await queryOne<FarmRow>(
      'SELECT * FROM farms WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId],
    );
    if (!row) return res.status(404).json({ error: 'Farm not found' });
    res.json({ farm: toFarm(row) });
  }),
);

farmsRouter.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(farmSchema.partial(), req.body);
    if (!data) return res.status(400).json({ error });
    const row = await queryOne<FarmRow>(
      'SELECT * FROM farms WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId],
    );
    if (!row) return res.status(404).json({ error: 'Farm not found' });

    const merged = { ...toFarm(row), ...data };
    const rows = await query<FarmRow>(
      `UPDATE farms SET name=$3, village=$4, district=$5, state=$6, area_value=$7,
        area_unit=$8, irrigation=$9, soil_type=$10, notes=$11, updated_at=now()
       WHERE id=$1 AND user_id=$2 RETURNING *`,
      [
        row.id,
        req.userId,
        merged.name,
        merged.village ?? null,
        merged.district ?? null,
        merged.state ?? null,
        merged.areaValue,
        merged.areaUnit,
        merged.irrigation,
        merged.soilType ?? null,
        merged.notes ?? null,
      ],
    );
    res.json({ farm: toFarm(rows[0]) });
  }),
);

farmsRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const result = await query(
      'DELETE FROM farms WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId],
    );
    res.json({ deleted: true, count: result.length });
  }),
);
