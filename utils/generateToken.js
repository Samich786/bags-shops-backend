const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: 60 * 60 * 24,
  });
};