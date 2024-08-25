const express = require("express");

const router = express.Router();
const { createProduct , getProducts  , updateProduct , deleteProduct, getproductById } = require("../controllers/productController");
const {getCart, addToCart, removeFromCart} = require('../controllers/cartController');
const upload = require("../utils/multer");
const checkedLoginUser = require("../middlewares/checkedLoginUser");

// Product Route
router.get("/allproducts", checkedLoginUser, getProducts);
router.get("/productById/:id", checkedLoginUser, getproductById);
router.put("/updateproduct/:id", checkedLoginUser, updateProduct);
router.delete("/deleteproduct/:id", checkedLoginUser, deleteProduct);

router.post(
  "/create",
  checkedLoginUser,
  upload.single("picture"),
  createProduct
);

// Cart Route
router.get('/cart', checkedLoginUser, getCart);
router.post('/cart',checkedLoginUser, addToCart);
router.delete('/removeCart',checkedLoginUser,removeFromCart);

module.exports = router;
