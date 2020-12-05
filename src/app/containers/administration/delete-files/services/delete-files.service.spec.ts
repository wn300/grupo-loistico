import { TestBed } from '@angular/core/testing';

import { DeleteFilesService } from './delete-files.service';

describe('DeleteFilesService', () => {
  let service: DeleteFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
