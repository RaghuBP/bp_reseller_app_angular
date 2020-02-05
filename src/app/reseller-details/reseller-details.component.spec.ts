import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerDetailsComponent } from './reseller-details.component';

describe('ResellerDetailsComponent', () => {
  let component: ResellerDetailsComponent;
  let fixture: ComponentFixture<ResellerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
