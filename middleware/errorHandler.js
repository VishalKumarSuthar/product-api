const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;