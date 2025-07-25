import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkpushComponent } from './bulkpush.component';

describe('BulkpushComponent', () => {
  let component: BulkpushComponent;
  let fixture: ComponentFixture<BulkpushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkpushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkpushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
