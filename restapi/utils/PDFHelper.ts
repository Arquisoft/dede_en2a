import { orderModel } from "../orders/Order";
import { sendInvoiceEmail } from "./emailSender";

const fs = require("fs");
const PDFGenerator = require("pdfkit");

export const createPDF = async (code: string) => {
  if (process.env.MONGO_DB_URI === undefined) return;
  const InvoiceGenerator = require("./InvoiceGenerator");

  const orderFound = await orderModel.findOne({
    orderCode: code,
  });
  /*const user = await userModel.findOne({ email: orderFound.userEmail });
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
  ig.generate();*/
  var html = fs.readFileSync(process.cwd() + "/utils/template.html", "utf-8");
  const parse = require("node-html-parser").parse;

  const root = parse(html);
  const body = root.querySelector("body");
  let aux =
    '<header class="clearfix">' +
    '<div id="company">' +
    '<h2 class="name">DeDe</h2>' +
    '<div><a href="mailto:aswdedeen2a@gmail.com">aswdedeen2a@gmail.com</a></div><br><br>' +
    "</div> </div>" +
    "</header>" +
    "<main>" +
    '<div id="details" class="clearfix">' +
    '<div id="client">' +
    '<div class="to">Send to:</div>' +
    '<h2 class="name">' +
    orderFound.userEmail +
    "</h2>" +
    '     <div class="address">' +
    orderFound.userAddress +
    "</div>" +
    " </div>" +
    ' <div id="invoice">' +
    "<h1>Order invoice" +
    "</h1>" +
    '<div class="date">' +
    orderFound.date +
    "</div>" +
    " </div>" +
    "</div>" +
    '<table border="0" cellspacing="0" cellpadding="0">' +
    "<table >" +
    "<thead>" +
    "<tr>" +
    '<th class="no">#</th>' +
    '<th class="desc">DESCRIPTION</th>' +
    '<th class="unit">UNIT PRICE</th>' +
    '<th class="qty">QUANTITY</th>' +
    '<th class="total">TOTAL</th>' +
    "</tr>" +
    "</thead>" +
    "<tbody>";

  for (let i: number = 0; i < orderFound.products.length; i++) {
    let j: number = i + 1;
    aux =
      aux +
      "<tr>" +
      '<td class="no">' +
      j +
      "</td>" +
      '<td class="desc">' +
      "<h3>" +
      orderFound.products[i].name +
      "</h3>" +
      orderFound.products[i].description +
      "</td>" +
      '<td class="unit">' +
      orderFound.products[i].price +
      "€</td>" +
      '<td class="qty">' +
      orderFound.products[i].stock +
      "</td>" +
      '<td class="total">' +
      orderFound.products[i].stock * orderFound.products[i].price +
      "€</td>" +
      "</tr>";
  }

  aux =
    aux +
    "</tbody>" +
    "<tfoot>" +
    "<tr>" +
    '<td colspan="2"></td>' +
    '<td colspan="2">SUBTOTAL</td>' +
    "<td>" +
    orderFound.subtotalPrice +
    "€</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="2"></td>' +
    '<td colspan="2">SHIPPING PRICE</td>' +
    "<td>" +
    orderFound.shippingPrice +
    "€</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="2"></td>' +
    '<td colspan="2">TOTAL PRICE</td>' +
    "<td>" +
    orderFound.totalPrice +
    "€</td>" +
    "</tr>" +
    "</tfoot>" +
    "</table>" +
    "</main>" +
    '<div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">' +
    "<p" +
    'style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">' +
    "Page {{page}} of {{pages}}</p>" +
    "</div>";

  body.insertAdjacentHTML("beforeend", aux);

  sendInvoiceEmail(orderFound.userEmail, orderFound.orderCode, root.toString());
};
