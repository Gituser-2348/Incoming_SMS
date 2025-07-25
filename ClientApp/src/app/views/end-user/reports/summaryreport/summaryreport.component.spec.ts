import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryreportComponent } from './summaryreport.component';

describe('SummaryreportComponent', () => {
  let component: SummaryreportComponent;
  let fixture: ComponentFixture<SummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
