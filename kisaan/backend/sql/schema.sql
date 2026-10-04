-- Kisaan backend schema (PostgreSQL 14+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- gen_random_uuid()

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  village       TEXT,
  district      TEXT,
  state         TEXT,
  language      TEXT NOT NULL DEFAULT 'en',
  lat           DOUBLE PRECISION,
  lon           DOUBLE PRECISION,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS farms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  village    TEXT,
  district   TEXT,
  state      TEXT,
  area_value NUMERIC(10,3) NOT NULL CHECK (area_value > 0),
  area_unit  TEXT NOT NULL CHECK (area_unit IN ('acre','hectare','bigha')),
  irrigation TEXT NOT NULL CHECK (irrigation IN ('irrigated','rainfed','both')),
  soil_type  TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_farms_user ON farms(user_id);

CREATE TABLE IF NOT EXISTS crops (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_id               UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  crop_key              TEXT NOT NULL,
  custom_name           TEXT,
  variety               TEXT,
  season                TEXT NOT NULL CHECK (season IN ('kharif','rabi','zaid')),
  sowing_date           DATE NOT NULL,
  expected_harvest_date DATE,
  area_value            NUMERIC(10,3) CHECK (area_value IS NULL OR area_value > 0),
  area_unit             TEXT CHECK (area_unit IS NULL OR area_unit IN ('acre','hectare','bigha')),
  status                TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','sown','harvested')),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crops_user ON crops(user_id);
CREATE INDEX IF NOT EXISTS idx_crops_farm ON crops(farm_id);

CREATE TABLE IF NOT EXISTS activities (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  type    TEXT NOT NULL CHECK (type IN ('sowing','irrigation','fertilizer','pesticide','weeding','harvest','other')),
  date    DATE NOT NULL,
  notes   TEXT,
  cost    NUMERIC(12,2) CHECK (cost IS NULL OR cost >= 0)
);
CREATE INDEX IF NOT EXISTS idx_activities_crop ON activities(crop_id);

CREATE TABLE IF NOT EXISTS transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('income','expense')),
  amount     NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category   TEXT NOT NULL,
  crop_id    UUID REFERENCES crops(id) ON DELETE SET NULL,
  farm_id    UUID REFERENCES farms(id) ON DELETE SET NULL,
  date       DATE NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_txn_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_txn_crop ON transactions(crop_id);

CREATE TABLE IF NOT EXISTS reminders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  time       TEXT CHECK (time IS NULL OR time ~ '^\d{2}:\d{2}$'),
  category   TEXT CHECK (category IS NULL OR category IN ('irrigation','fertilizer','pesticide','sowing','harvest','payment','other')),
  crop_id    UUID REFERENCES crops(id) ON DELETE SET NULL,
  farm_id    UUID REFERENCES farms(id) ON DELETE SET NULL,
  done       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id, date);

-- Public reference data ------------------------------------------------------

CREATE TABLE IF NOT EXISTS mandi_prices (
  id          SERIAL PRIMARY KEY,
  crop_key    TEXT NOT NULL,
  variety     TEXT,
  market      TEXT NOT NULL,
  district    TEXT NOT NULL,
  state       TEXT NOT NULL,
  min_price   INTEGER NOT NULL,
  modal_price INTEGER NOT NULL,
  max_price   INTEGER NOT NULL,
  unit        TEXT NOT NULL DEFAULT '₹/quintal',
  price_date  DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mandi_state ON mandi_prices(state, crop_key);

CREATE TABLE IF NOT EXISTS schemes (
  id               TEXT PRIMARY KEY,
  name_en          TEXT NOT NULL,
  name_hi          TEXT NOT NULL,
  ministry_en      TEXT NOT NULL,
  ministry_hi      TEXT NOT NULL,
  category         TEXT NOT NULL,
  summary_en       TEXT NOT NULL,
  summary_hi       TEXT NOT NULL,
  benefits_en      TEXT NOT NULL,
  benefits_hi      TEXT NOT NULL,
  eligibility_en   TEXT NOT NULL,
  eligibility_hi   TEXT NOT NULL,
  how_to_apply_en  TEXT NOT NULL,
  how_to_apply_hi  TEXT NOT NULL,
  documents_en     TEXT NOT NULL,
  documents_hi     TEXT NOT NULL,
  url              TEXT NOT NULL,
  verified_on      DATE NOT NULL
);
