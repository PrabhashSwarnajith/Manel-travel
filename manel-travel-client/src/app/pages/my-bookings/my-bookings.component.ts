import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bookings-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <span class="header-tag">🎫 Bookings</span>
          <h1>My Bookings</h1>
          <p>Track and manage all your tour package reservations</p>
        </div>
        <div class="header-actions">
          <button class="btn-export" (click)="downloadPdf()">📄 PDF</button>
          <button class="btn-export" (click)="downloadExcel()">📊 Excel</button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row" *ngIf="bookings.length > 0">
        <div class="mini-stat">
          <span class="mini-num">{{ bookings.length }}</span>
          <span class="mini-label">Total</span>
        </div>
        <div class="mini-stat">
          <span class="mini-num confirmed-color">{{
            getCount('Confirmed')
          }}</span>
          <span class="mini-label">Confirmed</span>
        </div>
        <div class="mini-stat">
          <span class="mini-num pending-color">{{ getCount('Pending') }}</span>
          <span class="mini-label">Pending</span>
        </div>
        <div class="mini-stat">
          <span class="mini-num cancelled-color">{{
            getCount('Cancelled')
          }}</span>
          <span class="mini-label">Cancelled</span>
        </div>
      </div>

      <!-- Booking Cards -->
      <div class="bookings-list" *ngIf="bookings.length > 0">
        <div *ngFor="let b of bookings" class="booking-card">
          <div
            class="card-accent"
            [ngClass]="'accent-' + b.status.toLowerCase()"
          ></div>
          <div class="card-body">
            <div class="card-main">
              <div class="card-icon">🎒</div>
              <div class="card-info">
                <h3>{{ b.packageInfo }}</h3>
                <div class="card-meta">
                  <span>📅 {{ b.bookingDate | date: 'mediumDate' }}</span>
                  <span
                    >👥 {{ b.numberOfParticipants }} participant{{
                      b.numberOfParticipants > 1 ? 's' : ''
                    }}</span
                  >
                  <span>🏷️ {{ b.bookingType }}</span>
                </div>
              </div>
            </div>
            <div class="card-right">
              <span class="card-price"
                >Rs. {{ b.price | number: '1.0-0' }}</span
              >
              <span
                class="status-badge"
                [ngClass]="'st-' + b.status.toLowerCase()"
              >
                {{ b.status }}
              </span>
              <button
                *ngIf="b.status === 'Pending' || b.status === 'Confirmed'"
                class="cancel-btn"
                (click)="cancelBooking(b)"
                [disabled]="b.bookingId === cancellingId"
              >
                {{
                  b.bookingId === cancellingId
                    ? 'Cancelling...'
                    : 'Cancel Booking'
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="bookings.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No bookings yet</h3>
        <p>You haven't booked any tour packages. Start exploring now!</p>
        <a routerLink="/packages" class="btn-explore">Browse Packages →</a>
      </div>
    </div>
  `,
  styles: [
    `
      .bookings-page {
        animation: fadeIn 0.3s ease;
      }

      /* ── Header ── */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .header-tag {
        display: inline-block;
        background: rgba(15, 185, 177, 0.1);
        color: #0fb9b1;
        padding: 5px 14px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .page-header h1 {
        font-size: 1.7rem;
        font-weight: 700;
        color: #1e272e;
        margin: 0 0 4px;
      }
      .page-header p {
        color: #636e72;
        font-size: 0.9rem;
        margin: 0;
      }
      .header-actions {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      .btn-export {
        background: #fff;
        border: 1px solid #e8ecef;
        padding: 9px 18px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.84rem;
        color: #636e72;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-export:hover {
        border-color: #0fb9b1;
        color: #0fb9b1;
      }

      /* ── Stats Row ── */
      .stats-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
      }
      .mini-stat {
        flex: 1;
        min-width: 100px;
        background: #fff;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      .mini-num {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e272e;
      }
      .mini-label {
        font-size: 0.78rem;
        color: #b2bec3;
        font-weight: 500;
      }
      .confirmed-color {
        color: #00b894;
      }
      .pending-color {
        color: #fdcb6e;
      }
      .cancelled-color {
        color: #d63031;
      }

      /* ── Cards ── */
      .bookings-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .booking-card {
        background: #fff;
        border-radius: 14px;
        display: flex;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        transition: all 0.25s;
        border: 1px solid transparent;
      }
      .booking-card:hover {
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
        border-color: rgba(15, 185, 177, 0.12);
      }

      .card-accent {
        width: 5px;
        flex-shrink: 0;
      }
      .accent-confirmed {
        background: #00b894;
      }
      .accent-pending {
        background: #fdcb6e;
      }
      .accent-cancelled {
        background: #d63031;
      }
      .accent-completed {
        background: #0984e3;
      }

      .card-body {
        flex: 1;
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .card-main {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        min-width: 0;
      }

      .card-icon {
        width: 46px;
        height: 46px;
        background: #f0f9f8;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .card-info {
        min-width: 0;
      }
      .card-info h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e272e;
        margin: 0 0 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .card-meta span {
        font-size: 0.8rem;
        color: #b2bec3;
        white-space: nowrap;
      }

      .card-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex-shrink: 0;
      }

      .card-price {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e272e;
      }

      .status-badge {
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .st-confirmed {
        background: #e6f9f0;
        color: #00b894;
      }
      .st-pending {
        background: #fff8e1;
        color: #f39c12;
      }
      .st-cancelled {
        background: #fef0f0;
        color: #d63031;
      }
      .st-completed {
        background: #e8f4fd;
        color: #0984e3;
      }

      .cancel-btn {
        background: #fff5f5;
        border: 1px solid #fed7d7;
        color: #e74c3c;
        padding: 6px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 600;
        font-family: inherit;
        transition: all 0.2s;
      }
      .cancel-btn:hover:not(:disabled) {
        background: #e74c3c;
        color: #fff;
        border-color: #e74c3c;
      }
      .cancel-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ── Empty ── */
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      }
      .empty-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
      }
      .empty-state h3 {
        font-size: 1.25rem;
        color: #1e272e;
        margin: 0 0 0.5rem;
        font-weight: 600;
      }
      .empty-state p {
        color: #636e72;
        font-size: 0.92rem;
        margin: 0 0 1.5rem;
      }
      .btn-explore {
        display: inline-block;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        padding: 11px 28px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        text-decoration: none;
        transition: all 0.25s;
      }
      .btn-explore:hover {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
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

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
        }
        .card-body {
          flex-direction: column;
          align-items: flex-start;
        }
        .card-right {
          align-items: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .stats-row {
          gap: 0.5rem;
        }
        .mini-stat {
          min-width: 70px;
          padding: 0.75rem;
        }
      }
    `,
  ],
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  cancellingId: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getMyBookings().subscribe((data) => (this.bookings = data));
  }

  getCount(status: string): number {
    return this.bookings.filter((b) => b.status === status).length;
  }

  cancelBooking(booking: Booking) {
    if (
      !confirm(
        `Are you sure you want to cancel your booking for "${booking.packageInfo}"?`,
      )
    )
      return;
    this.cancellingId = booking.bookingId;
    this.api.cancelBooking(booking.bookingId).subscribe({
      next: () => {
        this.cancellingId = null;
        this.loadBookings();
      },
      error: (err) => {
        this.cancellingId = null;
        alert(err.error?.message || 'Failed to cancel booking');
      },
    });
  }

  downloadPdf() {
    this.api.exportBookingsPdf().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-bookings.pdf';
      a.click();
    });
  }

  downloadExcel() {
    this.api.exportBookingsExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-bookings.xlsx';
      a.click();
    });
  }
}
