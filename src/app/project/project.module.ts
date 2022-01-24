import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectComponent } from './project.component';
import { EditComponent } from './edit/edit.component';
import { EditorComponent } from './editor/editor.component';
import { ViewComponent } from './view/view.component';
import { FormComponent } from './form/form.component';

import { ProjectRoutingModule } from './project-routing.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InplaceModule } from 'primeng/inplace';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    ProjectComponent,
    EditComponent,
    EditorComponent,
    ViewComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule,
    HttpClientModule,
    ClipboardModule,
    LayoutModule,
    NgxExtendedPdfViewerModule,
    EditorModule,
    ButtonModule,
    MenubarModule,
    SplitterModule,
    TooltipModule,
    FileUploadModule,
    InputMaskModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    DropdownModule,
    InplaceModule,
    ToastModule,
    TabViewModule,
    CheckboxModule,
    ListboxModule,
    CalendarModule,
    ColorPickerModule,
    CardModule
  ],
  providers: []
})
export class ProjectModule {}
