// If route is not found
exports.notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

// Handle errors
exports.errorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
};