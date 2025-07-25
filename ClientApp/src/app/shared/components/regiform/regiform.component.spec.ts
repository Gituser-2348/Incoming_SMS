import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegiformComponent } from './regiform.component';

describe('RegiformComponent', () => {
  let component: RegiformComponent;
  let fixture: ComponentFixture<RegiformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegiformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegiformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
