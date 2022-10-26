const mongoose = require("mongoose");


// creating mongoose schema
const userScheme = mongoose.Schema({
    name: String,
    email: { type: String, require: true },
    password: { type: String, require: true },
    verified:{type:Boolean, default:false}
})

// creating collecting
const user = mongoose.model("user", userScheme);

// exporting model
module.exports = user;