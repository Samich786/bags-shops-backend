require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cron = require("node-cron");
const updateExpiredDiscounts = require("./cronJobs/updateExpiredDiscounts");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const db = require("./config/mangoose-connection");
const cors = require("./utils/cors");

const app = express();

// Apply middlewares
app.use(cors);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use environment variables
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// Define routes
app.use("/admin", ownerRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/auth", authRouter);
// end points for refreshing the token
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send("Refresh token required");
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid refresh token");
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    // Generate a new refresh token
    // const refrshPayload = {
    //   refreshTokenId: uuidv4(),
    //   issuedAt: new Date().toISOString(),
    // };
    // const newRefreshToken = jwt.sign(
    //   refrshPayload,
    //   process.env.JWT_REFRESH_KEY,
    //   { expiresIn: "15d" }
    // );

    // Send the new access token
    res.json({ accessToken: newAccessToken });
  });
});

// Schedule the cron job to run every day at midnight
cron.schedule("30 14 * * *", () => {
  console.log("Running the updateExpiredDiscounts cron job...");
  updateExpiredDiscounts();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start server
app.listen(4000, () => {
  console.log(`Server is running on ${BASE_URL}`);
});
// fsvb mula zhfv lcka   NodeApp  my app password
