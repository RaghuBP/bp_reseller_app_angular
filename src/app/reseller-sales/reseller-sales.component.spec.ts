import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerSalesComponent } from './reseller-sales.component';

describe('ResellerSalesComponent', () => {
  let component: ResellerSalesComponent;
  let fixture: ComponentFixture<ResellerSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
