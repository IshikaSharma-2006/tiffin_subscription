import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Owner {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://super-duper-space-happiness-xrp5qq6qpvgw3vg4q-8080.app.github.dev/api/auth';

  constructor(private http: HttpClient) {}

  register(owner: Owner): Observable<Owner> {
    return this.http.post<Owner>(
      `${this.apiUrl}/register`,
      owner
    );
  }

  login(email: string, password: string): Observable<Owner> {
    return this.http.post<Owner>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  saveOwner(owner: Owner): void {
    localStorage.setItem('owner', JSON.stringify(owner));
  }

  getOwner(): Owner | null {
    const owner = localStorage.getItem('owner');

    return owner ? JSON.parse(owner) : null;
  }

  logout(): void {
    localStorage.removeItem('owner');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('owner') !== null;
  }
}
