const express = require("express");

const router = express.Router();
const { registerUser, getUser } = require("../controllers/authController");
const { sendContactMessage } = require("../controllers/contactController");

const upload = require("../utils/multer");

router.get("/", getUser);
router.post("/contact", sendContactMessage);

router.post("/register", upload.single("picture"), registerUser);

module.exports = router;
