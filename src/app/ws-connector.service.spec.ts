import { TestBed } from '@angular/core/testing';

import { WsConnectorService } from './ws-connector.service';

describe('WsConnectorService', () => {
  let service: WsConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
