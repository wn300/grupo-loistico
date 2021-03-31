import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { DeleteFilesRoutingModule } from './delete-files-routing.module';
import { DeleteFilesComponent } from './delete-files.component';
import { DeleteFilesService } from './services/delete-files.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DeleteFilesComponent],
  imports: [
    CommonModule,
    FormsModule,
    DeleteFilesRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    SharedModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [DeleteFilesService]
})
export class DeleteFilesModule { }
