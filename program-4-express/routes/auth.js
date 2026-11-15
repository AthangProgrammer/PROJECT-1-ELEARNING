const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { read, write } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
const isText = (v) => typeof v === 'string' && v.trim() !== '';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!isText(name)) return res.status(400).json({ error: 'name is required' });
  if (!isText(email) || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: 'A valid email is required' });
  if (!isText(password) || password.length < 6)
    return res.status(400).json({ error: 'password must be at least 6 characters' });

  const users = read('users.json');
  if (users.some((u) => u.email === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already registered' });

  const user = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name: name.trim(),
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10), // never store plain passwords
  };
  users.push(user);
  write('users.json', users);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isText(email) || !isText(password))
    return res.status(400).json({ error: 'email and password are required' });

  const user = read('users.json').find((u) => u.email === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Protected route
router.get('/me', auth, (req, res) => {
  const user = read('users.json').find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

module.exports = router;
