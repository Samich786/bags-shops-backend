const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  products:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  gstin: String,
  picture: String,
});

module.exports = mongoose.model("owners", ownerSchema);
