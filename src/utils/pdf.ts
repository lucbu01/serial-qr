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
import { scissors, swisscross } from './svg';
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

export async function drawQrInvoice(
  doc: jsPDF,
  data: QrInvoiceData,
  drawScissors: boolean
) {
  const lineHeightFactor = doc.getLineHeightFactor();
  data.creditor.iban = data.creditor.iban.replace(' ', '');
  if (drawScissors) {
    const oldColor = doc.getDrawColor();
    doc.setDrawColor('#000000');
    doc.setLineDashPattern([1], 0.5);
    doc.setLineWidth(ptToMm(0.5));
    doc.line(0, A4.height - 105, A4.width, A4.height - 105);
    await addSvg(doc, scissors(), 7, A4.height - 106.8, 6, 3.6);
    doc.line(62, A4.height - 105, 62, A4.height);
    await addSvg(doc, scissors(true), 60.2, A4.height - 16, 3.6, 6);
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(oldColor);
  }
  await drawQrCode(doc, data);
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(11);
  doc.text(lang.receipt, 5, A4.height - 100 + ptToMm(11));
  doc.text(lang.paymentPart, 67, A4.height - 100 + ptToMm(11));
  let actualY = A4.height - 93 + ptToMm(6) * lineHeightFactor;
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
  doc.text(lang.account, 5, actualY);
  actualY += ptToMm(8) * lineHeightFactor;
  doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
  doc.text(formatIBAN(data.creditor.iban), 5, actualY);
  actualY += ptToMm(8) * lineHeightFactor;
  actualY = drawFormattedText(
    doc,
    [{ insert: formatAddress(data.creditor) }],
    5,
    actualY,
    52,
    8
  ).y;
  actualY += ptToMm(14) * lineHeightFactor;
  if (data.reference) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
    doc.text(lang.reference, 5, actualY);
    actualY += ptToMm(8) * lineHeightFactor;
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
    doc.text(formatIBAN(data.reference), 5, actualY);
    actualY += ptToMm(14) * lineHeightFactor;
  }
  if (data.debtor) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
    doc.text(lang.payableBy, 5, actualY);
    actualY += ptToMm(8) * lineHeightFactor;
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(8);
    actualY = drawFormattedText(
      doc,
      [{ insert: formatAddress(data.debtor) }],
      5,
      actualY,
      52,
      8
    ).y;
  }
  actualY = A4.height - 37 + ptToMm(8) * lineHeightFactor;
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(6);
  doc.text(lang.acceptancePoint, 57, A4.height - 23 + ptToMm(6), {
    align: 'right'
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
  actualY += ptToMm(10) * lineHeightFactor;
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

  actualY = A4.height - 100 + ptToMm(9);
  doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
  doc.text(lang.account, 118, actualY);
  actualY += ptToMm(10) * lineHeightFactor;
  doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
  doc.text(formatIBAN(data.creditor.iban), 118, actualY);
  actualY += ptToMm(10) * lineHeightFactor;
  actualY = drawFormattedText(
    doc,
    [{ insert: formatAddress(data.creditor) }],
    118,
    actualY,
    68,
    10
  ).y;
  actualY += ptToMm(18) * lineHeightFactor;
  if (data.reference) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.reference, 118, actualY);
    actualY += ptToMm(10) * lineHeightFactor;
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    doc.text(formatIBAN(data.reference), 118, actualY);
    actualY += ptToMm(18) * lineHeightFactor;
  }
  if (data.message || data.invoiceInformation) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.additionalInformation, 118, actualY);
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    if (data.message) {
      actualY += ptToMm(10) * lineHeightFactor;
      doc.text(data.message, 118, actualY);
    }
    if (data.invoiceInformation) {
      actualY += ptToMm(10) * lineHeightFactor;
      actualY = drawFormattedText(
        doc,
        [{ insert: data.invoiceInformation }],
        118,
        actualY,
        68,
        10
      ).y;
    }
    actualY += ptToMm(18) * lineHeightFactor;
  }
  if (data.debtor) {
    doc.setFont('Helvetica', 'normal', 'bold').setFontSize(8);
    doc.text(lang.payableBy, 118, actualY);
    actualY += ptToMm(10) * lineHeightFactor;
    doc.setFont('Helvetica', 'normal', 'normal').setFontSize(10);
    actualY = drawFormattedText(
      doc,
      [{ insert: formatAddress(data.debtor) }],
      118,
      actualY,
      68,
      10
    ).y;
  }
}

export function measureFormattedText(
  doc: jsPDF,
  delta: Operation[],
  maxWidth: number,
  fontSize: number
) {
  return drawFormattedText(doc, delta, 0, 0, maxWidth, fontSize, false);
}

export function drawFormattedText(
  doc: jsPDF,
  delta: Operation[],
  x: number,
  y: number,
  width: number,
  fontSize: number,
  shouldWrite = true
) {
  doc.setFontSize(fontSize);
  let actualX = x;
  let actualY = y;
  let endX = x;
  for (const op of delta) {
    if (op.insert) {
      let attributes = op.attributes;
      if (!attributes) {
        attributes = {};
      }
      const lineHeightFactor = doc.getLineHeightFactor(),
        text = op.insert as string,
        font = 'Helvetica',
        fontStyle = attributes['italic'] ? 'italic' : 'normal',
        fontWidth = attributes['bold'] ? 'bold' : 'normal';
      doc.setFont(font, fontStyle, fontWidth);
      text.split('\n').forEach((line, index, array) => {
        let scale = { w: 0, h: ptToMm(fontSize) };
        if (line !== '') {
          line = doc
            .splitTextToSize(line, width, {})
            .forEach((part: string, i: number, a: string[]) => {
              scale = doc.getTextDimensions(part);
              if (shouldWrite) {
                doc.text(part, actualX, actualY, { maxWidth: width });
              }
              if (i < a.length - 1) {
                actualX = x;
                actualY += scale.h * lineHeightFactor;
              }
            });
        }
        if (index < array.length - 1) {
          actualX = x;
          actualY += scale.h * lineHeightFactor;
          if (actualX + scale.w > endX) {
            endX = actualX + scale.w;
          }
        } else {
          actualX += scale.w;
          if (actualX > endX) {
            endX = actualX;
          }
        }
      });
    }
  }
  return { x: endX, y: actualY };
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

export async function drawHeading(
  doc: jsPDF,
  options: SerialQROptions,
  invoice: Invoice
) {
  let result = { x: 0, y: 0 };
  const heading = invoice.customHeading
    ? invoice.customHeading
    : [{ insert: formatAddress(options.creditor) }];
  const headingWidth = measureFormattedText(
    doc,
    heading,
    80,
    options.headingSize
  ).x;
  const headingLocation = options.headingLocation;
  const logoLocation = options.logo ? options.logo.location : undefined;
  let [x, y] = [
    headingLocation.includes('left')
      ? options.margin.left
      : A4.width - options.margin.left - headingWidth,
    options.margin.top + ptToMm(options.headingSize)
  ];
  if (options.logo) {
    const logo = await drawLogo(
      options,
      doc,
      measureFormattedText(doc, heading, 80, options.headingSize).x
    );
    if (headingLocation === logoLocation) {
      y = logo.y + logo.height + 1;
    } else if (headingLocation === 'logo_left' && logoLocation === 'right') {
      x = logo.x - 1 - headingWidth;
    } else if (headingLocation === 'logo_right' && logoLocation === 'left') {
      x = logo.x + logo.width + 1;
    }
  }
  result = drawFormattedText(doc, heading, x, y, 80, options.headingSize);
  return result;
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

  const headingY = (await drawHeading(doc, options, invoice)).y;
  const addressY = drawAddress(doc, options, invoice).y;
  actualY = headingY > addressY ? headingY : addressY;

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
  ).y;

  actualY = drawFormattedText(
    doc,
    [{ attributes: { bold: true }, insert: `\n\n${invoice.title}\n\n` }],
    options.margin.left,
    actualY,
    standardWidth,
    options.titleSize
  ).y;

  actualY = drawFormattedTextAndEndWithNewLine(
    doc,
    invoice.textBeforeTable,
    options.margin.left,
    actualY,
    standardWidth,
    options.textSize
  ).y;

  actualY = drawInvoiceTable(doc, options, invoice, actualY);

  actualY = drawFormattedText(
    doc,
    invoice.textAfterTable,
    options.margin.left,
    actualY,
    standardWidth,
    options.textSize
  ).y;

  if (actualY + 105 > A4.height) {
    doc.addPage().setPage(doc.internal.pages.length - 1);
    actualY = (await drawHeading(doc, options, invoice)).y;
  }

  await drawQrInvoice(
    doc,
    {
      creditor: options.creditor,
      debtor: invoice.debtor,
      currency: 'CHF',
      refTyp: 'NON',
      amount: invoice.toalAmount,
      message: invoice.message /*,
    invoiceInformation:
      '//S1/10/10201409/11/170309/20/14000000/30/106017086/31/210122',
    reference: 'RF18539007547034'*/
    },
    options.print === 'pdf'
  );

  if (index < invoices.length - 1) {
    doc.addPage().setPage(doc.internal.pages.length - 1);
  }
}

export async function drawLogo(
  options: SerialQROptions,
  doc: jsPDF,
  headingWidth: number
) {
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

    const w = options.logo.width;
    const h = options.logo.height;
    const correctionX = options.logo.correctionX ? options.logo.correctionX : 0;
    const correctionY = options.logo.correctionY ? options.logo.correctionY : 0;
    const y = options.margin.top - correctionY;
    let x = 0;
    if (options.logo.location === 'left') {
      if (options.headingLocation === 'logo_left') {
        x = options.margin.left + headingWidth + 1 - correctionX;
      } else {
        x = options.margin.left - correctionX;
      }
    } else {
      if (options.headingLocation === 'logo_right') {
        x =
          A4.width - options.margin.right - headingWidth - 1 - w + correctionX;
      } else {
        x = A4.width - options.margin.right - w - correctionX;
      }
    }

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
    return { x, y, width: w, height: h };
  }
  return { x: 0, y: 0, width: 0, height: 0 };
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
      'SerialQR - ein kostenloses und Werbefreies Tool für das Erstellen von Serienbriefen mit QR Rechnung - serialqr.ch',
    subject: 'QR Rechnungen'
  });

  return doc.output('dataurlstring', {
    filename: 'SerialQR_Rechnungen.pdf'
  });
}

export async function generateFull(options: SerialQROptions, download = false) {
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
      'SerialQR - ein kostenloses und Werbefreies Tool für das Erstellen von Serienbriefen mit QR Rechnung - serialqr.ch',
    subject: 'QR Rechnungen'
  });

  if (download) {
    doc.save('SerialQR_Rechnungen.pdf');
  }

  return doc.output('dataurlstring', {
    filename: 'SerialQR_Rechnungen.pdf'
  });
}
