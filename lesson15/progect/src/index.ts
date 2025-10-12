// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  ProjectFilter,
  NewProjectInput,
  UpdateProjectInput,
} from './repositories/projects.repository';
import {
  listTasksFromProject,
  createTask,
  TaskRowDb,
  NewTaskInput,
  UpdateTaskInput,
  FilterTasksByProject,
  updateTask,
} from './repositories/tasks.repository';
import {} from './repositories/tasks.repository';
import { error } from 'console';

const app = express();
const port = Number(process.env.PORT) || 3000;

const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

app.use(express.json());
app.use(cors());

// Пинг
app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP.OK).json({ message: 'Projects API is up' });
});

// GET /projects?name=...&status=...
app.get('/projects', async (req: Request, res: Response) => {
  try {
    const { name, status } = req.query as ProjectFilter;
    // if (!name) {
    //   res.status(HTTP.BAD_REQUEST).json({ error: 'name is required!' });
    //   return;
    // }
    const filter: ProjectFilter = {};
    if (name !== undefined) filter.name = name;
    if (status !== undefined) filter.status = status;
    const rows = await listProjects(filter);
    res.status(HTTP.OK).json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(HTTP.SERVER_ERROR).json({ error: 'Internal server error' });
  }
});

// GET /projects/:id
app.get('/projects/:id', async (req: Request, res: Response) => {
  // req.params.id — это СТРОКА. Сначала явно приводим к числу:
  const idNum = Number(req.params.id);

  // Number.isFinite проверяет «настоящее» конечное число (не NaN/Infinity).
  // ВАЖНО: глобальный isFinite("123") → true (неявно приводит к числу),
  // а Number.isFinite("123") → false (строго, без приведения).
  // Поэтому делаем два шага: Number(...) → Number.isFinite(idNum)
  // Также это гораздо надежнее чем проверка с помощью IsNaN
  if (!Number.isFinite(idNum) || idNum <= 0) {
    res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid project ID' });
    return;
  }

  const row = await getProjectById(idNum);
  if (!row) {
    res.sendStatus(HTTP.NOT_FOUND);
    return;
  }
  res.status(HTTP.OK).json(row);
});

// POST /projects   { name, description?, status? }
app.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body as NewProjectInput;

    if (!name) {
      res.status(HTTP.BAD_REQUEST).json({ error: 'Name is required' });
      return;
    }
    const newProject: NewProjectInput = {
      name: name,
    };
    if (description !== undefined) newProject.description = description;
    if (
      status !== undefined &&
      (status === 'todo' || status === 'done' || status === 'in_progress')
    )
      newProject.status = status;
    const created = await createProject(newProject);

    if (!created) {
      res.status(HTTP.SERVER_ERROR).json({ error: 'Failed to create project' });
      return;
    }
    res.status(HTTP.CREATED).json(created);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(HTTP.SERVER_ERROR).json({ error: 'Internal server error' });
  }
});

// PUT /projects/:id   { name, description?, status? }
app.put('/projects/:id', async (req: Request, res: Response) => {
  const idNum = Number(req.params.id);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid project ID' });
    return;
  }

  const { name, description, status } = req.body as UpdateProjectInput;

  if (!name || !description || !status) {
    res
      .status(HTTP.BAD_REQUEST)
      .json({ error: 'name, description, status are required' });
    return;
  }

  const updated = await updateProject(idNum, {
    name: name.trim(),
    description,
    status,
  });
  if (!updated) {
    res.sendStatus(HTTP.NOT_FOUND);
    return;
  }
  res.status(HTTP.OK).json(updated); // (можно 204 No Content)
});

// DELETE /projects/:id
app.delete('/projects/:id', async (req: Request, res: Response) => {
  const idNum = Number(req.params.id);
  // Ещё раз: Number(...) → Number.isFinite(...) → проверка > 0
  if (!Number.isFinite(idNum) || idNum <= 0) {
    res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid project ID' });
    return;
  }

  const ok = await deleteProject(idNum);
  if (!ok) {
    res.sendStatus(HTTP.NOT_FOUND);
    return;
  }
  res.sendStatus(HTTP.NO_CONTENT);
});
/**_________________________________________________________________ */
/** Tasks */
//GET /projects/:projectId/tasks  — получить список задач проекта
app.get('projects/:projectId/tasks', async (req: Request, res: Response) => {
  try {
    const project_id = Number(req.params.projectId);
    if (!Number.isFinite(project_id) || project_id <= 0) {
      res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid projectId' });
      return;
    }
    const rows = await listTasksFromProject(project_id);
    if (rows.length === 0) {
      res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'No tasks for this projectId' });
      return;
    }
    res.status(HTTP.OK).json(rows);
  } catch (error) {
    res.status(HTTP.SERVER_ERROR).json({ error: 'Server error' });
  }
});

// POST /projects/:projectId/tasks — создать задачу. Body: { "title": ... }
app.post('projects/:projectId/tasks', async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.projectId);
    if (!Number.isFinite(projectId) || projectId <= 0) {
      res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid projectId' });
      return;
    }
    if (!req.body.title) {
      res.status(HTTP.BAD_REQUEST).json({ error: 'Title is requered!' });
      return;
    }
    const task: NewTaskInput = {
      project_id: projectId,
      title: req.body.title,
      is_done: req.body.is_done ?? false,
    };
    const created = await createTask(task);

    if (!created) {
      res.status(HTTP.SERVER_ERROR).json({ error: 'Failed to create task' });
      return;
    }
    res.status(HTTP.CREATED).json(created);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(HTTP.SERVER_ERROR).json({ error: 'Internal server error' });
  }
});

//PUT /tasks/:id — полная замена задачи. Body: { "title": ..., "is_done": ... }
app.put('PUT /tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid task ID' });
    return;
  }
  const { title, is_done } = req.body as UpdateTaskInput;
  if (!title || !is_done) {
    res
      .status(HTTP.BAD_REQUEST)
      .json({ error: 'title, is_done are requered!' });
    return;
  }
  const updated = await updateTask(id, {
    title,
    is_done,
  });
  if (!updated) {
    res.sendStatus(HTTP.NOT_FOUND);
    return;
  }
  res.status(HTTP.OK).json(updated);
});

//DELETE /tasks/:id — удалить задачу
app.delete('tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid task ID' });
    return;
  }
  const ok = await deleteProject(id);
  if (!ok) {
    res.sendStatus(HTTP.NOT_FOUND);
    return;
  }
  res.sendStatus(HTTP.NO_CONTENT);
});

/** Эндпоинт GET /projects/:id/with-tasks*/
app.get('projects/:id/with-tasks', async (req: Request, res: Response) => {});

app.listen(port, () => console.log(`✅ http://localhost:${port}`));

/**Вспомогательные функции */
// function idValidation(id: number): void {
//   if (!Number.isFinite(id) || id <= 0) {
//       res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid id' });
//       return;
//     }
// }
