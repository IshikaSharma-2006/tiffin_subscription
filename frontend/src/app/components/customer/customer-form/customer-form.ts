import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Customer,
  CustomerService
} from '../../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerForm {

  name = '';
  phone = '';
  monthlyPlanPrice: number | null = null;
  subscriptionStartDate = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  saveCustomer(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.name ||
      !this.phone ||
      !this.monthlyPlanPrice ||
      !this.subscriptionStartDate
    ) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    if (this.phone.length < 10) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    this.loading = true;

    const customer: Customer = {
      name: this.name,
      phone: this.phone,
      monthlyPlanPrice: this.monthlyPlanPrice,
      subscriptionStartDate: this.subscriptionStartDate,
      status: 'ACTIVE'
    };

    this.customerService.createCustomer(customer).subscribe({

      next: () => {

        this.loading = false;
        this.successMessage =
          'Customer subscribed successfully!';

        setTimeout(() => {
          this.router.navigate(['/owner/dashboard']);
        }, 800);
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Unable to create customer.';
      }

    });
  }
}