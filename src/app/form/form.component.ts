import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SerialQRDataFile, SerialQRPosition } from 'src/utils/data';
import { readExcel, readFileAsDataUrl, readFileAsText } from 'src/utils/file';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  files: File[] = [];
  dataKeys: string[] = [];
  loaded = false;

  get showView() {
    return this.projectService.showEdit;
  }

  get project() {
    return this.projectService.activeProject;
  }

  constructor(
    private projectService: ProjectService,
    private clipboardService: Clipboard,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.projectService.onLoaded.subscribe(() => this.init())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  init() {
    this.dataKeys = [];
    this.project.options.dataFiles.forEach((dataFile) => {
      if (dataFile.content) {
        Object.keys(dataFile.content[0]).forEach((dataKey) => {
          if (!this.dataKeys.includes(dataKey)) {
            this.dataKeys.push(dataKey);
          }
        });
      }
    });
    setTimeout(() => (this.loaded = true));
  }

  dataKeyClicked(value: string) {
    this.clipboardService.copy(`{${value}}`);
    this.messageService.add({
      severity: 'success',
      summary: 'Template kopiert',
      detail: 'Du kannst es mit Ctrl + V in ein Textfeld einfügen!'
    });
  }

  async loadLogo(event: { files: File[] }) {
    const logo = event.files[0];
    let content = '';
    if (logo.name.endsWith('.svg')) {
      content = await readFileAsText(logo);
    } else {
      content = await readFileAsDataUrl(logo);
    }
    if (!this.project.options.logo) {
      this.project.options.logo = {
        height: 30,
        width: 30,
        location: 'left',
        src: logo.name
      };
    }
    this.project.options.logo.src = logo.name;
    this.project.options.logo.content = content;
    this.messageService.add({
      severity: 'success',
      summary: 'Logo geladen',
      detail: 'Das neue Logo wird jetzt verwendet!'
    });
    if (this.showView) {
      this.projectService.regenerate();
    }
    this.projectService.save();
  }

  deletePosition(dataFile: SerialQRDataFile, position: SerialQRPosition) {
    dataFile.positions.splice(dataFile.positions.indexOf(position), 1);
  }

  addPosition(dataFile: SerialQRDataFile) {
    dataFile.positions.push({ designation: 'Neu', amount: '1.00' });
  }

  async loadFiles(event: { files: File[] }) {
    this.files = event.files;
    const size = this.files.length;
    this.dataKeys = [];
    for (let index = 0; index < size; index++) {
      const file = this.files[index];
      const keyValue = await readExcel(file);
      if (this.project.options.dataFiles.length <= index) {
        this.project.options.dataFiles.push({
          src: file.name,
          positions: [],
          content: keyValue
        });
      } else {
        const dataFile = this.project.options.dataFiles[index];
        dataFile.src = file.name;
        dataFile.content = keyValue;
      }
      Object.keys(keyValue[0]).forEach((dataKey) => {
        if (!this.dataKeys.includes(dataKey)) {
          this.dataKeys.push(dataKey);
        }
      });
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Daten geladen',
      detail: 'Du kannst die Feld-Templates über die Buttons kopieren!'
    });
    if (this.showView) {
      this.projectService.regenerate();
    }
    this.projectService.save();
  }
}
