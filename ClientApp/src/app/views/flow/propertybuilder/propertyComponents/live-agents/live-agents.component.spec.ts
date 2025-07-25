import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAgentsComponent } from './live-agents.component';

describe('LiveAgentsComponent', () => {
  let component: LiveAgentsComponent;
  let fixture: ComponentFixture<LiveAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
