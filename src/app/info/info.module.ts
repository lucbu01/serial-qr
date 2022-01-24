import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { InfoRoutingModule } from './info-routing.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [InfoComponent],
  imports: [CommonModule, InfoRoutingModule, CardModule, ButtonModule]
})
export class InfoModule {}
