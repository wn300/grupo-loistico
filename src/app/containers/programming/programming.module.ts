import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

import { ProgrammingRoutingModule } from './programming-routing.module';
import { ProgrammingComponent } from './programming.component';
import { AddItemsFormComponent } from './components/add-items-form/add-items-form.component';
import { UploadItemsFormComponent } from './components/upload-items-form/upload-items-form.component';
import { ItemsExcelsTableComponent } from './components/items-excels-table/items-excels-table.component';
import { PeopleModule } from '../administration/people/people.module';
import { WorkCenterModule } from '../administration/work-center/work-center.module';
import { ProgrammingService } from './services/programming.service';

@NgModule({
  declarations: [
    ProgrammingComponent,
    AddItemsFormComponent,
    UploadItemsFormComponent,
    ItemsExcelsTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    ProgrammingRoutingModule,
    PeopleModule,
    WorkCenterModule,
  ],
  providers: [ProgrammingService],
})
export class ProgrammingModule {}
