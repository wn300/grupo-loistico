import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItemsFormComponent } from './upload-items-form.component';

describe('UploadItemsFormComponent', () => {
  let component: UploadItemsFormComponent;
  let fixture: ComponentFixture<UploadItemsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadItemsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
