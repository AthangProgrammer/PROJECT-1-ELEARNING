# Program 4 – Express REST API (E-Learning Portal)

Express API with course CRUD, JWT authentication (bcryptjs + jsonwebtoken), middleware and JSON-file storage (no database).

## Run
```
cd PROJECT-1-ELEARNING/program-4-express
npm install
copy .env.example .env      (Windows)   |   cp .env.example .env   (Mac/Linux)
# edit .env and set JWT_SECRET to your own random string
npm start
```
Server: http://localhost:4000. `.env` is git-ignored – never commit it.

## Endpoints
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | /api/courses | no | All courses |
| GET | /api/courses/:id | no | One course |
| POST | /api/courses | yes | Add course (`title`, `instructor`, `duration`) |
| PUT | /api/courses/:id | yes | Update course |
| DELETE | /api/courses/:id | yes | Delete course |
| POST | /api/auth/register | no | `name`, `email`, `password` (min 6 chars) |
| POST | /api/auth/login | no | Returns `{ "token": "..." }` |
| GET | /api/auth/me | yes | Current user |

Protected routes need the header `Authorization: Bearer <token>`.

Status codes: 200, 201, 400 (bad input), 401 (no/invalid token or login), 404 (not found), 409 (email taken), 500.

## Try it (curl)
```
curl -X POST localhost:4000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Asha\",\"email\":\"asha@example.com\",\"password\":\"secret123\"}"
curl -X POST localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"asha@example.com\",\"password\":\"secret123\"}"
curl localhost:4000/api/auth/me -H "Authorization: Bearer TOKEN"
curl -X POST localhost:4000/api/courses -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"React\",\"instructor\":\"X\",\"duration\":\"4 weeks\"}"
```

## Structure
- `server.js` – app setup  |  `routes/` – courses & auth  |  `middleware/` – logger, auth, error handler  |  `data/` – JSON files + `store.js` helper
