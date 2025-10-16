// src/init-db.ts
// Создадим простую таблицу projects:
import { pool } from './db';

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'todo',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT projects_status_check CHECK (status IN ('todo','in_progress','done'))
    );
  `);
  console.log('✅ Таблица projects готова');
  // await pool.end();
}
//Создаем таблицу с задачами для проектов
async function createTableTasks() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks(
          id SERIAL PRIMARY KEY NOT NULL,
          project_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          is_done BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          FOREIGN KEY (project_id) REFERENCES projects(id)
        );
    `);
  console.log('✅ Таблица tasks готова');
}

async function main() {
  await init();
  await createTableTasks();
  await pool.end();
  console.log('✅ Все таблицы созданы');
}

main();
