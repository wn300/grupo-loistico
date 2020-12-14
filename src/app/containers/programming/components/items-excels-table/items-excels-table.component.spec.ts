import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsExcelsTableComponent } from './items-excels-table.component';

describe('ItemsExcelsTableComponent', () => {
  let component: ItemsExcelsTableComponent;
  let fixture: ComponentFixture<ItemsExcelsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsExcelsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsExcelsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
