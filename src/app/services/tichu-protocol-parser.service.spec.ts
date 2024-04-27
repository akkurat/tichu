import { TestBed } from '@angular/core/testing';

import { TichuProtocolParserService } from './tichu-protocol-parser.service';

describe('TichuProtocolParserService', () => {
  let service: TichuProtocolParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TichuProtocolParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('parse start')
countActor.send({ type: 'INC' });
// logs 1
countActor.send({ type: 'DEC' });
// logs 0
countActor.send({ type: 'SET', value: 10 });
});
