import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-owner-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './owner-login.html',
  styleUrl: './owner-login.css'
})
export class OwnerLogin {

  email = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    this.auth.login(
      this.email,
      this.password
    ).subscribe({

      next: (owner) => {
        this.loading = false;

        this.auth.saveOwner(owner);

        this.router.navigate(['/owner/dashboard']);
      },

      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Invalid email or password.';
      }

    });
  }
}