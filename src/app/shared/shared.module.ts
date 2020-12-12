import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { JoinsFirebaseService } from './services/joins-firebase.service';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadService } from './services/file-upload.service';

@NgModule({
  declarations: [DialogConfirmComponent, FileUploadComponent],
  exports: [FileUploadComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  providers: [JoinsFirebaseService, FileUploadService]
})
export class SharedModule { }
