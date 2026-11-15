require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorHandler');

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
}

const app = express();

// CORS: only the frontend URL(s) in CLIENT_URL may call this API (comma-separated for several)
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',') }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
