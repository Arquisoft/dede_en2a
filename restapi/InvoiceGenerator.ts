const PDFGenerator = require("pdfkit");
const fs = require("fs");
const path = require("path");

class InvoiceGenerator {
  invoice: any;
  doc: any;
  constructor(invoice: any, doc: any) {
    this.invoice = invoice;
    this.doc = doc;
  }

  generateHeaders() {
    const shippingAddress = this.invoice.addresses.shipping;

    this.doc
      //.image("./dede_logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(10)
      .text("DeDe", 200, 50, { align: "right" })
      .text("Calle Valdes Salas 26", 200, 65, { align: "right" })
      .text("Oviedo, Asturias, 33008", 200, 80, { align: "right" })
      .moveDown();

    const beginningOfPage = 50;
    const endOfPage = 550;

    this.doc.moveTo(beginningOfPage, 250).lineTo(endOfPage, 250).stroke();
  }

  formatCurrency(cents: number) {
    return cents.toFixed(2) + "€";
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
  }

  generateCustomerInformation() {
    this.doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

    this.generateHr(185);

    const customerInformationTop = 200;

    this.doc
      .fontSize(10)
      .text("Invoice code:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(this.invoice.invoiceNumber, 150, customerInformationTop)
      .font("Helvetica")
      .text("Invoice Date:", 50, customerInformationTop + 15)
      .text(
        this.formatDate(this.invoice.dueDate),
        150,
        customerInformationTop + 15
      )
      .text("Total:", 50, customerInformationTop + 30)
      .text(
        this.formatCurrency(this.invoice.total),
        150,
        customerInformationTop + 30
      )

      .font("Helvetica-Bold")
      .text("", 300, customerInformationTop)
      .font("Helvetica")
      .text(
        this.invoice.addresses.shipping.name,
        300,
        customerInformationTop + 15
      )
      .text(
        this.invoice.addresses.shipping.address,
        300,
        customerInformationTop + 30
      )
      .moveDown();

    this.generateHr(252);
  }

  generateTableRow(
    y: any,
    item: any,
    description: any,
    unitCost: any,
    quantity: any,
    lineTotal: any
  ) {
    this.doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }

  generateTable() {
    let i;
    const invoiceTableTop = 330;

    this.doc.font("Helvetica-Bold");
    this.generateTableRow(
      invoiceTableTop,
      "Code",
      "Item",
      "Unit Cost",
      "Quantity",
      "Line Total"
    );
    this.generateHr(invoiceTableTop + 20);
    this.doc.font("Helvetica");

    for (i = 0; i < this.invoice.items.length; i++) {
      const item = this.invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        position,
        item.code,
        item.name,
        this.formatCurrency(item.price),
        item.stock,
        this.formatCurrency(item.price * item.stock)
      );

      this.generateHr(position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      subtotalPosition,
      "",
      "",
      "Subtotal",
      "",
      this.formatCurrency(this.invoice.subtotal)
    );

    const shippingPricePosition = subtotalPosition + 20;
    this.generateTableRow(
      shippingPricePosition,
      "",
      "",
      "Shipping price",
      "",
      this.formatCurrency(this.invoice.shippingPrice)
    );

    this.generateHr(shippingPricePosition + 20);

    const totalPricePosition = shippingPricePosition + 40;
    this.generateTableRow(
      totalPricePosition,
      "",
      "",
      "Total price",
      "",
      this.formatCurrency(this.invoice.total)
    );
  }

  generateFooter() {
    this.doc.fontSize(10).text(`Thank you for buying in DeDe. `, 50, 700, {
      align: "center",
    });
  }

  generateHr(y: number) {
    this.doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  generate() {
    this.generateHeaders();
    this.doc.moveDown();
    this.generateCustomerInformation();
    this.generateTable();
    this.generateFooter();
    return this.doc;
  }
}

module.exports = InvoiceGenerator;
