import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-owner-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './owner-register.html',
  styleUrl: './owner-register.css'
})
export class OwnerRegister {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;

    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({

      next: () => {
        this.loading = false;
        this.successMessage = 'Account created successfully!';

        setTimeout(() => {
          this.router.navigate(['/owner/login']);
        }, 800);
      },

      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Registration failed. Please try again.';
      }

    });
  }
}