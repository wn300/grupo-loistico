import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { JoinsFirebaseService } from './services/joins-firebase.service';

@NgModule({
  declarations: [DialogConfirmComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers:[JoinsFirebaseService]
})
export class SharedModule { }
