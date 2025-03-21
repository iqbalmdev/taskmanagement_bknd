const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
 // Add this line to import the 'fs' module
const cors = require('cors');
const registerRoute = require("./routers/orgRouter");
const nodemailer = require('nodemailer');
require("dotenv").config();

const app = express();
const mongoString = process.env.MOGODB_CONNECTION_STRING;
console.log(mongoString,"mongostrig")
app.use(cors());
app.use(express.json());
app.use("/api", registerRoute);

// Use async/await with mongoose.connect

mongoose.connect(mongoString).then(()=>{
    console.log("data base connected")

    app.listen(4001,()=>{
        console.log("server is running in port 4001")
    })
}).catch((err)=>{
    console.log(err)
})
