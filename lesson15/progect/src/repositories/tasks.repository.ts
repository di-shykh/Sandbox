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
  created_at?: Date;
};

export type UpdateTaskInput = {
  /*допиши сам*/
  id: number;
  project_id: number;
  title: string;
  is_done: boolean;
  created_at: Date;
};
/**Тип для отображения задач для проекта ???? Возможно не нужен*/
export type FilterTasksByProject = {
  id: number;
  title: string;
  is_done: boolean;
  created_at: Date;
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

// export async function listProjects(
//   filter: ProjectFilter = {}
// ): Promise<ProjectRowDb[]> {
//   const { name, status } = filter;

//   if (!name && !status) {
//     const { rows } = await pool.query<ProjectRowDb>(
//       `SELECT * FROM projects ORDER BY id DESC`
//     );
//     return rows;
//   }
//   if (name && !status) {
//     const { rows } = await pool.query<ProjectRowDb>(
//       `SELECT * FROM projects
//        WHERE name ILIKE $1
//      ORDER BY id DESC`,
//       [`%${name}%`]
//     );
//     return rows;
//   }
//   if (status && !name) {
//     const { rows } = await pool.query<ProjectRowDb>(
//       `SELECT * FROM projects
//        WHERE status = $1
//      ORDER BY id DESC`,
//       [status]
//     );
//     return rows;
//   }

//   const { rows } = await pool.query<ProjectRowDb>(
//     `SELECT * FROM projects
//        WHERE status = $2 AND name ILIKE $1
//      ORDER BY id DESC`,
//     [`%${name}%`, status]
//   );
//   return rows;
// }
