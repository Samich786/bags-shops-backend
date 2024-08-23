const userModal = require("../models/userModal");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// Setup multer storage

// Create multer upload instance

// Controller function
(module.exports.registerUser = async (req, res) => {
  try {
    console.log(req.body); // Ensure this logs the form data
    let { fullname, email, password, contact } = req.body;

    let user = await userModal.findOne({ email: email });
    if (user) {
      return res.status(403).send("Email already exists");
    }
    const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Use your domain in production

    // Construct the full URL of the uploaded image
    const imagePath = `${baseUrl}/images/${req.file.filename}`;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        let createUser = await userModal.create({
          fullname,
          email,
          password: hash,
          contact,
          role: "user",
          picture: imagePath, // Store the file path in the database
        });
        res.send(createUser);
      });
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
}),
  //  login
  (module.exports.loginUser = async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await userModal.findOne({ email: email });
      if (!user) {
        res.status(404).send("Invalid email or password");
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          if (!result) {
            res.status(404).send("Invalid email or password");
          } else {
            let token = generateToken(user);
            console.log(token);
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
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
