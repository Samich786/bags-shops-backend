const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'http://example2.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable cookies
};

module.exports = cors(corsOptions);
