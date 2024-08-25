const express = require("express");
const router = express.Router();
const checkLoggedIn = require("../middlewares/checkedLoginUser");
const {loginUser} = require("../controllers/authController");
const e = require("express");
console.log(process.env.NODE_ENV);

// me api setting

router.post("/login", loginUser);
router.get("/me", checkLoggedIn, (req, res) => {
  // Send a JSON response to the client
  if (req.user) {
    res.status(200).send({
      data: {
        message: "Hello World User",
        status: 200,
        data: req.user,
      },
    });
  } else if (req.owner) {
    res.status(200).send({
      data: {
        message: "Hello World Owner",
        status: 200,
        data: req.owner,
      },
    });
  } else {
    res.status(200).send({
      data: {
        message: "Not Logged In",
        status: 200,
        data: null,
      },
    });
  }
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
