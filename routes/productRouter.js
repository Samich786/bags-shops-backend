const express = require("express");

const router = express.Router();
const { createProduct } = require("../controllers/productController");
const upload = require("../utils/multer");
const isAdminLoggedin = require("../middlewares/isAdminLoggedin");

router.get("/", (req, res) => {
  res.send("heloo user");
});

router.post(
  "/create",
  isAdminLoggedin,
  upload.single("picture"),
  createProduct
);

module.exports = router;
