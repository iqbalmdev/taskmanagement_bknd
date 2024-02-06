const OrgSchema = require("../models/orgs");
const OrgVerificationSchema = require("../models/orgVerfication");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { sendEmailFunction } = require("../helper/functions");

// creating an organization
const registerOrg = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    org_name,
    industry_type,
    org_size,
  } = req.body;
  try {
    const exisitingOrg = await OrgSchema.find({
      email: email,
    });
    if (exisitingOrg.length > 0) {
      return res.json({
        message: "user already exists",
        status: 201,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOrg = new OrgSchema({
      name,
      email,
      password: hashedPassword, // Use the hashed password
      phone_number,
      org_name,
      industry_type,
      org_size,
    });
    // Save the new organization to the database
    const userCreatedResponse = await newOrg.save();
    const createOtp = await sendOtpVerification({
      userId: userCreatedResponse._id,
      email,
    });
    res.status(200).json({
      message: "Organization registered successfully",
      status: 200,
      emailResponse1: createOtp.sendEmailRes,
      emailResponse2: createOtp.submitOtp,
      userCreatedResponse,
    });
  } catch (error) {
    console.error("Error during organization registration:", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

// sending otp to org owner
const sendOtpVerification = async ({ userId, email }, res) => {
  console.log(email, "see hereee------------------");
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOtp = await bcrypt.hash(otp, 6);
    const newOrgVerificationSchema = new OrgVerificationSchema({
      userId,
      email,
      otp: hashedOtp,
    });
    const submitOtp = await newOrgVerificationSchema.save();
    const sendEmailRes = await sendEmailFunction(email, otp);
    return { sendEmailRes, submitOtp };
  } catch (Err) {
    return res.json({
      message: Err,
    });
  }
};

const verifyOtp = async (req, res) => {
  console.log("verify started");
  const { email, otp } = req.body;
  try {
    const checkUserOtp = await OrgVerificationSchema.findOne({
      email,
    });

    if (checkUserOtp) {
      const compareOtp = bcrypt.compare(String(otp), checkUserOtp.otp);
      if (compareOtp) {
        const updateResponse = await OrgSchema.findOneAndUpdate(
          { email: email },
          { isVerified: true }
        );
        console.log(updateResponse, "updated scenes");
        res.status(201).json({ message: "otp verified" });
      } else {
        res.status(400).json({ message: "invalid otp" });
      }
    } else {
      res.status(404).json({ message: "no user found with this email" });
    }
  } catch (Err) {
    res.status(500).json({ status: 500, message: "internal server error" });
  }
};

const orgLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingOrg = await OrgSchema.findOne({ email });
    if (!existingOrg) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingOrg.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingOrg._id }, process.env.JWT_SECERET, {
      expiresIn: '1h', // Set token expiration time
    });

    // Set the token as a cookie or send it in the response body
    res.cookie('token', token, { httpOnly: true }); // Example: Set as a cookie
    // OR
    // res.status(200).json({ token }); // Example: Send in the response body

    // Send a success response
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerOrg,
  verifyOtp,
  orgLogin,
};
