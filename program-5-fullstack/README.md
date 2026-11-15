# Program 5 – Full Stack E-Learning Portal

React (Vite) + Express + MongoDB (Mongoose). JWT login, bcryptjs password hashing.

```
program-5-fullstack/
  server/   Express API  (models, routes, middleware)
  client/   React app    (pages, components, AuthContext, api.js)
```

## Prerequisites
Node.js 18+ and MongoDB running locally (default `mongodb://127.0.0.1:27017`). MongoDB Compass can be used to view the `elearning` database.

## Run locally (two terminals)

**1. Backend**
```
cd PROJECT-1-ELEARNING/program-5-fullstack/server
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (Mac/Linux)
# edit .env: set JWT_SECRET to your own random string
npm run seed                  # optional: adds 4 sample courses
npm start                     # http://localhost:5000
```

**2. Frontend**
```
cd PROJECT-1-ELEARNING/program-5-fullstack/client
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (Mac/Linux)
npm run dev                   # http://localhost:5173
```

Check the API: http://localhost:5000/api/health

## Environment variables
| File | Variable | Meaning |
|---|---|---|
| server/.env | PORT | API port (5000) |
| | MONGO_URI | MongoDB connection string |
| | JWT_SECRET | Secret used to sign tokens (keep private) |
| | CLIENT_URL | Allowed frontend origin for CORS (comma-separate several) |
| client/.env | VITE_API_URL | API base URL, e.g. `http://localhost:5000/api` |

`.env` files are git-ignored. Only the `.env.example` files (placeholders) are committed.

## API
| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | /api/health | no | status + DB state |
| POST | /api/auth/register | no | `name`, `email`, `password` (min 6) |
| POST | /api/auth/login | no | returns `token` and `user` |
| GET | /api/auth/me | yes | current user |
| GET | /api/courses, /api/courses/:id | no | |
| POST | /api/courses | yes | `name`, `description`, `category`, `price` |
| PUT, DELETE | /api/courses/:id | yes | only the user who created the course |
| POST | /api/enrollments | yes | `{ "courseId": "..." }`; 409 if already enrolled |
| GET | /api/enrollments | yes | the logged-in user's enrollments (with course details) |

Protected routes need `Authorization: Bearer <token>`.

## Models (Mongoose)
- **User**: name, email (unique), password (hash)
- **Course**: name, description, category, price, `createdBy` → User
- **Enrollment**: `user` → User, `course` → Course, unique index on (user, course) so nobody can enroll twice

## How login works
Login returns a JWT. The React app stores it in `localStorage` (via `AuthContext`) and sends it in the `Authorization` header (`api.js`). The server's `middleware/auth.js` verifies it. Tokens expire after 1 hour.

## Deployment preparation (nothing is deployed)

**Backend → Render** (Web Service, root directory `server`)
- Build command: `npm install`   |   Start command: `npm start`
- Use a hosted MongoDB such as MongoDB Atlas and set `MONGO_URI` to its connection string.
- Environment variables: `MONGO_URI`, `JWT_SECRET` (long random value), `CLIENT_URL` = your Vercel URL (e.g. `https://your-app.vercel.app`, no trailing slash). Render sets `PORT` itself.

**Frontend → Vercel** (root directory `client`, framework Vite)
- Build command: `npm run build`   |   Output directory: `dist`
- Environment variable: `VITE_API_URL` = `https://your-api.onrender.com/api`
- `client/vercel.json` rewrites all routes to `index.html` so refreshing `/login` etc. works.

Deploy the backend first, then set `VITE_API_URL` on Vercel, then put the Vercel URL into `CLIENT_URL` on Render.

## Known limitations
- Any logged-in user can add courses (there are no admin roles). Edit/delete is limited to the course's creator.
- The API has `PUT /api/courses/:id`, but the UI has no edit form (not required).
- Search and category filter run in the browser on the loaded course list.
- Token in `localStorage` is simple but not the most secure option.
