require('dotenv').config(); // loads JWT_SECRET from .env
const express = require('express');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set a value.');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => res.json({ message: 'E-Learning API. Try /api/courses' }));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/auth', require('./routes/auth'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
