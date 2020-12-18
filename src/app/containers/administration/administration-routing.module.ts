import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { clientRootRoute } from './client/client-routing.module';
import { companyRootRoute } from './company/company-routing.module';
import { deleteFilesRootRoute } from './delete-files/delete-files-routing.module';
import { peopleRootRoute } from './people/people-routing.module';
import { workCenterRootRoute } from './work-center/work-center-routing.module';
import { typesNewsRootRoute } from './types-news/types-news-routing.module';

export const administrationRootRoute = 'administration';

const routes: Routes = [
  {
    path: '',
    redirectTo: peopleRootRoute,
    pathMatch: 'full'
  },
  {
    path: peopleRootRoute,
    loadChildren: () =>
      import('./people/people.module').then(m => m.PeopleModule)
  },
  {
    path: companyRootRoute,
    loadChildren: () =>
      import('./company/company.module').then(m => m.CompanyModule)
  },
  {
    path: clientRootRoute,
    loadChildren: () =>
      import('./client/client.module').then(m => m.ClientModule)
  },
  {
    path: workCenterRootRoute,
    loadChildren: () =>
      import('./work-center/work-center.module').then(m => m.WorkCenterModule)
  },
  {
    path: deleteFilesRootRoute,
    loadChildren: () =>
      import('./delete-files/delete-files.module').then(m => m.DeleteFilesModule)
  },
  {
    path: typesNewsRootRoute,
    loadChildren: () =>
      import('./types-news/types-news.module').then(m => m.TypesNewsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
