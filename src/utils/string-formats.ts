import { Debtor, QrInvoiceData } from './data';
import QRCode from 'qrcode';
import { mmToPx } from './units';

export function trimOrEmptyString(value?: string | number) {
  if (value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  } else {
    return `${value}`;
  }
}

export function clearAllWhitespaces(value: string) {
  return value.replace(' ', '');
}

export function printAddress(data?: Debtor) {
  if (data) {
    return `K
${trimOrEmptyString(data.name)}
${trimOrEmptyString(data.address)}
${trimOrEmptyString(data.zipAndPlace)}\n\n
${trimOrEmptyString(data.country)}`;
  } else {
    return '\n\n\n\n\n\n';
  }
}

export function formatInvoiceData(data: QrInvoiceData) {
  return `SPC
0200
1
${trimOrEmptyString(clearAllWhitespaces(data.creditor.iban))}
${printAddress(data.creditor)}
${printAddress(undefined)}
${trimOrEmptyString(data.amount)}
${trimOrEmptyString(data.currency)}
${printAddress(data.debtor)}
${data.refTyp}
${trimOrEmptyString(data.reference)}
${trimOrEmptyString(data.message)}
EPD\n\n\n`;
}

export async function getQrCodeSvgString(data: QrInvoiceData) {
  const invoiceData = formatInvoiceData(data);
  return await QRCode.toString(invoiceData, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    width: mmToPx(46)
  });
}

export function formatAddress(address: Debtor) {
  return `${address.name}\n${address.address ? `${address.address}\n` : ''}${
    address.zipAndPlace
  }`;
}

export function formatIBAN(value: string) {
  return value.replace(/.{1,4}/g, '$& ');
}
