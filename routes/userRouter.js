const express = require("express");

const router = express.Router();
const { registerUser, getUser } = require("../controllers/authController");

const upload = require("../utils/multer");

router.get("/",getUser)

router.post("/register", upload.single("picture"), registerUser);


module.exports = router;
