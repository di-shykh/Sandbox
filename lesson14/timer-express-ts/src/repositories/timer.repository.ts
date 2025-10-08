import { pool } from '../db';
import type { QueryResult } from 'pg';

/** Как выглядит строка в таблице times. */
export type TimeRowDb = {
  id: number;
  saved_at: Date; // pg вернёт JS Date;
};

/** Пример: создание записи (остальные методы — аналогично, но реализуешь сам). */
export async function saveCurrentTime(): Promise<TimeRowDb> {
  try {
    const result: QueryResult<TimeRowDb> = await pool.query<TimeRowDb>(
      'INSERT INTO times (saved_at) VALUES (NOW()) RETURNING *'
    );
    if (!result.rows[0]) {
      throw new Error('No row returned after insert');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to save time: ${(error as Error).message}`);
  }
}

// TODO: реализуй и типизируй остальные:

export async function getAllTimes(params: {
  from?: string | undefined;
  to?: string | undefined;
}): Promise<TimeRowDb[]> {
  try {
    let result: QueryResult<TimeRowDb>;
    if (params.from && params.to) {
      result = await pool.query<TimeRowDb>(
        'SELECT * FROM times WHERE saved_at BETWEEN $1 AND $2 ORDER BY saved_at DESC',
        [params.from, params.to]
      );
    } else if (!params.from && params.to) {
      result = await pool.query<TimeRowDb>(
        'SELECT * FROM times WHERE saved_at <= $1 ORDER BY saved_at DESC',
        [params.to]
      );
    } else if (!params.to && params.from) {
      result = await pool.query<TimeRowDb>(
        'SELECT * FROM times WHERE saved_at >= $1 ORDER BY saved_at DESC',
        [params.from]
      );
    } else {
      result = await pool.query<TimeRowDb>(
        'SELECT * FROM times ORDER BY id DESC'
      );
    }
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get times: ${(error as Error).message}`);
  }
}

export async function deleteTimeById(id: number): Promise<void> {
  try {
    const result: QueryResult = await pool.query(
      'DELETE FROM times WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      throw new Error(`No entry with id ${id} found.`);
    }
  } catch (error) {
    throw new Error(`Failed to delete time: ${(error as Error).message}`);
  }
}

export async function updateTimeById(
  id: number,
  newTimestampIso: string
): Promise<TimeRowDb> {
  try {
    const result: QueryResult<TimeRowDb> = await pool.query<TimeRowDb>(
      'UPDATE times SET saved_at = $2 WHERE id = $1 RETURNING *',
      [id, newTimestampIso]
    );
    if (result.rows.length === 0 || !result.rows[0]) {
      throw new Error(`Time with id ${id} not found`);
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to update time: ${(error as Error).message}`);
  }
}
