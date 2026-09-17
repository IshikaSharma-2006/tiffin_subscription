import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Customer,
  CustomerService
} from '../../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {

  customers: Customer[] = [];

  page = 0;
  size = 5;

  totalPages = 0;
  totalElements = 0;

  sortBy = 'name';
  direction = 'asc';

  searchPhone = '';

  loading = false;
  errorMessage = '';

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.customerService
      .getCustomers(
        this.page,
        this.size,
        this.sortBy,
        this.direction
      )
      .subscribe({

        next: (response) => {

          this.customers = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;

          this.loading = false;
        },

        error: () => {

          this.loading = false;
          this.errorMessage =
            'Unable to load customers.';
        }

      });
  }

  search(): void {

    if (!this.searchPhone.trim()) {
      this.loadCustomers();
      return;
    }

    this.loading = true;

    this.customerService
      .getCustomerByPhone(this.searchPhone.trim())
      .subscribe({

        next: (customer) => {
          this.customers = [customer];
          this.totalPages = 1;
          this.totalElements = 1;
          this.loading = false;
        },

        error: () => {
          this.customers = [];
          this.totalPages = 0;
          this.totalElements = 0;
          this.loading = false;
          this.errorMessage = 'Customer not found.';
        }

      });
  }

  clearSearch(): void {
    this.searchPhone = '';
    this.page = 0;
    this.loadCustomers();
  }

  changeSort(): void {
    this.page = 0;
    this.loadCustomers();
  }

  previousPage(): void {

    if (this.page > 0) {
      this.page--;
      this.loadCustomers();
    }
  }

  nextPage(): void {

    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadCustomers();
    }
  }
}