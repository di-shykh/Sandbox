import http from 'http';

const server = http.createServer((req, res) => {

  let currentDate = new Date();
  let formatDate = currentDate.toISOString().slice(0, 10);
  console.log(`[${req.method}]${req.url} at ${formatDate}`) //логирование

  if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello!');
  } else
  if (req.url === '/bye' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    res.end('Goodbye!');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }


});

server.listen(3000);