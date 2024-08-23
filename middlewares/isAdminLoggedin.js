const jwt = require("jsonwebtoken");
const ownerModal = require("../models/ownerModal");
const JWT_KEY = process.env.JWT_KEY;

module.exports = async (req, res, next) => {
  try {
    // Extract the token directly
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      console.log(token); // For debugging
      console.log(JWT_KEY); // For debugging

      jwt.verify(token, JWT_KEY, async (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err); // Detailed error logging
          res.status(401).send("Invalid token");
        } else {
          const { id } = decoded;
          try {
            const owner = await ownerModal.findById(id);
            if (owner) {
              req.owner = owner;
              next();
            } else {
              res.status(401).send("Invalid token");
            }
          } catch (error) {
            console.error("Error fetching owner:", error); // Detailed error logging
            res.status(401).send("Error fetching owner");
          }
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Middleware error:", error); // Detailed error logging
    res.status(401).redirect("/login");
  }
};
