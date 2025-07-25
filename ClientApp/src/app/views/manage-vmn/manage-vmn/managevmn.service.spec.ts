import { TestBed } from '@angular/core/testing';

import { ManagevmnService } from './managevmn.service';

describe('ManagevmnService', () => {
  let service: ManagevmnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagevmnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
