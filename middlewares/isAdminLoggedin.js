const jwt = require("jsonwebtoken");
const ownerModal = require("../models/ownerModal");
const JWT_KEY = process.env.JWT_KEY;

const isAdminLoggedin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next(); // No token, let `checkLoggedIn` proceed to user check
    }

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Owner token expired", code: "TOKEN_EXPIRED" });
        }
        return next(); // Let `checkLoggedIn` proceed if token is invalid for owner
      }

      try {
        const owner = await ownerModal.findById(decoded.id);
        if (!owner) {
          return next(); // Proceed to user check if no owner is found
        }

        req.owner = owner;
        return next(); // Owner found, proceed
      } catch (dbError) {
        console.error("Error fetching owner:", dbError);
        return res.status(500).json({ message: "Error fetching owner" });
      }
    });
  } catch (error) {
    console.error("Middleware error (Owner):", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdminLoggedin;
