// src/db.ts
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/projectsdb'; //порт скорее всего будет 5432 -> исправь если так

export const pool = new Pool({ connectionString });
