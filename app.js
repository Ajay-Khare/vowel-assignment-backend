const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routers/router");
app.use(router);

// connectiong with database
const mongoDB = "mongodb+srv://Ajay:<pass>@cluster0.69nrddt.mongodb.net/vowel?retryWrites=true&w=majority"
mongoose.connect("mongodb://localhost:27017/vowel", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err.message)
    }
    else {
        console.log("connected to database")
    }
})

// connecting to server
app.listen(8080, () => {
    console.log("server is running on port 8080")
})