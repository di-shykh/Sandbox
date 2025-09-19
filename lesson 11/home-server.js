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
  if (status.routes[rout] !== undefined)
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

function sendResponse(res, statusCode, contentType, data) {
  res.writeHead(statusCode, {
    'Content-Type': contentType
  });
  res.end(data);
}

function sendJSON(res, statusCode, data) {
  sendResponse(res, statusCode, 'application/json', data);
}

function sendText(res, statusCode, text) {
  sendResponse(res, statusCode, 'text/plain', text);
}

const server = http.createServer((req, res) => {

  let currentDate = new Date();
  let formatDate = currentDate.toISOString().slice(0, 10);
  console.log(`[${req.method}]${req.url} at ${formatDate}`); //логирование

  let arrFromURL = req.url.split('/');
  const idFromUrl = parseInt(arrFromURL[2]);

  if (arrFromURL.includes('users') && !isNaN(idFromUrl) && req.method === 'GET') {
    sendJSON(res, 200, getUser(idFromUrl));
  } else if (req.url === '/hello' && req.method === 'GET') {
    setStatus('/hello');
    sendText(res, 200, 'Hello from my server!');
  } else if (req.url === '/time' && req.method === 'GET') {
    const time = new Date().toTimeString().slice(0, 5);
    sendText(res, 200, `Current time is: ${time}`);
  } else if (req.url === '/about' && req.method === 'GET') {
    setStatus('/about');
    sendText(res, 200, 'My name is Diana, I study Back-end.');
  } else if (req.url === '/users' && req.method === 'GET') {
    setStatus('/users');
    sendJSON(res, 200, JSON.stringify(users));
  } else if (req.url === '/stats' && req.method === 'GET') {
    sendJSON(res, 200, JSON.stringify(status));
  } else {
    sendText(res, 404, 'Page not found');
  }

});

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});