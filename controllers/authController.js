const multer = require("multer");
const userModal = require("../models/userModal");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");

// Setup multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(16, function (err, buf) {
            if (err) return cb(err);
            const bytes = buf.toString('hex') + path.extname(file.originalname);
            cb(null, bytes);
        });
    }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Controller function
module.exports.registerUser = [
    upload.single('picture'), // Apply multer middleware
    async (req, res) => {
        try {
        console.log(req.body); // Ensure this logs the form data
        let { fullname, email, password, contact } = req.body;

        let user = await userModal.findOne({ email: email });
        if (user) {
            return res.status(403).send("Email already exists");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                let createUser = await userModal.create({
                    fullname,
                    email,
                    password: hash,
                    contact,
                    picture: req.file.path, // Store the file path in the database
                });
                res.send(createUser);
            });
        });
    }catch(err){
        res.status(400).send(err.message);
    }
}
];
