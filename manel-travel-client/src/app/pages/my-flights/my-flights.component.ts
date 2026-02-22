import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FlightBooking } from '../../models/models';

@Component({
  selector: 'app-my-flights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-head">
        <h1>My Flight Bookings</h1>
        <p>View and manage your booked flights</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading your flights...</p>
      </div>

      <div *ngIf="!loading && bookings.length === 0" class="empty">
        <span>🎫</span>
        <p>You haven't booked any flights yet.</p>
        <button class="btn-browse" (click)="router.navigate(['/flights'])">
          ✈ Browse Flights
        </button>
      </div>

      <div class="booking-list" *ngIf="!loading && bookings.length > 0">
        <div
          class="b-card"
          *ngFor="let b of bookings"
          [class.cancelled]="b.status === 'Cancelled'"
        >
          <div class="b-status">
            <span
              class="badge"
              [class.bg-green]="b.status === 'Confirmed'"
              [class.bg-red]="b.status === 'Cancelled'"
            >
              {{ b.status }}
            </span>
            <span class="b-date"
              >Booked on {{ b.bookingDate | date: 'MMM d, y' }}</span
            >
          </div>

          <div class="b-route">
            <div class="rp">
              <span class="rt">{{ b.departureTime | date: 'HH:mm' }}</span>
              <span class="rc">{{ b.origin }}</span>
            </div>
            <div class="rl">
              <span class="rd">{{ getDuration(b) }}</span>
              <div class="rline">
                <span class="rdot"></span><span class="rdash"></span
                ><span class="rdot"></span>
              </div>
              <span class="ra">{{ b.airline }} · {{ b.flightNumber }}</span>
            </div>
            <div class="rp">
              <span class="rt">{{ b.arrivalTime | date: 'HH:mm' }}</span>
              <span class="rc">{{ b.destination }}</span>
            </div>
          </div>

          <div class="b-details">
            <div class="b-passengers">
              <span class="detail-label">Passengers</span>
              <span *ngFor="let p of b.passengers" class="pass-tag"
                >{{ p.firstName }} {{ p.surname }}</span
              >
            </div>
            <div class="b-class">
              <span class="detail-label">Flight</span>
              <span>{{ b.flightNumber }}</span>
            </div>
            <div class="b-total">
              <span class="detail-label">Total</span>
              <span class="total-val"
                >LKR {{ b.totalPrice | number: '1.0-0' }}</span
              >
            </div>
          </div>

          <div class="b-actions">
            <button
              class="btn-ticket"
              (click)="downloadTicket(b.flightBookingId)"
              *ngIf="b.status === 'Confirmed'"
            >
              📥 Download Ticket
            </button>
            <button
              class="btn-cancel"
              (click)="cancelBooking(b.flightBookingId)"
              *ngIf="b.status === 'Confirmed'"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        animation: fadeIn 0.3s ease;
      }
      .page-head {
        margin-bottom: 1.5rem;
      }
      .page-head h1 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1e272e;
        margin: 0 0 4px;
      }
      .page-head p {
        color: #636e72;
        font-size: 0.92rem;
        margin: 0;
      }

      .loading {
        text-align: center;
        padding: 4rem 2rem;
        color: #636e72;
      }
      .spinner {
        width: 36px;
        height: 36px;
        border: 3px solid #e8ecef;
        border-top-color: #0fb9b1;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .empty {
        text-align: center;
        padding: 4rem 2rem;
        color: #b2bec3;
      }
      .empty span {
        font-size: 3rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .btn-browse {
        margin-top: 1rem;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        font-family: inherit;
      }
      .btn-browse:hover {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
      }

      .booking-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .b-card {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        transition: all 0.25s;
      }
      .b-card:hover {
        border-color: rgba(15, 185, 177, 0.2);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
      }
      .b-card.cancelled {
        opacity: 0.65;
      }

      .b-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .bg-green {
        background: #e8f8f5;
        color: #0fb9b1;
      }
      .bg-red {
        background: #ffeaea;
        color: #d63031;
      }
      .b-date {
        font-size: 0.78rem;
        color: #b2bec3;
      }

      .b-route {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1rem;
      }
      .rp {
        text-align: center;
      }
      .rt {
        display: block;
        font-size: 1.3rem;
        font-weight: 700;
        color: #1e272e;
      }
      .rc {
        display: block;
        font-size: 0.82rem;
        color: #636e72;
      }
      .rl {
        flex: 1;
        text-align: center;
      }
      .rd {
        display: block;
        font-size: 0.75rem;
        color: #636e72;
      }
      .ra {
        display: block;
        font-size: 0.75rem;
        color: #b2bec3;
        margin-top: 2px;
      }
      .rline {
        display: flex;
        align-items: center;
        margin: 4px 0;
      }
      .rdot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #0fb9b1;
      }
      .rdash {
        flex: 1;
        height: 2px;
        background: #e8ecef;
      }

      .b-details {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .detail-label {
        display: block;
        font-size: 0.72rem;
        color: #b2bec3;
        margin-bottom: 2px;
      }
      .b-passengers {
        flex: 1;
      }
      .pass-tag {
        display: inline-block;
        background: #f0f9f8;
        color: #0fb9b1;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 2px 10px;
        border-radius: 20px;
        margin-right: 4px;
        margin-top: 2px;
      }
      .b-class span {
        font-weight: 600;
        color: #1e272e;
      }
      .total-val {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e272e;
      }

      .b-actions {
        display: flex;
        gap: 0.5rem;
      }
      .btn-ticket {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 8px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.82rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-ticket:hover {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
      }
      .btn-cancel {
        background: #fff;
        color: #e17055;
        border: 2px solid #e17055;
        padding: 8px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.82rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-cancel:hover {
        background: #e17055;
        color: #fff;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class MyFlightsComponent implements OnInit {
  bookings: FlightBooking[] = [];
  loading = false;

  constructor(
    private api: ApiService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.api.getMyFlightBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getDuration(b: FlightBooking): string {
    if (!b.departureTime || !b.arrivalTime) return '';
    const dep = new Date(b.departureTime).getTime();
    const arr = new Date(b.arrivalTime).getTime();
    const diff = Math.abs(arr - dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  downloadTicket(id: number) {
    this.api.downloadFlightTicket(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flight-ticket-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Failed to download ticket.'),
    });
  }

  cancelBooking(id: number) {
    if (!confirm('Are you sure you want to cancel this flight booking?'))
      return;
    this.api.cancelFlightBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: () => alert('Failed to cancel booking.'),
    });
  }
}
