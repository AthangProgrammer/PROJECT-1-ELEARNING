// 404 for unknown routes
exports.notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

// Central error handler (must have 4 params)
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
