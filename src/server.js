// server.js — entry point. Starts the Todo API on PORT (default 3000).
const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 3000;
const server = createApp();

server.listen(PORT, () => {
  console.log(`Todo API listening on http://localhost:${PORT}`);
});

// Graceful shutdown (useful in Docker / ECS, which send SIGTERM).
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => process.exit(0));
  });
}
