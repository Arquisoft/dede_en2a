import { orderModel } from "../orders/Order";
import { userModel } from "../users/User";

const fs = require("fs");
const PDFGenerator = require("pdfkit");

export const createPDF = async (code: string) => {
  if (process.env.MONGO_DB_URI === undefined) return;
  const InvoiceGenerator = require("../InvoiceGenerator");

  const orderFound = await orderModel.findOne({
    code: code,
  });
  const user = await userModel.findOne({ webId: orderFound.webId });
  const invoiceData = {
    addresses: {
      shipping: {
        name: "",
        address: orderFound.address,
        email: user.webId,
      },
    },
    items: orderFound.products,
    subtotal: orderFound.subtotalPrice,
    total: orderFound.totalPrice,
    shippingPrice: orderFound.shippingPrice,
    invoiceNumber: orderFound.code,
    dueDate: orderFound.date,
  };

  const ig = new InvoiceGenerator(invoiceData);
  ig.generate();
};
