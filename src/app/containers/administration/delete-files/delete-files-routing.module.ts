import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteFilesComponent } from './delete-files.component';

export const deleteFilesRootRoute = 'delete_files';

const routes: Routes = [
  {
    path: '',
    component: DeleteFilesComponent,
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeleteFilesRoutingModule { }
