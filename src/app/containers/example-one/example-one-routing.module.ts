import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleOneComponent } from './example-one.component';

export const exampleOneRootRoute = 'example_one';

const routes: Routes = [
  {
    path: '',
    component: ExampleOneComponent,
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleOneRoutingModule { }
