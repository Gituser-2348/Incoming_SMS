/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestSMSComponent } from './testSMS.component';

describe('TestSMSComponent', () => {
  let component: TestSMSComponent;
  let fixture: ComponentFixture<TestSMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
