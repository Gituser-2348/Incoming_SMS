import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusRemarkComponent } from './status-remark.component';

describe('StatusRemarkComponent', () => {
  let component: StatusRemarkComponent;
  let fixture: ComponentFixture<StatusRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusRemarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
