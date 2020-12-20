import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith, take } from 'rxjs/operators';

import { People } from 'src/app/containers/administration/people/entity/people';
import { PeopleService } from 'src/app/containers/administration/people/services/people.service';
import { TypeNew } from 'src/app/containers/administration/types-news/entity/type-new.entity';
import { TypesNewsService } from 'src/app/containers/administration/types-news/services/types-news.service';
import { New, NewPayload } from '../../entity/new.entity';

@Component({
  selector: 'app-news-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public form: FormGroup;
  public typesNews: TypeNew[];
  public people: People[] = [];

  public filteredPeople: Observable<People[]>;

  constructor(
    private readonly typesNewsService: TypesNewsService,
    private readonly peopleService: PeopleService,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      item?: New;
      typesNews?: TypeNew[];
    }
  ) {
    this.typesNews = data.typesNews || [];
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this.data.item ? this.data.item.id : '', []),
      people: new FormControl('', [Validators.required]),
      dateStart: new FormControl(
        this.data.item ? this.data.item.dateStart : '',
        [Validators.required]
      ),
      dateEnd: new FormControl(this.data.item ? this.data.item.dateEnd : '', [
        Validators.required,
      ]),
      type: new FormControl(this.data.item ? this.data.item.typeId : '', [
        Validators.required,
      ]),
      observations: new FormControl(
        this.data.item ? this.data.item.observations : '',
        []
      ),
    });

    if (this.typesNews.length === 0) {
      this.subscriptions.push(
        this.typesNewsService.getAll().subscribe((data) => {
          this.typesNews = data;
        })
      );
    }
    this.subscriptions.push(
      this.peopleService
        .getPeople()
        .pipe(take(1))
        .subscribe((data) => {
          (data as Array<any>).forEach((item) => {
            this.people.push({
              ...item.payload.doc.data(),
              id: item.payload.doc.id,
            });
          });
          if (this.data.item) {
            this.fControl('people').setValue(
              this.people.find((item) => item.id === this.data.item.peopleId)
            );
          }
        })
    );

    this.filteredPeople = this.form.get('people').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) =>
        typeof value === 'string' ? value : this.displayPeopleFn(value)
      ),
      map((name) => (name ? this._filterPeople(name) : this.people.slice()))
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  get formData(): NewPayload {
    if (this.form.valid) {
      const dataForm = this.form.value;
      return {
        id: dataForm.id,
        peopleId: dataForm.people.id,
        identification: dataForm.people.identification,
        name: `${dataForm.people.firstName} ${dataForm.people.firstLastName}`,
        typeId: dataForm.type,
        dateStart: dataForm.dateStart,
        dateEnd: dataForm.dateEnd,
        observations: dataForm.observations,
      } as NewPayload;
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

  public validateAutoInput(_control: string): void {
    const control = this.form.get(_control);
    if (control && typeof control.value === 'string') {
      control.setValue('');
    }
  }

  public displayPeopleFn(people: People): string {
    return people
      ? `[${people.identification}] ${people.firstName} ${people.firstLastName}`
      : '';
  }

  public handleClose(): void {
    this.dialogRef.close();
  }

  private _filterPeople(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.people.filter(
      (option) =>
        option.firstName.toLowerCase().indexOf(filterValue) >= 0 ||
        option.firstLastName.toLowerCase().indexOf(filterValue) >= 0 ||
        String(option.identification).toLowerCase().indexOf(filterValue) >= 0
    );
  }
}
