import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  password: z.string().min(4).max(128),
  village: z.string().max(120).optional(),
  district: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  language: z.enum(['en', 'hi']).optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

export const profileSchema = registerSchema
  .omit({ password: true })
  .partial()
  .extend({ lat: z.number().nullable().optional(), lon: z.number().nullable().optional() });

export const farmSchema = z.object({
  name: z.string().min(1).max(160),
  village: z.string().max(120).nullable().optional(),
  district: z.string().max(120).nullable().optional(),
  state: z.string().max(120).nullable().optional(),
  areaValue: z.number().positive(),
  areaUnit: z.enum(['acre', 'hectare', 'bigha']),
  irrigation: z.enum(['irrigated', 'rainfed', 'both']),
  soilType: z.string().max(60).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const cropSchema = z.object({
  farmId: z.string().uuid(),
  cropKey: z.string().min(1).max(60),
  customName: z.string().max(120).nullable().optional(),
  variety: z.string().max(120).nullable().optional(),
  season: z.enum(['kharif', 'rabi', 'zaid']),
  sowingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expectedHarvestDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  areaValue: z.number().positive().nullable().optional(),
  areaUnit: z.enum(['acre', 'hectare', 'bigha']).nullable().optional(),
  status: z.enum(['planned', 'sown', 'harvested']).default('planned'),
  notes: z.string().max(2000).nullable().optional(),
});

export const activitySchema = z.object({
  type: z.enum(['sowing', 'irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'other']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(2000).nullable().optional(),
  cost: z.number().min(0).nullable().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string().min(1).max(60),
  cropId: z.string().uuid().nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(2000).nullable().optional(),
});

export const reminderSchema = z.object({
  title: z.string().min(1).max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  category: z
    .enum(['irrigation', 'fertilizer', 'pesticide', 'sowing', 'harvest', 'payment', 'other'])
    .nullable()
    .optional(),
  cropId: z.string().uuid().nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  done: z.boolean().optional(),
});

export function validate<T>(schema: z.ZodSchema<T>, body: unknown): { data?: T; error?: string } {
  const result = schema.safeParse(body);
  if (result.success) return { data: result.data };
  const first = result.error.issues[0];
  return { error: `${first.path.join('.')}: ${first.message}` };
}
