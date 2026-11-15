// E-Learning Portal API - native Node.js only (http, fs, path, events)
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

const PORT = 3000;
const COURSES_FILE = path.join(__dirname, 'data', 'courses.json');
const ENROLLMENTS_FILE = path.join(__dirname, 'data', 'enrollments.json');

// EventEmitter: fires an event whenever a new enrollment is saved
const events = new EventEmitter();
events.on('enrollment:created', (e) => {
  console.log(`[event] New enrollment #${e.id}: ${e.studentName} -> course ${e.courseId}`);
});

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2));

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

// Collect the request body and parse it as JSON
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('INVALID_JSON')); }
    });
    req.on('error', reject);
  });
}

async function createEnrollment(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return send(res, 400, { error: 'Request body must be valid JSON' }); }

  const { studentName, email, courseId } = body || {};
  if (typeof studentName !== 'string' || !studentName.trim())
    return send(res, 400, { error: 'studentName is required' });
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email))
    return send(res, 400, { error: 'A valid email is required' });
  if (!Number.isInteger(courseId))
    return send(res, 400, { error: 'courseId must be a number' });

  const courses = await readJson(COURSES_FILE);
  if (!courses.some((c) => c.id === courseId))
    return send(res, 404, { error: `Course ${courseId} not found` });

  const enrollments = await readJson(ENROLLMENTS_FILE);
  if (enrollments.some((e) => e.email === email && e.courseId === courseId))
    return send(res, 409, { error: 'Already enrolled in this course' });

  const enrollment = {
    id: enrollments.length ? Math.max(...enrollments.map((e) => e.id)) + 1 : 1,
    studentName: studentName.trim(),
    email,
    courseId,
    enrolledAt: new Date().toISOString(),
  };
  enrollments.push(enrollment);
  await writeJson(ENROLLMENTS_FILE, enrollments);
  events.emit('enrollment:created', enrollment);
  send(res, 201, enrollment);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url.split('?')[0];
    if (url === '/api/courses') {
      if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
      return send(res, 200, await readJson(COURSES_FILE));
    }
    if (url === '/api/enrollments') {
      if (req.method === 'GET') return send(res, 200, await readJson(ENROLLMENTS_FILE));
      if (req.method === 'POST') return await createEnrollment(req, res);
      return send(res, 405, { error: 'Method not allowed' });
    }
    send(res, 404, { error: 'Route not found' });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
