const mongoose = require("mongoose");


const OrgVerificationSchema = new mongoose.Schema({
    userId:{
        type:String,
        ref:"user"
    },
    email:{
type:String,
required:true
    },
    otp:{
        type:String,
        createdAt:Date,
        expiresAt:Date
    }
})

module.exports = mongoose.model("OrgsVerifications",OrgVerificationSchema)