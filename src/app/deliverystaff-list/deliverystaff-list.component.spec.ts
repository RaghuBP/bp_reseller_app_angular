import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverystaffListComponent } from './deliverystaff-list.component';

describe('DeliverystaffListComponent', () => {
  let component: DeliverystaffListComponent;
  let fixture: ComponentFixture<DeliverystaffListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverystaffListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverystaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
