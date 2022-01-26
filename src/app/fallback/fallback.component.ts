import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-fallback',
  templateUrl: './fallback.component.html',
  styleUrls: ['./fallback.component.scss']
})
export class FallbackComponent implements OnInit {
  loading = true;
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    document.title = 'SerialQR - Serienbriefe mit QR-Rechnung';
    if (localStorage.getItem('serialqr.lastviewed')) {
      this.projectService.openLastViewed();
    } else {
      this.loading = false;
    }
  }

  app() {
    this.projectService.openLastViewed();
  }
}
