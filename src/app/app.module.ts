import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { FallbackComponent } from './fallback/fallback.component';
import { AppRoutingModule } from './app-routing.module';
import { ProjectService } from './services/project.service';
import { ShortcutService } from './services/shortcut.service';
import { RenameComponent } from './dialog/rename/rename.component';
import { ProjectsComponent } from './dialog/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    FallbackComponent,
    RenameComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ToastModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ButtonModule,
    TableModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    ProjectService,
    ShortcutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
