const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    textcolor: Boolean,
    discount:{
        type:Array,
        default:[],
    },
   
    bgcolor:Number,
    panelcolor: String
})

module.exports = mongoose.model('product', productSchema);