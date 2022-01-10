import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-fallback',
  templateUrl: './fallback.component.html',
  styleUrls: ['./fallback.component.scss']
})
export class FallbackComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    setTimeout(() => this.projectService.openLastViewed(), 500);
  }
}
