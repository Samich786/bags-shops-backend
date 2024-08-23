require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
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

// Example of using BASE_URL in your app
app.get("/example", (req, res) => {
  res.send(`API is running at ${BASE_URL}`);
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
