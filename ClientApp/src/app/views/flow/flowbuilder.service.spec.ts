import { TestBed } from '@angular/core/testing';

import { FlowbuilderService } from './flowbuilder.service';

describe('FlowbuilderService', () => {
  let service: FlowbuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowbuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
