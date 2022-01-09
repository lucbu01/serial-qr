import { Component, OnInit } from '@angular/core';
import { generateFull, generatePreview } from 'src/utils/pdf';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  pdf?: string;

  // eslint-disable-next-line no-unused-vars
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    setTimeout(() => this.generate(), 500);
  }

  async generate() {
    if (location.href.endsWith('/preview')) {
      this.pdf = await generatePreview(
        this.projectService.activeProject.options
      );
    } else {
      this.pdf = await generateFull(this.projectService.activeProject.options);
    }
  }
}
