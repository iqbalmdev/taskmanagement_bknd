const express = require("express")
const {registerOrg,verifyOtp,orgLogin} = require("../controllers/orgControllers.js")


const router = express.Router();


router.post("/registerOrg",registerOrg)
router.post("/verifyOtp",verifyOtp)
router.post("/orgLogin",orgLogin)


module.exports = router


