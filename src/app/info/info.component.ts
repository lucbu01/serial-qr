import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { CLIENT_VERSION } from '../client-version';

@Component({
  selector: 'qr-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  version = CLIENT_VERSION.version;
  timestamp: string;

  constructor() {
    try {
      this.timestamp = DateTime.fromISO(
        CLIENT_VERSION.timestamp
      ).toLocaleString({
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      this.timestamp = CLIENT_VERSION.timestamp;
    }
  }

  ngOnInit(): void {
    document.title = `Anleitungen, Hilfe & Infos - SerialQR`;
  }
}
