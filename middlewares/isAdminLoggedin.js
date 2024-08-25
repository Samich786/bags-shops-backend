// ownerMiddleware.js
const jwt = require("jsonwebtoken");
const ownerModal = require("../models/ownerModal");
const JWT_KEY = process.env.JWT_KEY;

const isAdminLoggedin = async (req, res, next) => {
  try {
    // Extract the token directly
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, JWT_KEY, async (err, decoded) => {
        console.log(decoded);
        if (err) {
          console.error("JWT verification error (Owner):", err); // Detailed error logging
          return next(); // Call next to allow checkLoggedIn to try the next middleware
        } else {
          const { id } = decoded;
          console.log(id);
          try {
            const owner = await ownerModal.findOne({ _id: id });
            if (owner) {
              req.owner = owner;
              return next();
            } else {
              return next(); // Continue to checkLoggedIn for user check
            }
          } catch (error) {
            console.error("Error fetching owner:", error); // Detailed error logging
            return next(); // Continue to checkLoggedIn for user check
          }
        }
      });
    } else {
      return next(); // Continue to checkLoggedIn for user check
    }
  } catch (error) {
    console.error("Middleware error:", error); // Detailed error logging
    return next(); // Continue to checkLoggedIn for user check
  }
};

module.exports = isAdminLoggedin;
