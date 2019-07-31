import { TestBed } from '@angular/core/testing';

import { CalendarauthorService } from './calendarauthor.service';

describe('CalendarauthorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarauthorService = TestBed.get(CalendarauthorService);
    expect(service).toBeTruthy();
  });
});
