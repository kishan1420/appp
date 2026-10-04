import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { pingDb } from './db';
import { authRouter } from './routes/auth';
import { farmsRouter } from './routes/farms';
import { cropsRouter } from './routes/crops';
import { financeRouter } from './routes/finance';
import { remindersRouter } from './routes/reminders';
import { publicRouter } from './routes/public';

const app = express();

app.use(
  cors({
    origin: config.corsOrigins === '*' ? true : config.corsOrigins.split(',').map((s) => s.trim()),
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/v1/health', async (_req: Request, res: Response) => {
  const db = await pingDb();
  res.json({ ok: true, db, time: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/farms', farmsRouter);
app.use('/api/v1/crops', cropsRouter);
app.use('/api/v1/transactions', financeRouter);
app.use('/api/v1/reminders', remindersRouter);
app.use('/api/v1', publicRouter); // /mandi/prices, /schemes, /weather

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Kisaan API listening on :${config.port}`);
});
