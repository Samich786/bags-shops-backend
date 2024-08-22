const express = require("express");

const router = express.Router();
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const upload = require("../utils/multer");

router.get("/", (req, res) => {
  res.send("heloo user");
});

router.post("/register", upload.single("picture"), registerUser);
router.post("/login", loginUser);

module.exports = router;
