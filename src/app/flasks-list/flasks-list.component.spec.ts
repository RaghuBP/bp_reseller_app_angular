import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlasksListComponent } from './flasks-list.component';

describe('FlasksListComponent', () => {
  let component: FlasksListComponent;
  let fixture: ComponentFixture<FlasksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlasksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
