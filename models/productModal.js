const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
    name: String,
    picture: String,
    price: Number,
    textcolor: String,
    discount:{
        type:Array,
        default:[],
    },
   
    bgcolor:Number,
    panelcolor: String
})

module.exports = mongoose.model('products', productSchema);