import { Pool } from 'pg';

const connectionString: string =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/timerdb';

export const pool: Pool = new Pool({
  connectionString,
});
