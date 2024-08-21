const express = require("express");

const router = express.Router();
const ownerModal = require("../models/ownerModal");
const bcrypt = require("bcrypt");
console.log(process.env.NODE_ENV);

router.get("/", (req, res) => {
  res.send("heloo user");
});

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModal.find();
    if (owners.length > 0) {
      return res.status(503).sned("You dont have permission to create new Owner");
    }
    let { fullname, email, password } = req.body;
    
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt,async function(err, hash) {
          // Store hash in your password DB.
          let createOwner = await ownerModal.create({
            fullname,
            email,
            password:hash,
          });
          res.send(createOwner);
      });
  });
  });
}

module.exports = router;
