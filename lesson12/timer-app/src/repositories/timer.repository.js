import {
  pool
} from '../db.js';

export async function getAllTimes() {
  const result = await pool.query('SELECT * FROM times ORDER BY id DESC');
  return result.rows;
}

export async function saveCurrentTime() {
  const result = await pool.query('INSERT INTO times (saved_at) VALUES (NOW()) RETURNING *');
  return result.rows[0];
}

export async function deleteTimeById(id) {
  await pool.query('DELETE FROM times WHERE id = $1', [id]);
}

export async function updateTimeById(id, newTimestamp) {
  const result = await pool.query(
    'UPDATE times SET saved_at = $2 WHERE id = $1 RETURNING *',
    [id, newTimestamp]
  );
  return result.rows[0];
}

export async function getTimesFromTo(from, to) {
  if (from && to) {
    const result = await pool.query('SELECT * FROM times WHERE saved_at BETWEEN $1 AND $2', [from, to]);
  } else if (from) {
    const result = await pool.query('SELECT * FROM times WHERE saved_at >= $1', [from]);
  } else if (to) {
    const result = await pool.query('SELECT * FROM times WHERE saved_at <= $1', [to]);
  } else {
    const result = await getAllTimes();
  }
  //переписать с учетом того, что один из параметров может отсутствовать
  return result.rows;
}