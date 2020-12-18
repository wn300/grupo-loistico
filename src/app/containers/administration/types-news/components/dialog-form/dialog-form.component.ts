import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TypeNew, TypeNewPayload } from '../../entity/type-new.entity';

@Component({
  selector: 'app-types-news-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit {
  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      item?: TypeNew;
    }
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this.data.item ? this.data.item.id : '', []),
      name: new FormControl(this.data.item ? this.data.item.name : '', [
        Validators.required,
        Validators.maxLength(20),
      ]),
    });
  }

  get formData(): TypeNewPayload {
    if (this.form.valid) {
      return this.form.value as TypeNewPayload;
    }
    return null;
  }

  public fControl(control: string): AbstractControl {
    return this.form.get(control);
  }

  public fControlIsValid(control: string): boolean {
    return !(
      Boolean(this.fControl(control).errors) &&
      (this.fControl(control).dirty || this.fControl(control).touched)
    );
  }

  public handleClose(): void {
    this.dialogRef.close();
  }
}
