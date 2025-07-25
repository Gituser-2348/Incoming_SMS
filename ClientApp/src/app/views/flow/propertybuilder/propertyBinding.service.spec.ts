/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PropertyBindingService } from './propertyBinding.service';

describe('Service: PropertyBinding', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyBindingService]
    });
  });

  it('should ...', inject([PropertyBindingService], (service: PropertyBindingService) => {
    expect(service).toBeTruthy();
  }));
});
