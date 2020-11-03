import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExampleOneRoutingModule } from './example-one-routing.module';
import { ExampleOneComponent } from './example-one.component';


@NgModule({
  declarations: [ExampleOneComponent],
  imports: [
    CommonModule,
    ExampleOneRoutingModule
  ]
})
export class ExampleOneModule { }
