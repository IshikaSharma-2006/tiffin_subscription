import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerBill } from './customer-bill';

describe('CustomerBill', () => {
  let component: CustomerBill;
  let fixture: ComponentFixture<CustomerBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBill],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerBill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
