// Run with: npm test  (uses the built-in node:test runner)
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body && JSON.stringify(body),
});

test('GET /health returns ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('full todo lifecycle', async () => {
  let res = await fetch(`${base}/todos`, json('POST', { title: 'Learn ECS' }));
  assert.equal(res.status, 201);
  const todo = await res.json();
  assert.equal(todo.title, 'Learn ECS');
  assert.equal(todo.done, false);

  res = await fetch(`${base}/todos/${todo.id}`, json('PATCH', { done: true }));
  assert.equal((await res.json()).done, true);

  res = await fetch(`${base}/todos`);
  assert.equal((await res.json()).length, 1);

  res = await fetch(`${base}/todos/${todo.id}`, { method: 'DELETE' });
  assert.equal(res.status, 204);

  res = await fetch(`${base}/todos/${todo.id}`);
  assert.equal(res.status, 404);
});

test('POST /todos rejects missing title', async () => {
  const res = await fetch(`${base}/todos`, json('POST', {}));
  assert.equal(res.status, 400);
});

test('POST /todos rejects invalid JSON', async () => {
  const res = await fetch(`${base}/todos`, { method: 'POST', body: '{bad' });
  assert.equal(res.status, 400);
});
