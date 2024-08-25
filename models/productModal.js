const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  picture: String,
  price: Number,
  textcolor: String,
  description: String,
  category: String,
  discountPrice: Number,
  discount: {
    percentageValue: {
      type: Number,
      default: 0,
    }, // Discount percentage value
    endDate: {
      type: Date,
    }, // End date of the discount
  },
  bgcolor: String,
  panelcolor: String,
  isNewArrival: { // Boolean to mark new arrivals
    type: Boolean,
    default: false,
  },
  isPopular: { // Boolean to mark popular products
    type: Boolean,
    default: false,
  },
  isDiscount: { // Boolean to mark discounted products
    type: Boolean,
    default: false,
  },
  createdAt: { // Creation date for sorting and filtering by new arrivals
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("product", productSchema);
