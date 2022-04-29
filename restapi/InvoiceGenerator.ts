const PDFGenerator = require("pdfkit");
const fs = require("fs");
const path = require("path");

class InvoiceGenerator {
  invoice: any;
  constructor(invoice: any) {
    this.invoice = invoice;
  }

  generateHeaders(doc: any) {
    const shippingAddress = this.invoice.addresses.shipping;

    doc
      //.image("./dede_logo.png", 50, 45, { width: 50 })
      //.fillColor("#444444")
      .fontSize(10)
      .text("DeDe", 200, 50, { align: "right" })
      .text("Calle Valdes Salas 26", 200, 65, { align: "right" })
      .text("Oviedo, Asturias, 33008", 200, 80, { align: "right" })
      .moveDown();

    const beginningOfPage = 50;
    const endOfPage = 550;

    doc.moveTo(beginningOfPage, 250).lineTo(endOfPage, 250).stroke();
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

  generateCustomerInformation(doc: any) {
    doc./*fillColor("#444444").*/fontSize(20).text("Invoice", 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
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

    this.generateHr(doc, 252);
  }

  generateTableRow(
    doc: any,
    y: any,
    item: any,
    description: any,
    unitCost: any,
    quantity: any,
    lineTotal: any
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }

  generateTable(doc: any) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    this.generateTableRow(
      doc,
      invoiceTableTop,
      "Code",
      "Item",
      "Unit Cost",
      "Quantity",
      "Line Total"
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < this.invoice.items.length; i++) {
      const item = this.invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.code,
        item.name,
        this.formatCurrency(item.price),
        item.stock,
        this.formatCurrency(item.price * item.stock)
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "Subtotal",
      "",
      this.formatCurrency(this.invoice.subtotal)
    );

    const shippingPricePosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      shippingPricePosition,
      "",
      "",
      "Shipping price",
      "",
      this.formatCurrency(this.invoice.shippingPrice)
    );

    this.generateHr(doc, shippingPricePosition + 20);

    const totalPricePosition = shippingPricePosition + 40;
    this.generateTableRow(
      doc,
      totalPricePosition,
      "",
      "",
      "Total price",
      "",
      this.formatCurrency(this.invoice.total)
    );
  }

  generateFooter(doc: any) {
    doc.fontSize(10).text(`Thank you for buying in DeDe. `, 50, 700, {
      align: "center",
    });
  }

  generateHr(doc: any, y: number) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  generate(f: any) {
    /*this.generateHeaders(f);
    f.moveDown();*/
    this.generateCustomerInformation(f);
    this.generateTable(f);
    this.generateFooter(f);
    return f;
    /*
    try {
      let doc = new PDFGenerator();

      const fileName = this.invoice.invoiceNumber + ".pdf";

      // pipe to a writable stream which would save the result into the same directory
      doc.pipe(
        fs.createWriteStream(path.join(__dirname, "public", "pdf", fileName))
      );

      this.generateHeaders(f);
      doc.moveDown();
      this.generateCustomerInformation(f);
      this.generateTable(f);
      this.generateFooter(f);
        doc.
      // write out file
      theOutput.end();
    } catch (e) {
      console.log(e);
    }*/
  }
}

module.exports = InvoiceGenerator;
