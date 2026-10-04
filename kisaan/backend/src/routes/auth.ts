import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '../db';
import { asyncHandler, auth, signToken, type AuthRequest } from '../middleware/auth';
import { loginSchema, profileSchema, registerSchema, validate } from '../validation';

export const authRouter = Router();

interface UserRow {
  id: string;
  name: string;
  phone: string;
  password_hash: string;
  village: string | null;
  district: string | null;
  state: string | null;
  language: string | null;
  lat: number | null;
  lon: number | null;
  created_at: string;
}

function toProfile(u: UserRow) {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    village: u.village,
    district: u.district,
    state: u.state,
    language: u.language || 'en',
    lat: u.lat,
    lon: u.lon,
    createdAt: u.created_at,
  };
}

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { data, error } = validate(registerSchema, req.body);
    if (!data) return res.status(400).json({ error });

    const existing = await queryOne('SELECT id FROM users WHERE phone = $1', [data.phone]);
    if (existing) return res.status(409).json({ error: 'Phone already registered' });

    const hash = await bcrypt.hash(data.password, 10);
    const rows = await query<UserRow>(
      `INSERT INTO users (name, phone, password_hash, village, district, state, language)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        data.name,
        data.phone,
        hash,
        data.village ?? null,
        data.district ?? null,
        data.state ?? null,
        data.language ?? 'en',
      ],
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user.id), profile: toProfile(user) });
  }),
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { data, error } = validate(loginSchema, req.body);
    if (!data) return res.status(400).json({ error });

    const user = await queryOne<UserRow>('SELECT * FROM users WHERE phone = $1', [data.phone]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: signToken(user.id), profile: toProfile(user) });
  }),
);

authRouter.get(
  '/me',
  auth,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [req.userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ profile: toProfile(user) });
  }),
);

authRouter.patch(
  '/profile',
  auth,
  asyncHandler(async (req: AuthRequest, res) => {
    const { data, error } = validate(profileSchema, req.body);
    if (!data) return res.status(400).json({ error });

    const fields: string[] = [];
    const params: unknown[] = [];
    const push = (col: string, val: unknown) => {
      params.push(val);
      fields.push(`${col} = $${params.length}`);
    };
    if (data.name !== undefined) push('name', data.name);
    if (data.phone !== undefined) push('phone', data.phone);
    if (data.village !== undefined) push('village', data.village);
    if (data.district !== undefined) push('district', data.district);
    if (data.state !== undefined) push('state', data.state);
    if (data.language !== undefined) push('language', data.language);
    if (data.lat !== undefined) push('lat', data.lat);
    if (data.lon !== undefined) push('lon', data.lon);

    if (fields.length === 0) return res.json({ profile: null });

    params.push(req.userId);
    const rows = await query<UserRow>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ profile: toProfile(rows[0]) });
  }),
);
