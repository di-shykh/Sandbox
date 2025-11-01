import { pool } from '../db';
/**Типы для задач(tasks) */
/** Строка из таблицы `tasks` в том виде, как её возвращает драйвер `pg` по умолчанию */
export type TaskRowDb = {
  id: number;
  project_id: number;
  //допиши сам
  title: string;
  is_done: boolean;
  created_at: Date;
};

export type NewTaskInput = {
  /*допиши сам*/
  project_id: number;
  title: string;
  is_done?: boolean;
};

export type UpdateTaskInput = {
  /*допиши сам*/
  title: string;
  is_done: boolean;
};

/**Получение задач по проекту */
export async function listTasksFromProject(
  project_id: number
): Promise<TaskRowDb[]> {
  try {
    const { rows } = await pool.query<TaskRowDb>(
      `SELECT * FROM tasks
        WHERE project_id = $1
        ORDER BY created_at`,
      [project_id]
    );
    return rows;
  } catch (error) {
    throw new Error(`Failed to get tasks: ${(error as Error).message}`);
  }
}
/** Создать задачу*/
export async function createTask(
  task: NewTaskInput
): Promise<TaskRowDb | null> {
  const { rows } = await pool.query<TaskRowDb>(
    `INSERT INTO tasks (project_id, title, is_done)
     VALUES ($1, $2, COALESCE($3, false))
     RETURNING *`,
    [task.project_id, task.title, task.is_done ?? null]
  );
  return rows[0] ?? null;
}
/** Полная замена задачи */
export async function updateTask(
  id: number,
  task: UpdateTaskInput
): Promise<TaskRowDb | null> {
  const { rows } = await pool.query<TaskRowDb>(
    `UPDATE tasks
      SET title = $2,
          is_done = $3,
          created_at = NOW()
      WHERE id = $1
      RETURNING *`,
    [id, task.title, task.is_done]
  );
  return rows[0] ?? null;
}
/** Удалить задачу*/
export async function deleteTask(id: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM tasks WHERE id=$1`, [id]);
  return result.rowCount === 1;
}
