import { TestBed, inject } from '@angular/core/testing';

import { GeoService } from './geo-service.service';

describe('GeoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoService]
    });
  });

  it('should be created', inject([GeoService], (service: GeoService) => {
    expect(service).toBeTruthy();
  }));
});
