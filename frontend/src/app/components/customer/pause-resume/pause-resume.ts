import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Customer,
  CustomerService
} from '../../../services/customer.service';

@Component({
  selector: 'app-pause-resume',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pause-resume.html',
  styleUrl: './pause-resume.css'
})
export class PauseResume implements OnInit {

  customer: Customer | null = null;

  pauseStartDate = '';
  resumeEndDate = '';

  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.queryParamMap.get('id')
    );

    if (id) {
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: number): void {

    this.loading = true;

    this.customerService
      .getCustomerById(id)
      .subscribe({

        next: (customer) => {
          this.customer = customer;
          this.loading = false;
        },

        error: () => {
          this.errorMessage = 'Customer not found.';
          this.loading = false;
        }

      });
  }

  pause(): void {

    if (!this.customer?.id || !this.pauseStartDate) {
      this.errorMessage = 'Select a pause date.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.customerService
      .pauseCustomer(
        this.customer.id,
        this.pauseStartDate
      )
      .subscribe({

        next: (response) => {

          this.message = response;
          this.loading = false;

          this.customer!.status = 'PAUSED';
        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to pause customer.';
        }

      });
  }

  resume(): void {

    if (!this.customer?.id || !this.resumeEndDate) {
      this.errorMessage = 'Select a resume date.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.customerService
      .resumeCustomer(
        this.customer.id,
        this.resumeEndDate
      )
      .subscribe({

        next: (response) => {

          this.message = response;
          this.loading = false;

          this.customer!.status = 'ACTIVE';
        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to resume customer.';
        }

      });
  }
}