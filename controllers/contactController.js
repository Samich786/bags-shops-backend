const nodemailer = require("nodemailer");
const OwnerModel = require("../models/ownerModal");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Fetch admin details
    const admin = await OwnerModel.findOne({ email: "sami.tech043@gmail.com" });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    // Configure nodemailer transport with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // Your Gmail address
        pass: process.env.ADMIN_EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    const mailOptions = {
      from: email, // User's email from the form
      to: admin.email, // Admin email from database
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email." });
      }
      res.status(200).json({ success: "Message sent successfully!" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
