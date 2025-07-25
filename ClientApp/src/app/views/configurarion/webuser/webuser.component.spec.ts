import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebuserComponent } from './webuser.component';

describe('WebuserComponent', () => {
  let component: WebuserComponent;
  let fixture: ComponentFixture<WebuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
