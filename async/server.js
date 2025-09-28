import http from 'http';
import fs from 'fs/promises';

const port = Number(process.env.PORT) || 3000;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/home' && req.method === 'GET') {
      await delay(2000);
      const data = await readFilePromise('home.html');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.end(data);
    } else if (req.url === '/about' && req.method === 'GET') {
      await delay(2000);
      const data = await readFilePromise('about.html');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.end(data);
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
      res.end('Страница не найдена');
    }
  } catch (error) {

    console.error(error);
    if (!res.headersSent)
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
    res.end('Ошибка сервера');
  }
});

server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
})


async function readFilePromise(path) {
  try {
    const data = await fs.readFile(path, 'utf8');
    return data;
  } catch (error) {
    console.error('Ошибка сервера');
    throw error;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}