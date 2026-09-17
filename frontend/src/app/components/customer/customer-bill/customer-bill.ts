import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Customer,
  CustomerService
} from '../../../services/customer.service';

@Component({
  selector: 'app-customer-bill',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './customer-bill.html',
  styleUrl: './customer-bill.css'
})
export class CustomerBill {

  phone = '';
  month = '';

  customer: Customer | null = null;
  bill: number | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private customerService: CustomerService
  ) {}

  searchCustomer(): void {

    if (!this.phone.trim()) {
      this.errorMessage = 'Enter customer phone number.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.bill = null;

    this.customerService
      .getCustomerByPhone(this.phone.trim())
      .subscribe({

        next: (customer) => {
          this.customer = customer;
          this.loading = false;
        },

        error: () => {
          this.customer = null;
          this.loading = false;
          this.errorMessage = 'Customer not found.';
        }

      });
  }

  calculateBill(): void {

    if (!this.customer?.id) {
      this.errorMessage = 'Find a customer first.';
      return;
    }

    if (!this.month) {
      this.errorMessage = 'Select a month.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.customerService
      .getBill(this.customer.id, this.month)
      .subscribe({

        next: (amount) => {
          this.bill = amount;
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.errorMessage =
            'Unable to calculate bill.';
        }

      });
  }
}