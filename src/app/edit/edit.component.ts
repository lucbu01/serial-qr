import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  get showView() {
    return this.projectService.showEdit;
  }

  get project() {
    return this.projectService.activeProject;
  }

  constructor(private projectService: ProjectService) {}
}
