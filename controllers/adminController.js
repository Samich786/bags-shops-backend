const ownerModal = require("../models/ownerModal");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// Create owner controller

module.exports.createAdmin = async (req, res) => {
  let owners = await ownerModal.find();
  if (owners.length > 0) {
    return res.status(503).sned("You dont have permission to create new Owner");
  }
  const baseUrl = process.env.BASE_URL || "http://localhost:4000"; // Use your domain in production

  // Construct the full URL of the uploaded image
  const imagePath = `${baseUrl}/images/${req.file.filename}`;
  let { fullname, email, password } = req.body;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      let createOwner = await ownerModal.create({
        fullname,
        email,
        password: hash,
        role: "Admin",
        picture: imagePath, // Store the file path in the database
      });
      res.send(createOwner);
    });
  });
};

//   login admin controller
module.exports.loginAdmin = async (req, res) => {
  let { email, password } = req.body;
  let owner = await ownerModal.findOne({ email: email });
  if (!owner) {
    res.status(404).send("Invalid email or password");
  } else {
    bcrypt.compare(password, owner.password, function (err, result) {
      if (!result) {
        res.status(404).send("Invalid email or password");
      } else {
        let token = generateToken(owner);

        res.cookie("token", token, {
          httpOnly: true, // Prevents JavaScript from accessing the cookie
          // secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS in production
          secure: false,
          sameSite: "Strict", // Helps prevent CSRF attacks
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });
        res.send({
          data: {
            message: "Login Scussesfully",
            status: 200,
            data: {
              token: token,
            },
          },
        });
      }
    });
  }
};

//
