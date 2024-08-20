const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ecomShop");

const userSchems = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    products:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture: String,
});

module.exports = mongoose.model('user', userSchems);