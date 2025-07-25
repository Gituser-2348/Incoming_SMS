import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddparameterComponent } from './addparameter.component';

describe('AddparameterComponent', () => {
  let component: AddparameterComponent;
  let fixture: ComponentFixture<AddparameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddparameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
