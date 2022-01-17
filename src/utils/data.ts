export interface Debtor {
  name: string;
  address?: string;
  zipAndPlace: string;
  country: 'CH';
}

export interface Creditor extends Debtor {
  iban: string;
}

export interface QrInvoiceData {
  creditor: Creditor;
  debtor?: Debtor;
  amount?: string;
  currency: 'CHF' | 'EUR';
  refTyp: 'QRR' | 'SCOR' | 'NON';
  reference?: string;
  message?: string;
  invoiceInformation?: string;
}

export const de = {
  paymentPart: 'Zahlteil',
  account: 'Konto / Zahlbar an',
  reference: 'Referenz',
  additionalInformation: 'Zusätzliche Informationen',
  furtherInformation: 'Weitere Informationen',
  currency: 'Währung',
  amount: 'Betrag',
  receipt: 'Empfangsschein',
  acceptancePoint: 'Annahmestelle',
  seperateBeforePayingIn: 'Vor der Einzahlung abzutrennen',
  payableBy: 'Zahlbar durch',
  payableByNameAddress: 'Zahlbar durch (Name/Adresse)',
  inFovourOf: 'Zugunsten'
};

export type QRInvoiceTranslation = typeof de;

export interface AttributeMap {
  [key: string]: any;
}

export interface Operation {
  insert?: string | object;
  delete?: number;
  retain?: number;
  attributes?: AttributeMap;
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SerialQRPosition {
  designation: string;
  amount: string;
  count?: string;
}

export interface SerialQRDataFile {
  src: string;
  content?: KeyValue<string>[];
  positions: SerialQRPosition[];
}

export interface SerialQRLogo {
  src: string;
  content?: string;
  width: number;
  height: number;
  location: 'left' | 'right';
  correctionX?: number;
  correctionY?: number;
}

export interface SerialQRTableSectionTemplate {
  size: number;
  bold: boolean;
  italic: boolean;
  background: string;
}

export interface SerialQRTableTemplate {
  header: SerialQRTableSectionTemplate;
  body: SerialQRTableSectionTemplate;
  footer: SerialQRTableSectionTemplate;
  striped: boolean;
  showFooter: boolean;
  showLines: boolean;
  showPositionNr: boolean;
  padding: Margin;
  designation: string;
}

export interface SerialQROptions {
  print: 'paper' | 'pdf';
  margin: Margin;
  mergeSameCreditors: boolean;
  creditor: Creditor;
  debtor: Debtor;
  customAddress?: Operation[];
  addressLocation: 'left' | 'right' | 'right_new';
  addressSize: number;
  showSenderAddress: boolean;
  logo?: SerialQRLogo;
  customHeading?: Operation[];
  headingLocation: 'left' | 'right' | 'logo_left' | 'logo_right';
  headingSize: number;
  place: string;
  date?: Date;
  dateFormat: 'short' | 'medium' | 'long';
  title: string;
  titleSize: number;
  textSize: number;
  textBeforeTable: Operation[];
  dataFiles: SerialQRDataFile[];
  tableTemplate: SerialQRTableTemplate;
  textAfterTable: Operation[];
  message: string;
}

export interface SerialQrProjectMetadata {
  id?: number;
  name: string;
}

export interface SerialQRProject {
  id: number;
  serialQRVersion: number;
  metadata: SerialQrProjectMetadata;
  options: SerialQROptions;
}

export interface KeyValue<T> {
  [key: string]: T;
}

export interface Position {
  amount: string;
  count?: string;
  designation: string;
  totalAmount: string;
}

export interface PersonPositions {
  person: KeyValue<string>;
  positions: Position[];
}

export interface Invoice {
  debtor: Debtor;
  customAddress?: Operation[];
  customHeading?: Operation[];
  title: string;
  personPositions: PersonPositions[];
  textAfterTable: Operation[];
  textBeforeTable: Operation[];
  toalAmount: string;
  message: string;
}
