// Crop growth stage logic — maps days since sowing to a stage + percent.

import type { Crop } from '@/types/models';
import { cropByKey } from '@/data/crops';
import { daysBetween, todayISO } from './helpers';

export type StageKey =
  | 'sowing'
  | 'germination'
  | 'vegetative'
  | 'flowering'
  | 'maturity'
  | 'done';

export interface CropProgress {
  percent: number; // 0..100
  stage: StageKey;
  daysLeft: number; // negative = overdue
  durationDays: number;
}

export function getCropProgress(crop: Crop, today = todayISO()): CropProgress {
  if (crop.status === 'harvested') {
    return { percent: 100, stage: 'done', daysLeft: 0, durationDays: 0 };
  }

  const info = cropByKey(crop.cropKey);
  const durationDays = crop.expectedHarvestDate
    ? Math.max(1, daysBetween(crop.sowingDate, crop.expectedHarvestDate))
    : info?.durationDays ?? 120;

  const elapsed = daysBetween(crop.sowingDate, today);
  const percent = Math.max(0, Math.min(100, Math.round((elapsed / durationDays) * 100)));
  const daysLeft = durationDays - elapsed;

  let stage: StageKey;
  if (crop.status === 'planned' || elapsed <= 0) stage = 'sowing';
  else if (percent < 12) stage = 'germination';
  else if (percent < 45) stage = 'vegetative';
  else if (percent < 70) stage = 'flowering';
  else if (percent < 100) stage = 'maturity';
  else stage = 'done';

  return { percent, stage, daysLeft, durationDays };
}

export const STAGE_ORDER: StageKey[] = [
  'sowing',
  'germination',
  'vegetative',
  'flowering',
  'maturity',
  'done',
];
