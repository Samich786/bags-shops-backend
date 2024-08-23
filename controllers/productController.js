const ownerModal = require("../models/ownerModal");
const productModal = require("../models/productModal");

module.exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      textcolor,
      bgcolor,
      panelcolor,
      discount,
    } = req.body;

    // Base URL for serving images
    const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Use your domain in production

    // Construct the full URL of the uploaded image
    const imagePath = `${baseUrl}/images/${req.file.filename}`;

    // Create the product with the full URL for the image
    let product = await productModal.create({
      name,
      price,
      description,
      category,
      picture: imagePath, // Store full URL instead of relative path
      textcolor,
      bgcolor,
      panelcolor,
      discount,
    });
    // Add the product to the owner's products
    const admin = await ownerModal.findById(req.owner.id);
    admin.productsId.push(product._id);
    // Save the updated user document
    await admin.save();
    res.send({
      data: {
        message: "Product Created Successfully",
        status: 200,
        data: { product },
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
