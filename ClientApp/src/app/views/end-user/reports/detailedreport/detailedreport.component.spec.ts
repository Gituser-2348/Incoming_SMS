import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedreportComponent } from './detailedreport.component';

describe('DetailedreportComponent', () => {
  let component: DetailedreportComponent;
  let fixture: ComponentFixture<DetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
