import { TestBed } from '@angular/core/testing';

import { CalendartypeService } from './calendartype.service';

describe('CalendartypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendartypeService = TestBed.get(CalendartypeService);
    expect(service).toBeTruthy();
  });
});
