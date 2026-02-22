import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {
  Booking,
  ChartData,
  DashboardStats,
  TourPackage,
  Notification,
  Review,
  Customer,
  Flight,
  FlightBooking,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    // Use environment config as base
    this.baseUrl = environment.apiUrl;

    // Allow override via URL query parameter for testing different APIs
    const params = new URLSearchParams(window.location.search);
    const apiUrlParam = params.get('apiUrl');
    if (apiUrlParam) {
      this.baseUrl = apiUrlParam;
    }
  }

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // Tour Packages
  getPackages(): Observable<TourPackage[]> {
    return this.http.get<TourPackage[]>(`${this.baseUrl}/packages`);
  }
  getPackage(id: number): Observable<TourPackage> {
    return this.http.get<TourPackage>(`${this.baseUrl}/packages/${id}`);
  }
  createPackage(pkg: any): Observable<TourPackage> {
    return this.http.post<TourPackage>(
      `${this.baseUrl}/packages`,
      pkg,
      this.getHeaders(),
    );
  }
  updatePackage(id: number, pkg: any): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/packages/${id}`,
      pkg,
      this.getHeaders(),
    );
  }
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/packages/${id}`,
      this.getHeaders(),
    );
  }

  // Bookings
  createBooking(booking: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bookings`,
      booking,
      this.getHeaders(),
    );
  }
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.baseUrl}/bookings/my-bookings`,
      this.getHeaders(),
    );
  }
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.baseUrl}/bookings`,
      this.getHeaders(),
    );
  }
  updateBookingStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/bookings/${id}/status`,
      `"${status}"`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json',
        }),
      },
    );
  }
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/bookings/${id}`,
      this.getHeaders(),
    );
  }
  cancelBooking(id: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/bookings/${id}/cancel`,
      {},
      this.getHeaders(),
    );
  }

  // Reviews
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews`);
  }
  getReviewsByPackage(packageId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.baseUrl}/reviews/package/${packageId}`,
    );
  }
  addReview(review: any): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/reviews`,
      review,
      this.getHeaders(),
    );
  }
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/reviews/${id}`,
      this.getHeaders(),
    );
  }

  // Users (Admin)
  getUsers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${this.baseUrl}/users`,
      this.getHeaders(),
    );
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/users/${id}`,
      this.getHeaders(),
    );
  }

  // Notifications
  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.baseUrl}/notifications/my`,
      this.getHeaders(),
    );
  }
  markNotificationRead(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/notifications/${id}/read`,
      {},
      this.getHeaders(),
    );
  }
  sendNotification(notif: any): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/notifications/send`,
      notif,
      this.getHeaders(),
    );
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.baseUrl}/dashboard/stats`,
      this.getHeaders(),
    );
  }
  getBookingsByPackage(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/dashboard/bookings-by-package`,
      this.getHeaders(),
    );
  }
  getRevenueByMonth(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(
      `${this.baseUrl}/dashboard/revenue-by-month`,
      this.getHeaders(),
    );
  }

  // Exports
  exportBookingsPdf() {
    return this.http.get(`${this.baseUrl}/bookings/export/pdf`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
      }),
      responseType: 'blob',
    });
  }
  exportBookingsExcel() {
    return this.http.get(`${this.baseUrl}/bookings/export/excel`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
      }),
      responseType: 'blob',
    });
  }

  // ── Flights ──
  getFlights(params?: any): Observable<Flight[]> {
    let url = `${this.baseUrl}/flights`;
    if (params) {
      const query = Object.entries(params)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
      if (query) url += `?${query}`;
    }
    return this.http.get<Flight[]>(url);
  }
  getFlight(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.baseUrl}/flights/${id}`);
  }
  createFlight(flight: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/flights`, flight, this.getHeaders());
  }
  updateFlight(id: number, flight: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/flights/${id}`,
      flight,
      this.getHeaders(),
    );
  }
  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/flights/${id}`,
      this.getHeaders(),
    );
  }

  // ── Flight Bookings ──
  createFlightBooking(booking: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/flightbookings`,
      booking,
      this.getHeaders(),
    );
  }
  getMyFlightBookings(): Observable<FlightBooking[]> {
    return this.http.get<FlightBooking[]>(
      `${this.baseUrl}/flightbookings/my`,
      this.getHeaders(),
    );
  }
  getAllFlightBookings(): Observable<FlightBooking[]> {
    return this.http.get<FlightBooking[]>(
      `${this.baseUrl}/flightbookings`,
      this.getHeaders(),
    );
  }
  cancelFlightBooking(id: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/flightbookings/${id}/cancel`,
      {},
      this.getHeaders(),
    );
  }
  deleteFlightBooking(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/flightbookings/${id}`,
      this.getHeaders(),
    );
  }
  downloadFlightTicket(id: number) {
    return this.http.get(`${this.baseUrl}/flightbookings/${id}/ticket`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
      }),
      responseType: 'blob',
    });
  }
}
