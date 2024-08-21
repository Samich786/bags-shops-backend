const express = require("express");

const router = express.Router();
const ownerModal = require("../models/ownerModal");
console.log(process.env.NODE_ENV);

router.get("/", (req, res) => {
  res.send("heloo user");
});

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModal.find();
    if (owners.length > 0) {
      return res.send(503).sned("You dont have permission to create new Owner");
    }
    let { fullname, email, password } = req.body;
    let createOwner = await ownerModal.create({
      fullname,
      email,
      password,
    });
    res.send(createOwner);
  });
}

module.exports = router;
