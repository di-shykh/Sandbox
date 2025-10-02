import {
  parse
} from 'url';
import {
  getAllTimes,
  saveCurrentTime,
  deleteTimeById,
  updateTimeById,
  getTimesFromTo,
  checkDateTime
} from './repositories/timer.repository.js';

export async function router(req, res) {
  // Получаем путь (с помощью утилиты parse) и метод из запроса
  const url = parse(req.url || '', true);
  const method = req.method;

  // Обработка запроса: GET /timer
  if (url.pathname === '/timer' && method === 'GET') {
    // const times = await getAllTimes();

    // // Говорим клиенту: "Всё ок, вот JSON"
    // res.writeHead(200, {
    //   'Content-Type': 'application/json'
    // });
    // res.end(JSON.stringify(times)); // Отправляем массив записей в формате JSON
    // return;
    let from, to;
    if (url.query.from) {
      if (checkDateTime(url.query.from)) {
        from = url.query.from;
      } else {
        res.writeHead(400, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          "error": "Invalid 'from' date format. Use ISO 8601 format (e.g., 2023-12-01T10:30:00.000Z)."
        }));
        return;
      }
    }
    if (url.query.to) {
      if (checkDateTime(url.query.to)) {
        to = url.query.to;
      } else {
        res.writeHead(400, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          "error": "Invalid 'to' date format. Use ISO 8601 format (e.g., 2023-12-01T10:30:00.000Z)."
        }));
        return;
      }

    }
    try {
      const times = await getTimesFromTo(from, to);
      res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify(times));

    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({
        "error": "Internal server error"
      }));
    }
    return;
  }

  if (url.pathname === '/timer/save' && method === 'POST') {
    const time = await saveCurrentTime();
    res.writeHead(201, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(time));
    return;
  }

  if (url.pathname && url.pathname.startsWith('/timer/') && method === 'DELETE') {
    const id = url.pathname.split('/')[2];
    await deleteTimeById(id);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: `Deleted time with ID ${id}`
    }));
    return;
  }

  if (url.pathname && url.pathname.startsWith('/timer/') && url.query.saved_at && method === 'PUT') {
    let id = url.pathname.split('/')[2];
    id = Number(id);
    if (Number.isNaN(id) || id <= 0) {
      res.writeHead(400, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({
        "error": "Invalid timer ID"
      }));
    }
    const savedAt = url.query.saved_at;
    const date = new Date(savedAt);
    if (Number.isNaN(date.getTime()) && date.toISOString() !== savedAt) {
      res.writeHead(400, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        "error": "Invalid saved_at format"
      }));
    }
    const newTime = await updateTimeById(id, savedAt);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(newTime));
    return;
  }
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.end('Not found');
}