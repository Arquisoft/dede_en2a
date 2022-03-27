import { userVerificationModel } from "../users/UserVerification";

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  secure: true,
  requireTLS: true,
});

export const sendInvoiceEmail: Function = async (email: string) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "DeDe Order Invoice",
    html: "<p> Thank you for trusting in DeDe and buying with us</p>",
  };

  transporter.sendMail(mailOptions);
};

export const sendVerificationEmail: Function = async (email: string) => {
  const currentUrl = "http://localhost:5000";
  const uniqueString = uuidv4();

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your DeDe account",
    html:
      "<p> Verify your email account to complete the sign up and login into your account.</p>" +
      '<p>This link <b>expires in 6 hours</b>.<p/><p>Press <a href="' +
      currentUrl +
      "/users/verify/" +
      email +
      "/" +
      uniqueString +
      '"}>here<a/> to proceed</p>',
  };

  const newUserVerification = new userVerificationModel({
    email: email,
    uniqueString: uniqueString,
    expiresAt: Date.now() + 21600000,
  });

  await newUserVerification.save();
  transporter.sendMail(mailOptions);
};
