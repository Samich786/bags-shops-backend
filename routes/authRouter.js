const express = require("express");
const router = express.Router();
const isAdminLoggedin = require("../middlewares/isAdminLoggedin");
const isLogedin = require("../middlewares/isLogedin");
console.log(process.env.NODE_ENV);

// me api setting
router.get("/me", isAdminLoggedin || isLogedin, (req, res) => {
  // Send a JSON response to the client
  req.res.status(200).send({
    data: {
      message: "Hello World",
      status: 200,
      data: req.owner,
    },
  });
});

// logout route
router.post("/logout", (req, res) => {
  // Clear the cookie named "token"
  res.clearCookie("token");

  // Send a JSON response to the client
  res.status(200).send({
    data: {
      message: "Logout Successfully",
      status: 200,
      data: null,
    },
  });
});

module.exports = router;
