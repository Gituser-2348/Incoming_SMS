import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionvmnComponent } from './actionvmn.component';

describe('ActionvmnComponent', () => {
  let component: ActionvmnComponent;
  let fixture: ComponentFixture<ActionvmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionvmnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionvmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
