const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = (user) => {
  // console.log(user);

  const payload = {
    id: user.id,
    email: user.email,
    userType: user.userType,
  };
  const refreshPayload = {
    id: user.id,
    // userType: user.userType,
    refreshTokenId: uuidv4(), // Unique identifier for each refresh token
    issuedAt: new Date().toISOString(), // Current timestamp
  };

  // Generate access token (short-lived, e.g., 15 minutes)
  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "1m", // Short expiration for access token
  });

  // Generate refresh token (long-lived, e.g., 7 days)
  const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "15d", // Long expiration for refresh token
  });

  return { accessToken, refreshToken };
};
