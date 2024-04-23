import { TestBed } from '@angular/core/testing';

import { ServerSelectionService } from './server-selection.service';

describe('ServerSelectionService', () => {
  let service: ServerSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
