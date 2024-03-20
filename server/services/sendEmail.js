const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
const User = require("../models/User");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,  //flase bcoz we dont use any encryption
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please enter email" });
  }
  console.log(email);
  let user = await User.findOne({
    email,                        //find email in User i.e in database
  });

  const otp = generateOTP();

  if (user && user.isVerified == true)                  //it will check if user is verified then it give error message
    return res.status(400).json({ message: `${email} is a verified user.` });

  if (user && user.isVerified == false) {       //it will if user is present and not verified
    user = await User.findOne({
      email,
    });
    user.otp = otp;  //update otp
    await user.save();  //save the user with new update i.e verified
  } else {
    user = await User.create({   //If user doesn't exist, create a new user with the provided email and OTP
      email,
      otp,
    });
  }
//Mail format that is recieved by the user 
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Verify your email",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json(error);
    } else {
      return res.json({ user, message: "OTP sent succesfully", status: 200 });
    }
  });
});

module.exports = { sendEmail };
