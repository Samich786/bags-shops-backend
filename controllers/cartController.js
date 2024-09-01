const cartModal = require("../models/cartModal");
const productModal = require("../models/productModal");
const userModal = require("../models/userModal");

// Controller function
module.exports.addToCart = async (req, res) => {
  try {
    console.log(req.body);
    
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Find the user
    const user = await userModal.findById(userId);
    if (!user) {
      return res.status(400).send({
        data: {
          message: "User not found",
          status: 400,
        },
      });
    }

    // Find user's cart
    let cart = await cartModal.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new cartModal({
        // Correct assignment of userId
        user: userId,
        items: [],
      });
      await cart.save(); // Save the newly created cart
      user.cartId = cart._id; // Update user's cartId with new cart's ID
      await user.save();
    }

    // Find product in cart
    const productIndex = cart.items.findIndex((item) =>
      item.products.equals(productId)
    );

    // Update quantity or add new product
    if (productIndex > -1) {
      // Ensure quantity is treated as a number
      cart.items[productIndex].quantity += Number(quantity); // Convert quantity to number and add
    } else {
      const product = await productModal.findById(productId);
      if (!product) {
        return res.status(400).send({
          data: {
            message: "Product not found",
            status: 400,
          },
        });
      }
      cart.items.push({ products: productId, quantity: Number(quantity) }); // Ensure quantity is a number
    }

    // Calculate total price of cart
    const itemTotals = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productModal.findById(item.products);
        return product.price * item.quantity;
      })
    );

    cart.total = itemTotals.reduce((acc, curr) => acc + curr, 0);

    // Save cart to database
    await cart.save();

    res.status(200).send({
      data: {
        message: "Product added to cart",
        status: 200,
        cart,
      },
    });
  } catch (err) {
    res.status(500).send({
      data: {
        message: err.message,
        status: 500,
      },
    });
  }
};

// Controller function get cart
module.exports.getCart = async (req, res) => {
  try {
    const user = req.user._id;
    // console.log(user, "user");

    const cart = await cartModal
      .find({ user })
      .populate({ path: "items.products", model: "products" });
    // console.log(cart);

    if (!cart) {
      res.status(400).send({
        data: {
          message: "Cart not found",
          status: 400,
        },
      });
      return;
    }
    res.status(200).send({
      data: {
        message: "Cart found",
        status: 200,
        cart,
      },
    });
  } catch (err) {
    res.status(500).send({
      data: {
        message: err.message,
        status: 500,
      },
    });
  }
};

// Controller function remove from cart
module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body; // Product ID to remove
    const userId = req.user._id; // User ID from authentication

    // Find the user
    const user = await userModal.findById(userId);
    if (!user) {
      return res.status(400).send({
        data: {
          message: "User not found",
          status: 400,
        },
      });
    }

    // Find the user's cart
    const cart = await cartModal.findOne({ user: userId });
    if (!cart) {
      return res.status(400).send({
        data: {
          message: "Cart not found",
          status: 400,
        },
      });
    }

    // Find the index of the item to remove
    const itemIndex = cart.items.findIndex((item) =>
      item.products.equals(productId)
    );

    if (itemIndex === -1) {
      return res.status(400).send({
        data: {
          message: "Product not found in cart",
          status: 400,
        },
      });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Check if the cart is empty after removing the item
    if (cart.items.length === 0) {
      // If the cart is empty, delete it
      await cartModal.deleteOne({ _id: cart._id });

      // Remove cart reference from user's cartsId if necessary
      if (user.cartId.equals(cart._id)) {
        user.cartId = null; // Clear the cart reference
      }
      await user.save();

      return res.status(200).send({
        data: {
          message: "Product removed from cart",
          status: 200,
        },
      });
    }

    // If the cart is not empty, recalculate the total price
    const itemTotals = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productModal.findById(item.products);
        return product.price * item.quantity;
      })
    );

    cart.total = itemTotals.reduce((acc, curr) => acc + curr, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).send({
      data: {
        message: "Product removed from cart",
        status: 200,
        cart,
      },
    });
  } catch (err) {
    res.status(500).send({
      data: {
        message: err.message,
        status: 500,
      },
    });
  }
};
