import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { companyRootRoute } from './company/company-routing.module';
import { peopleRootRoute } from './people/people-routing.module';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
