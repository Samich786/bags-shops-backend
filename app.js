const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const exp = require("constants");
const ownerRouter = require("./routes/ownerRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const db = require("./config/mangoose-connection");
require("dotenv").config();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/owners", ownerRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(4000);
