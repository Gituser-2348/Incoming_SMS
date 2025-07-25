import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowlandingComponent } from './flowlanding.component';

describe('FlowlandingComponent', () => {
  let component: FlowlandingComponent;
  let fixture: ComponentFixture<FlowlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowlandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
