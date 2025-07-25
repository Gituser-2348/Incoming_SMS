import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePopComponent } from './variable-pop.component';

describe('VariablePopComponent', () => {
  let component: VariablePopComponent;
  let fixture: ComponentFixture<VariablePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
