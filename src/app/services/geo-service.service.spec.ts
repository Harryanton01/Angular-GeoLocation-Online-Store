import { TestBed, inject } from '@angular/core/testing';

import { GeoServiceService } from './geo-service.service';

describe('GeoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoServiceService]
    });
  });

  it('should be created', inject([GeoServiceService], (service: GeoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
