const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/jwtdata').then(()=>{
    console.log("connected to your database");
}).catch((err)=>{
    console.log(err.message);
})