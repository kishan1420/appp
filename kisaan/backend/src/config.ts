import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL || 'postgres://kisaan:kisaan@localhost:5432/kisaan',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpires: process.env.JWT_EXPIRES || '30d',
  corsOrigins: process.env.CORS_ORIGINS || '*',
};
