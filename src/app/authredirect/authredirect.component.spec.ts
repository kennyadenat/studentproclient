import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthredirectComponent } from './authredirect.component';

describe('AuthredirectComponent', () => {
  let component: AuthredirectComponent;
  let fixture: ComponentFixture<AuthredirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthredirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthredirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
