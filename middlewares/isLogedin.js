// userMiddleware.js
const jwt = require("jsonwebtoken");
const userModal = require("../models/userModal");
const JWT_KEY = process.env.JWT_KEY;

const isLogedin = async (req, res, next) => {
  try {
    // Extract the token directly
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, JWT_KEY, async (err, decoded) => {
        if (err) {
          console.error("JWT verification error (User):", err); // Detailed error logging
          res.status(401).send("Invalid token");
        } else {
          const { id } = decoded;
          try {
            const user = await userModal.findById(id);
            if (user) {
              req.user = user;
              next();
            } else {
              res.status(401).send("Invalid token");
            }
          } catch (error) {
            console.error("Error fetching user:", error); // Detailed error logging
            res.status(401).send("Error fetching user");
          }
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Middleware error:", error); // Detailed error logging
    res.status(401).send("Unauthorized");
  }
};

module.exports = isLogedin;
