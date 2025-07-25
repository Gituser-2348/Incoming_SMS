import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VMNListComponent } from './vmnlist.component';

describe('VMNListComponent', () => {
  let component: VMNListComponent;
  let fixture: ComponentFixture<VMNListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VMNListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VMNListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
