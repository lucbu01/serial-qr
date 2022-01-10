import Dexie, { Table } from 'dexie';
import { SerialQRProject, SerialQrProjectMetadata } from './data';

export class SerialQRDB extends Dexie {
  projects!: Table<SerialQRProject, number>;
  metadata!: Table<SerialQrProjectMetadata, number>;

  constructor() {
    super('serial-qr');
    this.version(1).stores({
      projects: 'id',
      metadata: '++id, name'
    });
  }
}

export const db = new SerialQRDB();
