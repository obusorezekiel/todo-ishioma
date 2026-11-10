# Todo API

A small Todo REST API built with **only Node.js built-ins** (no npm dependencies).
Data is kept in memory, so it resets on restart.

## Run

```powershell
npm start            # http://localhost:3000
npm run dev          # restarts on file changes
npm test             # runs tests with node:test
```

## Endpoints

| Method | Route         | Body                               | Description        |
|--------|---------------|------------------------------------|--------------------|
| GET    | `/health`     | —                                  | Health check       |
| GET    | `/todos`      | —                                  | List todos         |
| POST   | `/todos`      | `{ "title": "Buy milk" }`          | Create a todo      |
| GET    | `/todos/:id`  | —                                  | Get one todo       |
| PATCH  | `/todos/:id`  | `{ "title"?: "...", "done"?: true }` | Update a todo    |
| DELETE | `/todos/:id`  | —                                  | Delete a todo      |

## Try it (PowerShell)

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/todos -ContentType 'application/json' -Body '{"title":"Learn ECS"}'
Invoke-RestMethod http://localhost:3000/todos
```

## Docker

```powershell
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```

## Structure

```
todo-api/
├── src/
│   ├── app.js       # routes and request handling
│   └── server.js    # entry point, starts the server
├── test/
│   └── app.test.js  # tests (node:test)
├── Dockerfile
└── package.json
```
