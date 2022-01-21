import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { generateFull, generatePreview } from 'src/utils/pdf';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'qr-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  pdf?: string;
  subscriptions: Subscription[] = [];

  @Input() set zoom(value: number | 'auto') {
    this._zoom = value;
    this.urlComponent = false;
  }
  get zoom() {
    return this._zoom;
  }

  _zoom: number | 'auto' = 100;
  mobile = true;
  urlComponent = true;

  constructor(
    private projectService: ProjectService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.pdf = undefined;
    this.subscriptions.push(
      this.projectService.regenerateEvent.subscribe(async () =>
        this.generate()
      ),
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.Tablet])
        .subscribe((value) => {
          this.mobile = value.matches;
          if (this.urlComponent) {
            if (value.matches) {
              this._zoom = 'auto';
            } else {
              this._zoom = 100;
            }
          }
        })
    );
    this.generate();
  }

  async generate() {
    if (location.href.endsWith('/view')) {
      this.pdf = await generateFull(this.projectService.activeProject.options);
    } else {
      this.pdf = await generatePreview(
        this.projectService.activeProject.options
      );
    }
  }
}
