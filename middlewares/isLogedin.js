const jwt = require("jsonwebtoken");
const userModal = require("../models/userModal");
const JWT_KEY = process.env.JWT_KEY;

const isLogedin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "User token expired", code: "TOKEN_EXPIRED" });
        }
        return res
          .status(401)
          .json({ message: "Invalid token", code: "TOKEN_INVALID" });
      }

      try {
        const user = await userModal.findById(decoded.id);
        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid token, user not found" });
        }

        req.user = user;
        next(); // User found, proceed
      } catch (dbError) {
        console.error("Error fetching user:", dbError);
        return res.status(500).json({ message: "Error fetching user" });
      }
    });
  } catch (error) {
    console.error("Middleware error (User):", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = isLogedin;
