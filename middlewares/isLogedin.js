const jwt = require("jsonwebtoken");
const userModal = require("../models/userModal");
const JWT_KEY = process.env.JWT_KEY;
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, JWT_KEY, async (err, decoded) => {
        if (err) {
          res.status(401).send("Invalid token");
        } else {
          const { id } = decoded;
          await userModal.findById(id, (err, user) => {
            if (user) {
              req.user = user;
              next();
            } else {
              res.status(401).send("Invalid token");
            }
          });
        }
      });
    } else {
      res.status(401).redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.status(401).redirect("/login");
  }
};
