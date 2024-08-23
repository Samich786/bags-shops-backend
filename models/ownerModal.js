const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  productsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  role: String,
  gstin: String,
  picture: String,
});

module.exports = mongoose.model("admin", ownerSchema);
