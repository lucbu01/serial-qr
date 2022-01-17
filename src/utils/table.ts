import jsPDF from 'jspdf';
import autoTable, {
  ColumnInput,
  RowInput,
  Styles,
  Table
} from 'jspdf-autotable';
import { Invoice, SerialQROptions, SerialQRTableSectionTemplate } from './data';

function getColumns(options: SerialQROptions, invoice: Invoice) {
  const hasCount =
    invoice.personPositions.find(
      (pp) =>
        pp.positions.find((pos) => pos.count && parseFloat(pos.count) > 1) !=
        undefined
    ) != undefined;
  const columns: ColumnInput[] = [];
  if (options.tableTemplate.showPositionNr) {
    columns.push({ header: 'Pos.', dataKey: 'position' });
  }
  columns.push({
    header: options.tableTemplate.designation,
    dataKey: 'designation'
  });
  if (hasCount) {
    columns.push({ header: 'Anzahl', dataKey: 'count' });
    columns.push({ header: 'Betrag', dataKey: 'amount' });
    columns.push({ dataKey: 'currency', footer: 'CHF' });
    columns.push({
      header: 'Total',
      dataKey: 'totalAmount',
      footer: invoice.toalAmount
    });
  } else {
    columns.push({ dataKey: 'currency', footer: 'CHF' });
    columns.push({
      header: 'Betrag',
      dataKey: 'totalAmount',
      footer: invoice.toalAmount
    });
  }
  return columns;
}

function getBody(invoice: Invoice) {
  const body: RowInput[] = [];
  let positionNr = 10;
  invoice.personPositions.forEach((pp) => {
    pp.positions.forEach((position) => {
      const row: RowInput = {
        position: positionNr,
        designation: position.designation,
        count: position.count ? position.count : '1.00',
        amount: position.amount,
        currency: 'CHF',
        totalAmount: position.totalAmount
      };
      body.push(row);
      positionNr += 10;
    });
  });
  return body;
}

function styles(options: SerialQRTableSectionTemplate): Partial<Styles> {
  return {
    fontStyle: options.bold
      ? options.italic
        ? 'bolditalic'
        : 'bold'
      : options.italic
      ? 'italic'
      : 'normal',
    fontSize: options.size,
    fillColor: options.background,
    textColor: '#000000'
  };
}

export function drawInvoiceTable(
  doc: jsPDF,
  options: SerialQROptions,
  invoice: Invoice,
  y: number
) {
  const columns = getColumns(options, invoice);
  const body = getBody(invoice);
  let table: Table | undefined = undefined;
  autoTable(doc, {
    theme: options.tableTemplate.striped ? 'striped' : 'plain',
    columns,
    body,
    startY: y,
    styles: {
      textColor: '#000000',
      halign: 'right',
      cellPadding: options.tableTemplate.padding
    },
    columnStyles: {
      position: { halign: 'left', cellWidth: 15 },
      designation: { halign: 'left' },
      count: { cellWidth: 20 },
      amount: { cellWidth: 20 },
      currency: { cellWidth: 20 },
      totalAmount: { cellWidth: 20 }
    },
    headStyles: styles(options.tableTemplate.header),
    bodyStyles: styles(options.tableTemplate.body),
    footStyles: styles(options.tableTemplate.footer),
    showFoot: options.tableTemplate.showFooter,
    margin: {
      left: options.margin.left,
      right: options.margin.right
    },
    willDrawCell: (data) => {
      table = data.table;
      if (['head', 'foot'].includes(data.row.section)) {
        if (
          ['designation', 'position'].includes(data.column.dataKey as string)
        ) {
          data.cell.styles.halign = 'left';
        }
      }
    }
  });
  if (table && (table as Table).finalY) {
    return ((table as Table).finalY as number) + 6;
  }
  return y;
}
