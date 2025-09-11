import http from 'http';

const server = http.createServer((req, res) => {

  console.log(`[${req.method}]${req.url} at ${formatDate}`); //логирование

  if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello from my server!');
  } else
  if (req.url === '/time' && req.method === 'GET') {
    const time = new Date().toTimeString().slice(0, 5);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end(`Current time is: ${time}`);
  } else
  if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('My name is Diana, I study Back-end.');
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }

});

server.listen(4000);