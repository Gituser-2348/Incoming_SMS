import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmmwComponent } from './pmmw.component';

describe('PmmwComponent', () => {
  let component: PmmwComponent;
  let fixture: ComponentFixture<PmmwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmmwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmmwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
