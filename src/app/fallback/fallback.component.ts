import { AfterViewInit, Component } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-fallback',
  templateUrl: './fallback.component.html',
  styleUrls: ['./fallback.component.scss']
})
export class FallbackComponent implements AfterViewInit {
  constructor(private projectService: ProjectService) {}

  ngAfterViewInit(): void {
    this.projectService.openLastViewed();
  }
}
