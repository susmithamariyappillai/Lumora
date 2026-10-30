exports.notFound = (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// Central error handler: every thrown error ends up here.
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError') { status = 400; message = 'Invalid ID format.'; }
  else if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(' '); }
  else if (err.code === 11000) { status = 409; message = 'That value already exists (duplicate).'; }
  else if (status === 500 && process.env.NODE_ENV === 'production') message = 'Something went wrong on the server.';

  if (status === 500) console.error(err); // full details only in the server log
  res.status(status).json({ success: false, message });
};
