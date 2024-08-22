const productModal = require("../models/productModal");


module.exports.cretaeProduct = async (req, res) => {
  try {
    let { name, price, description, category, textcolor, bgcolor,panelcolor,discount } = req.body;
    let product = await productModal.create({
      name,
      price,
      description,
      category,
      picture: req.file.path,
      textcolor,
      bgcolor,
      panelcolor,
      discount,
    });
    res.send({data:{
        message: "Product Created Successfully",
        status: 200,
        data: {
          product,
        },
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};