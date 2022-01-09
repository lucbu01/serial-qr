import jsPDF from 'jspdf';
import 'svg2pdf.js';
import {
  de,
  Invoice,
  Operation,
  QrInvoiceData,
  QRInvoiceTranslation,
  SerialQROptions
} from './data';
import { swisscross } from './svg';
import { A4, couvertFormats, ptToMm } from './units';
import {
  formatAddress,
  formatIBAN,
  getQrCodeSvgString
} from './string-formats';
import { calculateInvoices } from './invoice';
import { DateTime } from 'luxon';
import { drawInvoiceTable } from './table';

const lang: QRInvoiceTranslation = de;

export async function addSvg(
  doc: jsPDF,
  svg: string | Element,
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (typeof svg === 'string') {
    const div = document.createElement('div');
    div.innerHTML = svg;
    svg = div.getElementsByTagName('svg')[0];
  }
  await doc.svg(svg, {
    x,
    y,
    height,
    width
  });
}

export async function drawQrCode(doc: jsPDF, data: QrInvoiceData) {
  const svgString = await getQrCodeSvgString(data);
  await addSvg(doc, svgString, 67, A4.height - 88, 46, 46);
  await addSvg(doc, swisscross, 86.5, A4.height - 68.5, 7, 7);
}

export async function drawQrInvoice(doc: jsPDF, data: QrInvoiceData) {
  await drawQrCode(doc, data);
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(11);
  doc.text(lang.receipt, 5, A4.height - 100, { baseline: 'top' });
  doc.text(lang.paymentPart, 67, A4.height - 100, {
    baseline: 'top'
  });
  let actualY = A4.height - 93 + ptToMm(6) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
  doc.text(lang.account, 5, actualY);
  actualY += ptToMm(8) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
  doc.text(formatIBAN(data.creditor.iban), 5, actualY);
  actualY += ptToMm(8) * doc.getLineHeightFactor();
  actualY = drawFormattedText(
    doc,
    [{ insert: formatAddress(data.creditor) }],
    5,
    actualY,
    52,
    8
  );
  actualY += ptToMm(14) * doc.getLineHeightFactor();
  if (data.reference) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
    doc.text(lang.reference, 5, actualY);
    actualY += ptToMm(8) * doc.getLineHeightFactor();
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
    doc.text(formatIBAN(data.reference), 5, actualY);
    actualY += ptToMm(14) * doc.getLineHeightFactor();
  }
  if (data.debtor) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
    doc.text(lang.payableBy, 5, actualY);
    actualY += ptToMm(8) * doc.getLineHeightFactor();
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
    actualY = drawFormattedText(
      doc,
      [{ insert: formatAddress(data.debtor) }],
      5,
      actualY,
      52,
      8
    );
  }
  actualY = A4.height - 37 + ptToMm(8) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
  doc.text(lang.acceptancePoint, 57, A4.height - 23, {
    align: 'right',
    baseline: 'top'
  });
  doc.text(lang.currency, 5, actualY);
  if (data.amount) {
    doc.text(lang.amount, 31, actualY);
  }
  doc.setFontSize(8);
  doc.text(lang.currency, 67, actualY);
  if (data.amount) {
    doc.text(lang.amount, 90, actualY);
  }
  actualY += ptToMm(10) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'normal');
  doc.text(data.currency, 5, actualY);
  if (data.amount) {
    doc.text(data.amount, 31, actualY);
  }
  doc.setFontSize(10);
  doc.text(data.currency, 67, actualY);
  if (data.amount) {
    doc.text(data.amount, 90, actualY);
  }

  actualY = A4.height - 93 - ptToMm(11) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
  doc.text(lang.account, 118, actualY);
  actualY += ptToMm(10) * doc.getLineHeightFactor();
  doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
  doc.text(formatIBAN(data.creditor.iban), 118, actualY);
  actualY += ptToMm(10) * doc.getLineHeightFactor();
  actualY = drawFormattedText(
    doc,
    [{ insert: formatAddress(data.creditor) }],
    118,
    actualY,
    68,
    10
  );
  actualY += ptToMm(18) * doc.getLineHeightFactor();
  if (data.reference) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.reference, 118, actualY);
    actualY += ptToMm(10) * doc.getLineHeightFactor();
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    doc.text(formatIBAN(data.reference), 118, actualY);
    actualY += ptToMm(18) * doc.getLineHeightFactor();
  }
  if (data.message || data.invoiceInformation) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.additionalInformation, 118, actualY);
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    if (data.message) {
      actualY += ptToMm(10) * doc.getLineHeightFactor();
      doc.text(data.message, 118, actualY);
    }
    if (data.invoiceInformation) {
      actualY += ptToMm(10) * doc.getLineHeightFactor();
      actualY = drawFormattedText(
        doc,
        [{ insert: data.invoiceInformation }],
        118,
        actualY,
        68,
        10
      );
    }
    actualY += ptToMm(18) * doc.getLineHeightFactor();
  }
  if (data.debtor) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.payableBy, 118, actualY);
    actualY += ptToMm(10) * doc.getLineHeightFactor();
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    actualY = drawFormattedText(
      doc,
      [{ insert: formatAddress(data.debtor) }],
      118,
      actualY,
      68,
      10
    );
  }
}

export function drawFormattedText(
  doc: jsPDF,
  delta: Operation[],
  x: number,
  y: number,
  width: number,
  fontSize: number
) {
  doc.setFontSize(fontSize);
  let actualX = x;
  let actualY = y;
  for (const op of delta) {
    if (op.insert) {
      let attributes = op.attributes;
      if (!attributes) {
        attributes = {};
      }
      const font = 'Helvetica';
      const fontStyle = attributes['italic'] ? 'italic' : 'normal';
      const fontWidth = attributes['bold'] ? 'bold' : 'normal';
      doc.setFont(font, fontStyle, fontWidth);
      const text = op.insert as string;
      text.split('\n').forEach((line, index, array) => {
        let scale = { w: 0, h: ptToMm(fontSize) };
        if (line !== '') {
          line = doc
            .splitTextToSize(line, width, {})
            .forEach((part: string, i: number, a: string[]) => {
              scale = doc.getTextDimensions(part);
              doc.text(part, actualX, actualY, { maxWidth: width });
              if (i < a.length - 1) {
                actualX = x;
                actualY += scale.h * doc.getLineHeightFactor();
              }
            });
        }
        if (index < array.length - 1) {
          actualX = x;
          actualY += scale.h * doc.getLineHeightFactor();
        } else {
          actualX += scale.w;
        }
      });
    }
  }
  return actualY;
}

export function drawFormattedTextAndEndWithNewLine(
  doc: jsPDF,
  delta: Operation[],
  x: number,
  y: number,
  width: number,
  fontSize: number
) {
  const last = delta[delta.length - 1].insert as string | undefined;
  if (!last || !last.endsWith('\n')) {
    delta.push({ insert: '\n' });
  }
  return drawFormattedText(doc, delta, x, y, width, fontSize);
}

export function drawHeading(
  doc: jsPDF,
  options: SerialQROptions,
  invoice: Invoice
) {
  const heading = invoice.customHeading
    ? invoice.customHeading
    : [{ insert: formatAddress(options.creditor) }];
  return drawFormattedText(
    doc,
    heading,
    options.margin.left,
    options.margin.top + 30 + 5,
    80,
    options.headingSize
  );
}

export function drawAddress(
  doc: jsPDF,
  options: SerialQROptions,
  invoice: Invoice
) {
  const couvert = couvertFormats[options.addressLocation];

  const x =
    options.addressLocation == 'left'
      ? options.margin.left
      : A4.width - couvert.width - couvert.right + 20;
  const y = A4.height / 2 - couvert.height - couvert.bottom + 20;

  const address = invoice.customAddress
    ? invoice.customAddress
    : [{ insert: formatAddress(invoice.debtor) }];
  return drawFormattedText(doc, address, x, y, 80, options.addressSize);
}

export async function drawInvoice(
  doc: jsPDF,
  options: SerialQROptions,
  invoice: Invoice,
  index: number,
  invoices: Invoice[]
) {
  let actualY = 0;
  const standardWidth = A4.width - options.margin.left - options.margin.right;

  await drawLogo(options, doc);

  actualY = drawHeading(doc, options, invoice);

  actualY = drawAddress(doc, options, invoice);

  const month =
    options.dateFormat === 'long'
      ? options.dateFormat
      : options.dateFormat === 'short'
      ? '2-digit'
      : 'short';
  actualY = drawFormattedText(
    doc,
    [
      {
        insert: `${options.place}, ${DateTime.now().toLocaleString({
          month,
          day: 'numeric',
          year: 'numeric'
        })}`
      }
    ],
    options.margin.left,
    actualY + ptToMm(2 * options.textSize) * doc.getLineHeightFactor(),
    standardWidth,
    options.textSize
  );

  actualY = drawFormattedText(
    doc,
    [{ attributes: { bold: true }, insert: `\n\n${invoice.title}\n\n` }],
    options.margin.left,
    actualY,
    standardWidth,
    options.titleSize
  );

  actualY = drawFormattedTextAndEndWithNewLine(
    doc,
    invoice.textBeforeTable,
    options.margin.left,
    actualY,
    standardWidth,
    options.textSize
  );

  actualY = drawInvoiceTable(doc, options, invoice, actualY);

  actualY = drawFormattedText(
    doc,
    invoice.textAfterTable,
    options.margin.left,
    actualY,
    standardWidth,
    options.textSize
  );

  if (actualY + 105 > A4.height) {
    doc.addPage().setPage(doc.internal.pages.length - 1);
  }

  await drawQrInvoice(doc, {
    creditor: options.creditor,
    debtor: invoice.debtor,
    currency: 'CHF',
    refTyp: 'NON',
    amount: invoice.toalAmount,
    message: options.message,
    invoiceInformation:
      '//S1/10/10201409/11/170309/20/14000000/30/106017086/31/210122',
    reference: 'RF18539007547034'
  });

  if (index < invoices.length - 1) {
    doc.addPage().setPage(doc.internal.pages.length - 1);
  }
}

export async function drawLogo(options: SerialQROptions, doc: jsPDF) {
  if (options.logo) {
    const filename = options.logo.src;
    let filetype: 'svg' | 'jpeg' | 'png' | undefined;
    if (filename.endsWith('.svg')) {
      filetype = 'svg';
    } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      filetype = 'jpeg';
    } else if (filename.endsWith('.png')) {
      filetype = 'png';
    }

    const correctionX = options.logo.correctionX ? options.logo.correctionX : 0;
    const correctionY = options.logo.correctionY ? options.logo.correctionY : 0;
    const x = options.margin.left - correctionX;
    const y = options.margin.top - correctionY;
    const w = options.logo.width;
    const h = options.logo.height;

    if (options.logo.content) {
      if (filetype === 'svg') {
        await addSvg(doc, options.logo.content, x, y, w, h);
      } else if (filetype) {
        doc.addImage(options.logo.content, filetype, x, y, w, h);
      }
    } else if (filetype && filetype != 'svg') {
      const img = document.createElement('img');
      img.src = options.logo.src;
      doc.addImage(img, filetype, x, y, w, h);
    }
  }
}

export async function generatePreview(options: SerialQROptions) {
  const doc = new jsPDF({
    orientation: 'p',
    format: 'a4',
    unit: 'mm'
  });

  doc.setFont('Helvetica');

  const invoices = calculateInvoices(options);
  if (invoices.length > 0) {
    await drawInvoice(doc, options, invoices[0], 0, [invoices[0]]);
  }

  doc.setProperties({
    title: options.title,
    author: options.creditor.name,
    creator:
      'SerialQR - ein kostenloses und Werbefreies Tool für das Erstellen von Serienbriefen mit QR Rechnung - qr.lucbu.ch',
    subject: 'QR Rechnungen'
  });

  return doc.output('dataurlstring', {
    filename: 'SerialQR_Rechnungen.pdf'
  });
}

export async function generateFull(options: SerialQROptions) {
  const doc = new jsPDF({
    orientation: 'p',
    format: 'a4',
    unit: 'mm'
  });

  doc.setFont('Helvetica');

  const invoices = calculateInvoices(options);
  for (let index = 0; index < invoices.length; index++) {
    const invoice = invoices[index];
    await drawInvoice(doc, options, invoice, index, invoices);
  }

  doc.setProperties({
    title: options.title,
    author: options.creditor.name,
    creator:
      'SerialQR - ein kostenloses und Werbefreies Tool für das Erstellen von Serienbriefen mit QR Rechnung - qr.lucbu.ch',
    subject: 'QR Rechnungen'
  });

  return doc.output('dataurlstring', {
    filename: 'SerialQR_Rechnungen.pdf'
  });
}
