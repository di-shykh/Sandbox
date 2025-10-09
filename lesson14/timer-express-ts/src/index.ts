import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import {
  getAllTimes,
  saveCurrentTime,
  deleteTimeById,
  updateTimeById,
} from './repositories/timer.repository';
import type { TimeRowDb } from './repositories/timer.repository';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// мидлвары
app.use(express.json()); // парсим JSON-тело
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Обслуживаем статические файлы из папки public

app.get('/', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /timer  (+ опционально ?from=&to=)
app.get('/timer', async (req: Request, res: Response): Promise<void> => {
  //опционально
  const { from, to } = req.query as {
    from?: string | undefined;
    to?: string | undefined;
  };

  const rows: TimeRowDb[] = await getAllTimes({ from, to });
  res.status(200).json(rows);
});

// POST /timer/save
app.post('/timer/save', async (_req: Request, res: Response): Promise<void> => {
  const row: TimeRowDb = await saveCurrentTime();
  res.status(201).json(row);
});

// TODO: DELETE /timer/:id  — реализуй сам
app.delete('/timer/:id', async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (isNaN(id) || id < 0) {
    res.status(400).json({ error: 'Invalid timer ID' });
    return;
  }
  try {
    await deleteTimeById(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// TODO: PUT /timer/:id?saved_at=<ISO>  — реализуй сам
app.put('/timer/:id', async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (isNaN(id) || id < 0) {
    res.status(400).json({ error: 'Invalid timer ID' });
    return;
  }
  const savedAt = req.query.saved_at as string;
  if (!savedAt) {
    res.status(400).json({ error: 'Missing saved_at query parameter' });
    return;
  }
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime()) || date.toISOString() !== savedAt) {
    res.status(400).json({ error: 'Invalid saved_at format' });
    return;
  }
  try {
    const newTime: TimeRowDb = await updateTimeById(id, savedAt);
    res.status(200).json(newTime);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.listen(port, (): void => console.log(`✅ http://localhost:${port}`));
