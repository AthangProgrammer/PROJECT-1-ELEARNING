const express = require('express');
const { read, write } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware for course data
function validateCourse(req, res, next) {
  const { title, instructor, duration } = req.body || {};
  for (const [name, value] of Object.entries({ title, instructor, duration })) {
    if (typeof value !== 'string' || !value.trim())
      return res.status(400).json({ error: `${name} is required` });
  }
  next();
}

// Find course by :id or respond 404
function findCourse(req, res, next) {
  const courses = read('courses.json');
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  req.courses = courses;
  req.index = index;
  next();
}

router.get('/', (req, res) => res.json(read('courses.json')));

router.get('/:id', findCourse, (req, res) => res.json(req.courses[req.index]));

// Create / update / delete need a logged-in user
router.post('/', auth, validateCourse, (req, res) => {
  const courses = read('courses.json');
  const { title, instructor, duration } = req.body;
  const course = {
    id: courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
    title,
    instructor,
    duration,
  };
  courses.push(course);
  write('courses.json', courses);
  res.status(201).json(course);
});

router.put('/:id', auth, findCourse, validateCourse, (req, res) => {
  const { title, instructor, duration } = req.body;
  req.courses[req.index] = { id: req.courses[req.index].id, title, instructor, duration };
  write('courses.json', req.courses);
  res.json(req.courses[req.index]);
});

router.delete('/:id', auth, findCourse, (req, res) => {
  const [removed] = req.courses.splice(req.index, 1);
  write('courses.json', req.courses);
  res.json({ message: 'Course deleted', course: removed });
});

module.exports = router;
