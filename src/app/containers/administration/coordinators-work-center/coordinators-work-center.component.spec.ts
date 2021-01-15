import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorsWorkCenterComponent } from './coordinators-work-center.component';

describe('CoordinatorsWorkCenterComponent', () => {
  let component: CoordinatorsWorkCenterComponent;
  let fixture: ComponentFixture<CoordinatorsWorkCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinatorsWorkCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorsWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
