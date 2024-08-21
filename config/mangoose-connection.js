const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");
mongoose
  .connect(`${config.get("MONGODB_URI")}/ecomShop`)
  .then(() => {
    dbgr("connected"); // Should log "connected"
  })
  .catch((err) => {
    dbgr("Error:", err); // Should log the error
  });

module.exports = mongoose.connection;
