const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');

const router = express.Router();

// Only these fields can be set from the request body
const pick = ({ name, description, category, price } = {}) => ({ name, description, category, price });

router.get('/', async (req, res) => {
  res.json(await Course.find().sort({ createdAt: -1 }));
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Creating, updating and deleting need a logged-in user
router.post('/', auth, async (req, res) => {
  const course = await Course.create({ ...pick(req.body), createdBy: req.user.id });
  res.status(201).json(course);
});

router.put('/:id', auth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (String(course.createdBy) !== req.user.id)
    return res.status(403).json({ error: 'You can only edit your own courses' });

  course.set(pick(req.body));
  await course.save(); // runs the schema validation
  res.json(course);
});

router.delete('/:id', auth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (String(course.createdBy) !== req.user.id)
    return res.status(403).json({ error: 'You can only delete your own courses' });

  await course.deleteOne();
  await Enrollment.deleteMany({ course: course._id }); // remove enrollments of the deleted course
  res.json({ message: 'Course deleted' });
});

module.exports = router;
