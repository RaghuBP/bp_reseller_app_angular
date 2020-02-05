import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverystaffComponent } from './deliverystaff.component';

describe('DeliverystaffComponent', () => {
  let component: DeliverystaffComponent;
  let fixture: ComponentFixture<DeliverystaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverystaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverystaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
