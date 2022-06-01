import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { CLIENT_VERSION } from '../client-version';
import { AppService } from '../services/app.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  version = CLIENT_VERSION.version;
  timestamp: string;
  canInstall = false;
  subscriptions: Subscription[] = [];

  constructor(
    private appService: AppService,
    private projectService: ProjectService
  ) {
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
    this.subscriptions.push(
      this.appService.promptEventChange.subscribe(
        () => (this.canInstall = this.appService.shouldInstall())
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  install() {
    this.appService.installPWA();
  }
  app() {
    this.projectService.openLastViewed();
  }
}
