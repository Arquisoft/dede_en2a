import { orderModel } from "../orders/Order";
import { userModel } from "../users/User";
import { sendInvoiceEmail } from "./emailSender";

const fs = require("fs");
const PDFGenerator = require("pdfkit");

export const createPDF = async (code: string) => {
  if (process.env.MONGO_DB_URI === undefined) return;
  const InvoiceGenerator = require("./InvoiceGenerator");

  const orderFound = await orderModel.findOne({
    orderCode: code,
  });
  const user = await userModel.findOne({ email: orderFound.userEmail });
  const invoiceData = {
    addresses: {
      shipping: {
        name: user.name,
        address: orderFound.userAddress,
        email: orderFound.userEmail,
      },
    },
    items: orderFound.products,
    subtotal: orderFound.subtotalPrice,
    total: orderFound.totalPrice,
    shippingPrice: orderFound.shippingPrice,
    invoiceNumber: orderFound.orderCode,
    dueDate: orderFound.date,
  };

  const ig = new InvoiceGenerator(invoiceData);
  ig.generate();
  sendInvoiceEmail(orderFound.userEmail, orderFound.orderCode);
};
