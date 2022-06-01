import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../services/app.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-fallback',
  templateUrl: './fallback.component.html',
  styleUrls: ['./fallback.component.scss']
})
export class FallbackComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loading = true;
  canInstall = false;

  constructor(
    private appService: AppService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    document.title = 'SerialQR - Serienbriefe mit QR-Rechnung';
    if (localStorage.getItem('serialqr.lastviewed')) {
      this.projectService.openLastViewed();
    } else {
      this.loading = false;
    }
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
