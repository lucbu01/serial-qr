import { Component, OnInit, ViewChild } from '@angular/core';
import { Editor } from 'primeng/editor';
import Quill from 'quill';
import { generatePreview } from 'src/utils/pdf';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editor = 'dsdf';
  pdf?: string;

  get project() {
    return this.projectService.activeProject;
  }

  @ViewChild('quill') quill?: Editor;

  // eslint-disable-next-line no-unused-vars
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    setTimeout(() => this.generate(), 500);
  }

  async generate() {
    if (this.quill) {
      console.log((this.quill.getQuill() as Quill).getContents());
    }
    this.pdf = await generatePreview(this.project.options);
  }
}
