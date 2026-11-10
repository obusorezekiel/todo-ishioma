// app.js — request handling for the Todo API (no external dependencies).
const http = require('node:http');

function createApp() {
  const todos = new Map();
  let nextId = 1;

  function send(res, status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(body === undefined ? '' : JSON.stringify(body));
  }

  async function readJson(req) {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      throw Object.assign(new Error('Invalid JSON body'), { status: 400 });
    }
  }

  async function handle(req, res) {
    const { pathname } = new URL(req.url, 'http://localhost');
    const match = pathname.match(/^\/todos\/(\d+)$/);
    const id = match ? Number(match[1]) : null;

    try {
      if (pathname === '/health' && req.method === 'GET') {
        return send(res, 200, { status: 'ok' });
      }

      if (pathname === '/todos') {
        if (req.method === 'GET') return send(res, 200, [...todos.values()]);
        if (req.method === 'POST') {
          const { title } = await readJson(req);
          if (typeof title !== 'string' || !title.trim()) {
            return send(res, 400, { error: '"title" is required' });
          }
          const todo = { id: nextId++, title: title.trim(), done: false };
          todos.set(todo.id, todo);
          return send(res, 201, todo);
        }
      }

      if (id !== null) {
        const todo = todos.get(id);
        if (!todo) return send(res, 404, { error: 'Todo not found' });

        if (req.method === 'GET') return send(res, 200, todo);
        if (req.method === 'PATCH') {
          const { title, done } = await readJson(req);
          if (title !== undefined) todo.title = String(title).trim();
          if (done !== undefined) todo.done = Boolean(done);
          return send(res, 200, todo);
        }
        if (req.method === 'DELETE') {
          todos.delete(id);
          return send(res, 204);
        }
      }

      send(res, 404, { error: 'Not found' });
    } catch (err) {
      send(res, err.status || 500, { error: err.message || 'Internal error' });
    }
  }

  return http.createServer(handle);
}

module.exports = { createApp };
