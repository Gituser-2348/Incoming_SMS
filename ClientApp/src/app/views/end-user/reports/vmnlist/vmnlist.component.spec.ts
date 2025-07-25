import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmnlistComponent } from './vmnlist.component';

describe('VmnlistComponent', () => {
  let component: VmnlistComponent;
  let fixture: ComponentFixture<VmnlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmnlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
