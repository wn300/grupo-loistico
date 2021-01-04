import { TestBed } from '@angular/core/testing';

import { ProgrmmingService } from './progrmming.service';

describe('ProgrmmingService', () => {
  let service: ProgrmmingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgrmmingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
