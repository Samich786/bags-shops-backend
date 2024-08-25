// updateExpiredDiscounts.js
const Product = require('../models/productModal'); // Adjust the path as necessary

const updateExpiredDiscounts = async () => {
  try {
    const now = new Date();
    const result = await Product.updateMany(
      { "discount.endDate": { $lt: now } },
      {
        $set: {
          "discount.percentageValue": 0,
          isDiscount: false,
        },
      }
    );
    console.log(`${result.modifiedCount} products updated.`);
  } catch (error) {
    console.error("Error updating expired discounts:", error);
  }
};

module.exports = updateExpiredDiscounts;
