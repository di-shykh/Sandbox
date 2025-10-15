/**Типы для задач(tasks) */
/** Строка из таблицы `tasks` в том виде, как её возвращает драйвер `pg` по умолчанию */
// CREATE TABLE tasks(
//         id SERIAL PRIMARY KEY NOT NULL,
//         project_id INTEGER NOT NULL,
//         title TEXT NOT NULL,
//         is_done BOOLEN NOT NULL DEFAULT false,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//         FOREIGN KEY (user_id) REFERENCES projects(id)
//       );
import { pool } from '../db';
import { ProjectRowDb } from './projects.repository';
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
/**Тип для отображения задач для проекта ???? Возможно не нужен*/
export type FilterTasksByProject = {
  id: number;
  title: string;
  is_done: boolean;
  created_at: Date;
};
export type ProjectWithTasks = {
  project: ProjectRowDb;
  tasks: TaskRowDb[];
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
     RETURNIG *`,
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
//         id SERIAL PRIMARY KEY NOT NULL,
//         project_id INTEGER NOT NULL,
//         title TEXT NOT NULL,
//         is_done BOOLEN NOT NULL DEFAULT false,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

// export async function createProject(
//   data: NewProjectInput
// ): Promise<ProjectRowDb | null> {
//   const { rows } = await pool.query<ProjectRowDb>(
//     `INSERT INTO projects (name, description, status)
//      VALUES ($1, COALESCE($2, ''), COALESCE($3, 'todo'))
//      RETURNING id, name, description, status, created_at`,
//     [data.name, data.description ?? null, data.status ?? null]
//   );
//   return rows[0] ?? null;
// }
