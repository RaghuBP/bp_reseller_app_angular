import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlasksComponent } from './flasks.component';

describe('FlasksComponent', () => {
  let component: FlasksComponent;
  let fixture: ComponentFixture<FlasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
