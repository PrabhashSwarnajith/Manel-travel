import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { FlightBooking } from '../../../models/models';

@Component({
  selector: 'app-admin-flight-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-head">
        <h1>Flight Bookings</h1>
        <p>View all customer flight bookings</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading bookings...</p>
      </div>

      <div class="table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Passengers</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings">
              <td>#{{ b.flightBookingId }}</td>
              <td>{{ b.customerName }}</td>
              <td>
                <strong>{{ b.flightNumber }}</strong
                ><br /><span class="sub">{{ b.airline }}</span>
              </td>
              <td>{{ b.origin }} → {{ b.destination }}</td>
              <td>
                <span class="pass-count">{{ b.passengers.length || 0 }}</span>
                <span class="pass-names" *ngFor="let p of b.passengers"
                  >{{ p.firstName }} {{ p.surname }}</span
                >
              </td>
              <td>
                <strong>LKR {{ b.totalPrice | number: '1.0-0' }}</strong>
              </td>
              <td>
                <span
                  class="badge"
                  [class.bg-green]="b.status === 'Confirmed'"
                  [class.bg-red]="b.status === 'Cancelled'"
                >
                  {{ b.status }}
                </span>
              </td>
              <td>{{ b.bookingDate | date: 'MMM d, y' }}</td>
              <td>
                <div class="action-btns">
                  <button
                    class="btn-ticket"
                    (click)="downloadTicket(b.flightBookingId)"
                    *ngIf="b.status === 'Confirmed'"
                    title="Download Ticket"
                  >
                    📥
                  </button>
                  <button
                    class="btn-cancel-sm"
                    (click)="cancelBooking(b.flightBookingId)"
                    *ngIf="b.status === 'Confirmed'"
                    title="Cancel"
                  >
                    ✕
                  </button>
                  <button
                    class="btn-del"
                    (click)="deleteBooking(b.flightBookingId)"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="bookings.length === 0">
              <td colspan="9" class="empty-td">No flight bookings found</td>
            </tr>
          </tbody>
        </table>
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

      .table-card {
        background: #fff;
        border-radius: 14px;
        overflow-x: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 900px;
      }
      th {
        background: #f7f8fa;
        text-align: left;
        padding: 12px 14px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      td {
        padding: 12px 14px;
        font-size: 0.85rem;
        color: #2d3436;
        border-bottom: 1px solid #f0f2f5;
        vertical-align: top;
      }
      tr:hover td {
        background: #fafbfc;
      }
      .empty-td {
        text-align: center;
        color: #b2bec3;
        padding: 2rem;
      }
      .sub {
        font-size: 0.75rem;
        color: #b2bec3;
      }

      .pass-count {
        display: inline-block;
        background: #f0f9f8;
        color: #0fb9b1;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 20px;
        margin-right: 6px;
      }
      .pass-names {
        display: block;
        font-size: 0.75rem;
        color: #636e72;
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

      .action-btns {
        display: flex;
        gap: 4px;
      }
      .btn-ticket,
      .btn-cancel-sm,
      .btn-del {
        background: none;
        border: none;
        font-size: 0.95rem;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 6px;
        transition: background 0.2s;
      }
      .btn-ticket:hover {
        background: #f0f9f8;
      }
      .btn-cancel-sm:hover {
        background: #ffeaea;
      }
      .btn-del:hover {
        background: #ffeaea;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AdminFlightBookingsComponent implements OnInit {
  bookings: FlightBooking[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.api.getAllFlightBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
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
    if (!confirm('Cancel this flight booking?')) return;
    this.api.cancelFlightBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: () => alert('Failed to cancel booking.'),
    });
  }

  deleteBooking(id: number) {
    if (!confirm('Delete this flight booking permanently?')) return;
    this.api.deleteFlightBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: () => alert('Failed to delete booking.'),
    });
  }
}
