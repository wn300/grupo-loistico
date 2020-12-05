import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { DeleteFilesRoutingModule } from './delete-files-routing.module';
import { DeleteFilesComponent } from './delete-files.component';
import { DeleteFilesService } from './services/delete-files.service';


@NgModule({
  declarations: [DeleteFilesComponent],
  imports: [
    CommonModule,
    DeleteFilesRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [DeleteFilesService]
})
export class DeleteFilesModule { }
