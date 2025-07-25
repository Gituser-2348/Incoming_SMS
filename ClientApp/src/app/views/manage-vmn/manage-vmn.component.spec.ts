import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVMNComponent } from './manage-vmn.component';

describe('ManageVMNComponent', () => {
  let component: ManageVMNComponent;
  let fixture: ComponentFixture<ManageVMNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVMNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVMNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
