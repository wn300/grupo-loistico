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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { NewsService } from './services/news.service';
import { TypesNewsModule } from '../administration/types-news/types-news.module';
import { PeopleModule } from '../administration/people/people.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [NewsComponent, DialogFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    ReactiveFormsModule,
    NewsRoutingModule,
    TypesNewsModule,
    PeopleModule,
  ],
  providers: [NewsService],
})
export class NewsModule {}
