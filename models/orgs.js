const mongoose = require("mongoose");



const OrgSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    phone_number:{
        type:Number,
        unique: true
    },
    org_name:{
        type:String
    },
    industry_type:{
        type:String
    },
    org_size:{
        type:Number,
        min: 1,  // Example minimum value
        max: 1000
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    }

})

module.exports = mongoose.model("Orgs",OrgSchema)