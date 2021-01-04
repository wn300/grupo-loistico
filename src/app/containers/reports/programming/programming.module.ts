import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ProgrammingRoutingModule } from './programming-routing.module';
import { ProgrammingComponent } from './programming.component';


@NgModule({
  declarations: [ProgrammingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ProgrammingRoutingModule
  ]
})
export class ProgrammingModule { }
