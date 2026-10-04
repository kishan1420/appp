import { Router } from 'express';
import { query } from '../db';
import { asyncHandler } from '../middleware/auth';

/** Public read-only endpoints: mandi prices, schemes, weather proxy. */
export const publicRouter = Router();

publicRouter.get(
  '/mandi/prices',
  asyncHandler(async (req, res) => {
    const { state, crop } = req.query as Record<string, string | undefined>;
    const params: unknown[] = [];
    const where: string[] = [];
    if (state) {
      params.push(state);
      where.push(`state = $${params.length}`);
    }
    if (crop) {
      params.push(crop.toLowerCase());
      where.push(`lower(crop_key) = $${params.length}`);
    }
    const rows = await query(
      `SELECT crop_key AS "cropKey", variety, market, district, state,
              min_price AS "minPrice", modal_price AS "modalPrice",
              max_price AS "maxPrice", unit, price_date AS "date"
       FROM mandi_prices
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY crop_key, market`,
      params,
    );
    res.json({ asOf: rows[0]?.date ?? null, source: 'agmarknet-sample', prices: rows });
  }),
);

publicRouter.get(
  '/schemes',
  asyncHandler(async (_req, res) => {
    const rows = await query('SELECT * FROM schemes ORDER BY category, id');
    res.json({ schemes: rows });
  }),
);

publicRouter.get(
  '/schemes/:id',
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM schemes WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Scheme not found' });
    res.json({ scheme: rows[0] });
  }),
);

/**
 * Server-side weather proxy (Open-Meteo, no API key).
 * Lets the app avoid embedding third-party URLs and enables caching/rate limits later.
 */
publicRouter.get(
  '/weather',
  asyncHandler(async (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${lat}&longitude=${lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=auto&forecast_days=7';
    const upstream = await fetch(url);
    if (!upstream.ok) return res.status(502).json({ error: 'Weather provider error' });
    const json = await upstream.json();
    res.json(json);
  }),
);
