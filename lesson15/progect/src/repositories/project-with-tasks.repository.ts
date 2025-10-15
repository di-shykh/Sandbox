import { title } from 'process';
import { pool } from '../db';
import { ProjectRowDb } from './projects.repository';
import { TaskRowDb } from './tasks.repository';

export type ProjectWithTasks = {
  project: ProjectRowDb;
  tasks: TaskRowDb[];
};
//тип для результата запроса
type JoinResult = {
  //Project
  id: number;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  created_at: Date;

  //Task
  t_id: number;
  t_project_id: number;
  t_title: string;
  t_is_done: boolean;
  t_created_at: Date;
};

export async function getProjectWithTasksJoin(
  projectId: number
): Promise<ProjectWithTasks | null> {
  const { rows } = await pool.query<JoinResult>(
    `     SELECT
           p.*,
           t.id          AS t_id,
           t.project_id  AS t_project_id,
           t.title       AS t_title,
           t.is_done     AS t_is_done,
           t.created_at  AS t_created_at
         FROM projects p
         LEFT JOIN tasks t ON t.project_id = p.id
         WHERE p.id = $1
         ORDER BY t.id DESC`,
    [projectId]
  );
  if (rows.length === 0 || rows[0] === undefined) return null;
  const project: ProjectRowDb = {
    id: rows[0].id,
    name: rows[0].name,
    description: rows[0].description,
    status: rows[0].status,
    created_at: rows[0].created_at,
  };
  const tasks: TaskRowDb[] = [];
  for (let row of rows) {
    if (row.t_id !== null) {
      tasks.push({
        id: row.t_id,
        project_id: row.t_project_id,
        title: row.t_title,
        is_done: row.t_is_done,
        created_at: row.t_created_at,
      });
    }
  }
  return { project, tasks };
}
