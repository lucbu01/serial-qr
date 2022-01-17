import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { FallbackComponent } from '../fallback/fallback.component';
import { ProjectComponent } from './project.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: ':id',
    component: ProjectComponent,
    children: [
      { path: 'edit', component: EditComponent },
      { path: 'view', component: ViewComponent },
      { path: 'preview', component: ViewComponent },
      { path: '**', redirectTo: 'edit' }
    ]
  },
  { path: '**', component: FallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
