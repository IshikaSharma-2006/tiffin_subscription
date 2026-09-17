import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard {

  ownerName = 'Tiffin Owner';

  totalCustomers = 0;
  activeCustomers = 0;
  pausedCustomers = 0;

  logout(): void {
    localStorage.removeItem('owner');
    window.location.href = '/owner/login';
  }
}