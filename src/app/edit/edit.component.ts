import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { Editor } from 'primeng/editor';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  editor = 'dsdf';

  get showView() {
    return this.projectService.showEdit;
  }

  get project() {
    return this.projectService.activeProject;
  }

  @ViewChild('quill') quill?: Editor;

  constructor(
    private projectService: ProjectService,
    private breakpointObserver: BreakpointObserver
  ) {}
}
