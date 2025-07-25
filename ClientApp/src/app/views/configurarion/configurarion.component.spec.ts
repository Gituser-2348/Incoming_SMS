import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarionComponent } from './configurarion.component';

describe('ConfigurarionComponent', () => {
  let component: ConfigurarionComponent;
  let fixture: ComponentFixture<ConfigurarionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
