const userModal = require("../models/userModal");
const ownerModal = require("../models/ownerModal");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// Setup multer storage

// Create multer upload instance

// Controller function register user controller
(module.exports.registerUser = async (req, res) => {
  try {
    // console.log(req.body); // Ensure this logs the form data
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
        res.status(200).send({
          data: {
            message: "User created successfully",
            status: 200,
          },
        });
      });
    });
  } catch (err) {
    res.status(500).send({
      data: {
        message: err.message,
        status: 500,
      },
    });
  }
}),
  //  login user controller
  (module.exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Determine if the email belongs to a user or an owner
      let user;
      let userType; // 'user' or 'owner'

      // Check if the email belongs to a user
      user = await userModal.findOne({ email: email });
      if (user) {
        userType = "user";
      } else {
        // Check if the email belongs to an owner
        user = await ownerModal.findOne({ email: email });
        if (user) {
          userType = "owner";
        } else {
          return res.status(404).send("Invalid email or password");
        }
      }

      // Compare password
      bcrypt.compare(password, user.password, function (err, result) {
        if (!result) {
          return res.status(404).send("Invalid email or password");
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = generateToken(user);

        // Send the tokens in the response
        res.send({
          data: {
            message: "Login Successful",
            status: 200,
            data: {
              accessToken: accessToken,
              refreshToken: refreshToken, // Include the refresh token in the response
              userType: userType,
            },
          },
        });
      });
    } catch (err) {
      res.status(500).send({
        data: {
          message: err.message,
          status: 500,
        },
      });
    }
  });

// Controller function get user controller
module.exports.getUser = async (req, res) => {
  try {
    let user = await userModal.find();
    if (!user) {
      res.status(400).send({
        data: {
          message: "user not found",
          status: 400,
        },
      });
    } else {
      res.send({
        data: {
          message: "user found",
          status: 200,
          data: {
            user,
          },
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      data: {
        message: err.message,
        status: 500,
      },
    });
  }
};
