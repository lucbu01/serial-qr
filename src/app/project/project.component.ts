import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'qr-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  subscriptions: Subscription[] = [];

  constructor(
    // eslint-disable-next-line no-unused-vars
    private projectService: ProjectService,
    // eslint-disable-next-line no-unused-vars
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => this.init(params['id']))
    );
  }

  init(id: any): void {
    this.projectService.open(id, false);
  }
}
