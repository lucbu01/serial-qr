import { map } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { KeyValue } from './data';

export function readExcel(file: File): Promise<KeyValue<string>[]> {
  return firstValueFrom(
    read<string>((reader) => reader.readAsBinaryString(file)).pipe(
      map((result) => {
        const wb: XLSX.WorkBook = XLSX.read(result, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data: { [key: string]: string }[] = XLSX.utils.sheet_to_json(ws);

        return data;
      })
    )
  );
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return firstValueFrom(read<string>((reader) => reader.readAsDataURL(file)));
}

export function readFileAsText(file: File): Promise<string> {
  return firstValueFrom(read<string>((reader) => reader.readAsText(file)));
}

export function read<T>(
  readerFunc: (_reader: FileReader) => void
): Observable<T> {
  return new Observable<T>((subscriber) => {
    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        subscriber.next(e.target.result);
        subscriber.complete();
      };

      readerFunc(reader);
    } catch (e) {
      subscriber.error(e);
      subscriber.complete();
    }
  });
}
