import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { TypesNewsRoutingModule } from './types-news-routing.module';
import { TypesNewsComponent } from './types-news.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { TypesNewsService } from './services/types-news.service';

@NgModule({
  declarations: [TypesNewsComponent, DialogFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    TypesNewsRoutingModule,
  ],
  providers: [TypesNewsService],
})
export class TypesNewsModule {}
