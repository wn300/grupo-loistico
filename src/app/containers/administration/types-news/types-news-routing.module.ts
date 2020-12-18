import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesNewsComponent } from './types-news.component';

export const typesNewsRootRoute = 'types-news';

const routes: Routes = [
 {
  path: '',
  component: TypesNewsComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesNewsRoutingModule { }
