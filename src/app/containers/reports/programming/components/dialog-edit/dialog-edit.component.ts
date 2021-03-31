import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/containers/administration/client/components/dialog-form/dialog-form.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProgrmmingService } from '../../services/progrmming.service';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent {
  public objectEdit: any;
  public startDate: Date;
  public endDate: Date;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any, private firebaseAuth: AngularFireAuth, public progrmmingService: ProgrmmingService) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.objectEdit = null;

    this.firebaseAuth.authState.subscribe(authState => {
      this.progrmmingService.getOnlyPeopleByUID(authState.uid)
        .subscribe(people => {
          console.log(people);
          
          this.objectEdit = {
            dialogForm: {
              startDate: this.form.data.dateInit === 'No Registra'
                ? moment(onlyDateNow).toDate()
                : _.clone(new Date(this.form.data.dateInit)),
              endDate: this.form.data.dateEnd === 'No Registra'
                ? moment(onlyDateNow).toDate()
                : _.clone(this.form.data.dateEnd),
              observation: _.clone(this.form.data.observation),
              reason: '',
              userUpdate: `${people[0].firstName} ${people[0].firstLastName}`,
              dateUppdate: onlyDateNow
            },
            ...this.form.data
          };

          console.log(this.objectEdit);
        });

    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
