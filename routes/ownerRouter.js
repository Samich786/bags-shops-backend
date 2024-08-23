const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { createAdmin } = require("../controllers/adminController");
const { loginAdmin } = require("../controllers/adminController");
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  router.post("/create", upload.single("picture"), createAdmin);
}

// login owner
router.post("/login", loginAdmin);

module.exports = router;
