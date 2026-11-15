# Program 3 – Native Node.js (E-Learning Portal)

Simple REST API using only built-in Node.js modules: `http`, `fs`, `path`, `events`. No Express, no installs.

## Run
```
cd PROJECT-1-ELEARNING/program-3-node
node server.js
```
Server runs at http://localhost:3000

## Endpoints
| Method | URL | Description | Status codes |
|--------|-----|-------------|--------------|
| GET | /api/courses | All courses | 200 |
| GET | /api/enrollments | All enrollments | 200 |
| POST | /api/enrollments | Create enrollment | 201, 400, 404, 409 |

POST body:
```json
{ "studentName": "Asha", "email": "asha@example.com", "courseId": 1 }
```
Other: 404 unknown route, 405 wrong method, 500 server error.

## Try it
```
curl http://localhost:3000/api/courses
curl http://localhost:3000/api/enrollments
curl -X POST http://localhost:3000/api/enrollments -H "Content-Type: application/json" -d "{\"studentName\":\"Asha\",\"email\":\"asha@example.com\",\"courseId\":1}"
```

## Concepts shown
- `fs.promises` reads/writes JSON files in `data/`
- `path.join` builds file paths
- `EventEmitter` fires `enrollment:created` after each save (logged in console)
