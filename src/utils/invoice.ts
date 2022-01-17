import {
  Debtor,
  Invoice,
  KeyValue,
  PersonPositions,
  SerialQROptions
} from './data';
import {
  parseDefinition,
  parseMultilineDefinition,
  parseMultilineOperationsDefinition,
  parseNumberDefinition
} from './definition-parser';

export function roundAndFormat(value: number) {
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function getLines(value: Invoice) {
  return value.personPositions.map((pp) => pp.person);
}

export function calculateInvoices(options: SerialQROptions): Invoice[] {
  const invoicesMap: KeyValue<Invoice> = {};
  const invoices: Invoice[] = [];

  options.dataFiles.forEach((dataFile) => {
    if (dataFile.content) {
      dataFile.content.forEach((content) => {
        const debtor: Debtor = {
          name: parseDefinition(options.debtor.name, content),
          address: options.debtor.address
            ? parseDefinition(options.debtor.address, content)
            : options.debtor.address,
          zipAndPlace: parseDefinition(options.debtor.zipAndPlace, content),
          country: 'CH'
        };
        const personPositions: PersonPositions = {
          person: content,
          positions: []
        };
        let totalForPerson = 0;
        dataFile.positions.forEach((positionDefinition) => {
          const amount = parseNumberDefinition(
            positionDefinition.amount,
            content
          );
          const designation = parseDefinition(
            positionDefinition.designation,
            content
          );
          const count = positionDefinition.count
            ? parseNumberDefinition(positionDefinition.count, content)
            : undefined;
          const totalAmount = count ? count * amount : amount;
          totalForPerson += totalAmount;
          personPositions.positions.push({
            amount: roundAndFormat(amount),
            designation,
            count: count ? roundAndFormat(count) : undefined,
            totalAmount: roundAndFormat(totalAmount)
          });
        });
        if (options.mergeSameCreditors && invoicesMap[JSON.stringify(debtor)]) {
          const invoice = invoicesMap[JSON.stringify(debtor)];
          invoice.personPositions.push(personPositions);
          invoice.toalAmount = roundAndFormat(
            parseFloat(invoice.toalAmount) + totalForPerson
          );
          const lines = getLines(invoice);
          invoice.title = parseMultilineDefinition(options.title, lines);
          invoice.textBeforeTable = parseMultilineOperationsDefinition(
            options.textBeforeTable,
            lines
          );
          invoice.textAfterTable = parseMultilineOperationsDefinition(
            options.textAfterTable,
            lines
          );
          invoice.message = parseMultilineDefinition(options.message, lines);
          invoice.customAddress = options.customAddress
            ? parseMultilineOperationsDefinition(options.customAddress, lines)
            : undefined;
          invoice.customHeading = options.customHeading
            ? parseMultilineOperationsDefinition(options.customHeading, lines)
            : undefined;
          invoice.textBeforeTable;
        } else {
          const customAddress = options.customAddress
            ? parseMultilineOperationsDefinition(options.customAddress, [
                content
              ])
            : undefined;
          const customHeading = options.customHeading
            ? parseMultilineOperationsDefinition(options.customHeading, [
                content
              ])
            : undefined;
          const invoice: Invoice = {
            debtor,
            personPositions: [personPositions],
            title: parseMultilineDefinition(options.title, [content]),
            textBeforeTable: parseMultilineOperationsDefinition(
              options.textBeforeTable,
              [content]
            ),
            textAfterTable: parseMultilineOperationsDefinition(
              options.textAfterTable,
              [content]
            ),
            toalAmount: roundAndFormat(totalForPerson),
            message: parseMultilineDefinition(options.message, [content]),
            customAddress,
            customHeading
          };
          invoicesMap[JSON.stringify(debtor)] = invoice;
          invoices.push(invoice);
        }
      });
    }
  });

  return invoices;
}
