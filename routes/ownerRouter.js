const express = require("express");

const router = express.Router();
const ownerModal = require("../models/ownerModal");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModal.find();
    if (owners.length > 0) {
      return res
        .status(503)
        .sned("You dont have permission to create new Owner");
    }
    let { fullname, email, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        // Store hash in your password DB.
        let createOwner = await ownerModal.create({
          fullname,
          email,
          password: hash,
        });
        res.send(createOwner);
      });
    });
  });
}

// login owner
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let owner = await ownerModal.findOne({ email: email });
  if (!owner) {
    res.status(404).send("Invalid email or password");
  } else {
    bcrypt.compare(password, owner.password, function (err, result) {
      if (!result) {
        res.status(404).send("Invalid email or password");
      } else {
        let token = generateToken(owner);

        res.cookie("token", token, {
          httpOnly: true, // Prevents JavaScript from accessing the cookie
          // secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS in production
          secure: false,
          sameSite: "Strict", // Helps prevent CSRF attacks
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });
        res.send({
          data: {
            message: "Login Scussesfully",
            status: 200,
            data: {
              token: token,
            },
          },
        });
      }
    });
  }
});

module.exports = router;
