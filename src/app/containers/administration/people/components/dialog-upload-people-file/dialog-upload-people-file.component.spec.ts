import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadPeopleFileComponent } from './dialog-upload-people-file.component';

describe('DialogUploadPeopleFileComponent', () => {
  let component: DialogUploadPeopleFileComponent;
  let fixture: ComponentFixture<DialogUploadPeopleFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUploadPeopleFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUploadPeopleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
