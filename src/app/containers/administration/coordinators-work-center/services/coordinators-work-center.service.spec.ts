import { TestBed } from '@angular/core/testing';

import { CoordinatorsWorkCenterService } from './coordinators-work-center.service';

describe('CoordinatorsWorkCenterService', () => {
  let service: CoordinatorsWorkCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordinatorsWorkCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
