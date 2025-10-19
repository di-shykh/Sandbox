import http from 'http';
import fs from 'fs';
import {
  parse
} from 'url';
const server = http.createServer((req, res) => {
  const {
    pathname
  } = parse(req.url || '', true);
  // Роут: отдать страницу
  if (req.method === 'GET' && pathname === '/') {
    const html = fs.readFileSync('index.html', 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    res.end(html);
    return;
  }
  // Роут: вернуть JSON-приветствие
  if (req.method === 'GET' && pathname === '/api/hello') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: 'Hello from server!'
    }));
    return;
  }
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.end('Not found');
});
server.listen(3015, () => {
  console.log('Сервер запущен на http://localhost:3015');
});