const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  process.env.SENDGRID_API_KEY ||
    "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"
);

export const sendInvoiceEmail: Function = (
  email: string,
  orderCode: string,
  message: string
) => {
  /*const pathToAttachment = `${__dirname}/pdf/` + orderCode + ".pdf";
  const attachment = fs.readFileSync(pathToAttachment).toString("base64");*/

  const mailOptions = {
    to: email,
    from: process.env.AUTH_EMAIL,
    subject: "DeDe Order Invoice",
    html:
      "<p>Thank you for trusting in DeDe and buying with us.<br><br>Here you have the receipt of your purchase." +
      "<br><br>We hope to see you soon :)</p><br><br><br><br><br>" +
      message,
    /*attachments: [
      {
        content: attachment,
        filename: orderCode + ".pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],*/
  };
  sgMail.send(mailOptions);
};