const c = require("config");
const ownerModal = require("../models/ownerModal");
const productModal = require("../models/productModal");

// Create product controller
module.exports.createProduct = async (req, res) => {
  if (!req.owner) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const {
      name,
      price,
      description,
      category,
      textcolor,
      bgcolor,
      panelcolor,
      isNewArrival,
      isPopular,
      discountPercentage,
      endDate,
    } = req.body;

    // Base URL for serving images
    const baseUrl = process.env.BASE_URL || "http://localhost:3000"; // Use your domain in production

    // Construct the full URL of the uploaded image
    const imagePath = `${baseUrl}/images/${req.file.filename}`;

    // Calculate discount price
    const discountPrice =
      discountPercentage > 0 ? price - (price * discountPercentage) / 100 : 0; // Set to 0 if discountPercentage is 0
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
      discountPrice,
      discount: {
        percentageValue: discountPercentage || 0,
        endDate: endDate,
      },
      isNewArrival,
      isPopular,
      isDiscount: discountPercentage > 0,
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

// Get products controller
module.exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      discount,
      isNewArrival,
      isPopular,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filters = {};

    // Apply filters based on query parameters
    if (category && category.trim() !== "" && category.trim() !== '""') {
      filters.category = category.trim();
    }

    if (discount === "true") {
      filters.isDiscount = true;
    }

    if (isNewArrival === "true") {
      filters.isNewArrival = true;
    }

    if (isPopular === "true") {
      filters.isPopular = true;
    }

    // console.log(filters);

    // Fetch products with filters, pagination, and limit
    const products = await productModal
      .find(filters)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await productModal.countDocuments(filters);

    res.send({
      data: {
        message: "Products Retrieved Successfully",
        status: 200,
        data: {
          products,
          totalProducts, // Optional: include total count for pagination
          totalPages: Math.ceil(totalProducts / parseInt(limit)),
          currentPage: parseInt(page),
        },
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

// get popular products
module.exports.getPopularProducts= async (req,res)=>{
  try{
    const products = await productModal.find({
      isPopular: true,
    });
    res.send({
      data: {
        message: "Popular Products Retrieved Successfully",
        status: 200,
        data: { products },
      },
    });
  }catch(err){
    res.status(500).send({
      data: {
        error: err.message,
        status: 500,
      },
    });
  }
},
// get New Arrival
module.exports.getNewArrival = async (req,res)=>{
try{
const products = await productModal.find({
  isNewArrival: true,
});
res.send({
  data: {
    message: "New Arrival Products Retrieved Successfully",
    status: 200,
    data: { products },
  },
});
}catch(err){
  res.status(500).send({
    data:{
      error:err.message,
      status:500
    }
  })
}
}

// get all discount products
module.exports.getDiscountProducts = async (req,res)=>{
try{
const products = await productModal.find({
  isDiscount: true,
});
res.send({
  data: {
    message: "Discount Products Retrieved Successfully",
    status: 200,
    data: { products },
  },
});
}catch(err){
  res.status(500).send({
    data:{
      error:err.message,
      status:500
    }
  })
}
},
// get Single product controller
module.exports.getproductById = async (req, res) => {
  try {
    const product = await productModal.findById(req.params.id);
    if (!product) {
      res.status(400).send({
        data: {
          message: "Product Not Found",
          status: 400,
          data: null,
        },
      });
      return;
    }
    res.send({
      data: {
        message: "Product Retrieved Successfully",
        status: 200,
        data: { product },
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Update product controller
module.exports.updateProduct = async (req, res) => {
  if (!req.owner) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const product = await productModal.findById(req.params.id);
    if (!product) {
      res.status(400).send({
        data: {
          message: "Product Not Found",
          status: 400,
        },
      });
      return;
    }
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

    const baseUrl = process.env.BASE_URL;
    imagePath = `${baseUrl}/images/${req.file.filename}`;
    const updatedProduct = await productModal.findByIdAndUpdate(product._id, {
      name,
      price,
      description,
      category,
      textcolor,
      bgcolor,
      panelcolor,
      discount,
      picture: imagePath,
    });
    res.send({
      data: {
        message: "Product Updated Successfully",
        status: 200,
        data: { product: updatedProduct },
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Delete product controller
module.exports.deleteProduct = async (req, res) => {
  if (!req.owner) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const product = await productModal.findById(req.params.id);
    if (!product) {
      res.status(400).send({
        data: {
          message: "Product Not Found",
          status: 400,
        },
      });
      return;
    }
    await productModal.findByIdAndDelete(product._id);
    res.send({
      data: {
        message: "Product Deleted Successfully",
        status: 200,
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
