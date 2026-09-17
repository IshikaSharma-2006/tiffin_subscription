import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  monthlyPlanPrice: number;
  subscriptionStartDate: string;
  status: 'ACTIVE' | 'PAUSED';
}

export interface CustomerPage {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

 private apiUrl = 'https://super-duper-space-happiness-xrp5qq6qpvgw3vg4q-8080.app.github.dev/api/auth';

  constructor(private http: HttpClient) {}

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiUrl,
      customer
    );
  }

  getCustomers(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    direction: string = 'asc'
  ): Observable<CustomerPage> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<CustomerPage>(
      this.apiUrl,
      { params }
    );
  }

  getCustomerByPhone(phone: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/phone/${phone}`
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/${id}`
    );
  }

  pauseCustomer(
    id: number,
    startDate: string
  ): Observable<string> {

    const params = new HttpParams()
      .set('startDate', startDate);

    return this.http.post(
      `${this.apiUrl}/${id}/pause`,
      null,
      {
        params,
        responseType: 'text'
      }
    );
  }

  resumeCustomer(
    id: number,
    endDate: string
  ): Observable<string> {

    const params = new HttpParams()
      .set('endDate', endDate);

    return this.http.post(
      `${this.apiUrl}/${id}/resume`,
      null,
      {
        params,
        responseType: 'text'
      }
    );
  }

  getBill(
    id: number,
    month: string
  ): Observable<number> {

    const params = new HttpParams()
      .set('month', month);

    return this.http.get<number>(
      `${this.apiUrl}/${id}/bill`,
      { params }
    );
  }
}