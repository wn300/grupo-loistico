import { TestBed } from '@angular/core/testing';

import { JoinsFirebaseService } from './joins-firebase.service';

describe('JoinsFirebaseService', () => {
  let service: JoinsFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinsFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
