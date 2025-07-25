import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiurltestComponent } from './apiurltest.component';

describe('ApiurltestComponent', () => {
  let component: ApiurltestComponent;
  let fixture: ComponentFixture<ApiurltestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiurltestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiurltestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
