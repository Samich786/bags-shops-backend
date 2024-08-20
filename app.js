const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const exp = require('constants');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req,res)=>{
    res.send('heloo')
})

app.listen(4000);