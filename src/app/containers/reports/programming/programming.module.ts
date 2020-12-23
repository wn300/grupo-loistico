import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgrammingRoutingModule } from './programming-routing.module';
import { ProgrammingComponent } from './programming.component';


@NgModule({
  declarations: [ProgrammingComponent],
  imports: [
    CommonModule,
    ProgrammingRoutingModule
  ]
})
export class ProgrammingModule { }
