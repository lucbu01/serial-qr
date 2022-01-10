import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LayoutModule } from '@angular/cdk/layout';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';
import { TooltipModule } from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { ProjectService } from './services/project.service';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [AppComponent, ProjectComponent, EditComponent, ViewComponent, EditorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxExtendedPdfViewerModule,
    EditorModule,
    ButtonModule,
    MenubarModule,
    SplitterModule,
    TooltipModule
  ],
  providers: [ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule {}
