import http from 'http';

const PORT = 4000;
const status = {
  'totalRequests': 0,
  'routes': {
    '/hello': 0,
    '/users': 0,
    '/about': 0
  }
}

const users = [{
    id: 1,
    name: "Alice",
    age: 25
  },
  {
    id: 2,
    name: "Bob",
    age: 30
  },
  {
    id: 3,
    name: "Charlie",
    age: 22
  }
];

function setStatus(rout) {
  status.totalRequests++;
  status.routes[rout]++;
}

function getUser(id) {
  const user = users.find(user => user.id === id);
  if (user)
    return JSON.stringify(user);
  else return JSON.stringify({
    error: 'User not found'
  });
}

const server = http.createServer((req, res) => {

  let currentDate = new Date();
  let formatDate = currentDate.toISOString().slice(0, 10);
  console.log(`[${req.method}]${req.url} at ${formatDate}`); //логирование

  let arrFromURL = req.url.split('/');
  const idFromUrl = parseInt(arrFromURL[arrFromURL.length - 1]);

  if (arrFromURL.includes('users') && !isNaN(idFromUrl) && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(getUser(idFromUrl));
  } else if (req.url === '/hello' && req.method === 'GET') {
    setStatus('/hello');
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello from my server!');
  } else if (req.url === '/time' && req.method === 'GET') {
    const time = new Date().toTimeString().slice(0, 5);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end(`Current time is: ${time}`);
  } else if (req.url === '/about' && req.method === 'GET') {
    setStatus('/about');
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('My name is Diana, I study Back-end.');
  } else if (req.url === '/users' && req.method === 'GET') {
    setStatus('/users');
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(users));
  } else if (req.url === '/stats' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(status));
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }

});

server.listen(PORT);