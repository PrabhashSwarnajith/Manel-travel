import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Booking, TourPackage } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Welcome Header -->
      <div class="welcome-card">
        <div class="welcome-text">
          <h1>
            Welcome back, <span class="highlight">{{ userName }}</span> 👋
          </h1>
          <p>Here's an overview of your travel activity.</p>
        </div>
        <div class="welcome-actions">
          <a routerLink="/packages" class="btn-explore">🎒 Browse Packages</a>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🎫</div>
          <div class="stat-body">
            <span class="stat-num">{{ totalBookings }}</span>
            <span class="stat-label">Total Bookings</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-body">
            <span class="stat-num">{{ confirmedBookings }}</span>
            <span class="stat-label">Confirmed</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">⏳</div>
          <div class="stat-body">
            <span class="stat-num">{{ pendingBookings }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">💰</div>
          <div class="stat-body">
            <span class="stat-num">{{
              totalSpent | currency: 'USD' : 'symbol' : '1.0-0'
            }}</span>
            <span class="stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="section-row">
        <div class="recent-bookings">
          <div class="section-header">
            <h2>Recent Bookings</h2>
            <a routerLink="/my-bookings" class="view-all-link">View All →</a>
          </div>
          <div class="bookings-list" *ngIf="recentBookings.length > 0">
            <div class="booking-item" *ngFor="let b of recentBookings">
              <div class="booking-icon">🎒</div>
              <div class="booking-details">
                <strong>{{ b.packageInfo }}</strong>
                <span
                  >{{ b.bookingDate | date: 'mediumDate' }} ·
                  {{ b.numberOfParticipants }} participant(s)</span
                >
              </div>
              <div>
                <span
                  class="booking-status"
                  [ngClass]="'status-' + b.status.toLowerCase()"
                  >{{ b.status }}</span
                >
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="recentBookings.length === 0">
            <span class="empty-icon">📭</span>
            <p>No bookings yet. Start exploring packages!</p>
            <a routerLink="/packages" class="btn-sm-explore">Browse Packages</a>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <a routerLink="/packages" class="action-card">
            <div class="action-icon">🎒</div>
            <div>
              <strong>Browse Packages</strong>
              <span>Explore new tour packages</span>
            </div>
            <span class="action-arrow">→</span>
          </a>
          <a routerLink="/my-bookings" class="action-card">
            <div class="action-icon">🎫</div>
            <div>
              <strong>My Bookings</strong>
              <span>View all your bookings</span>
            </div>
            <span class="action-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        animation: fadeIn 0.3s ease;
      }

      .welcome-card {
        background: linear-gradient(135deg, #1e272e, #2d3436);
        border-radius: 18px;
        padding: 2rem 2.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        color: #fff;
      }
      .welcome-text h1 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .highlight {
        color: #0fb9b1;
      }
      .welcome-text p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.95rem;
      }
      .btn-explore {
        background: #0fb9b1;
        color: #fff;
        padding: 12px 28px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 0.95rem;
        transition: all 0.3s;
        text-decoration: none;
      }
      .btn-explore:hover {
        background: #0a8d87;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(15, 185, 177, 0.3);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: #fff;
        border-radius: 14px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
      }
      .stat-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      }
      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
      }
      .stat-icon.blue {
        background: #e8f4fd;
      }
      .stat-icon.green {
        background: #d4edda;
      }
      .stat-icon.orange {
        background: #fff3cd;
      }
      .stat-icon.purple {
        background: #e8daef;
      }
      .stat-num {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e272e;
      }
      .stat-label {
        font-size: 0.82rem;
        color: #636e72;
      }

      .section-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
      }
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.25rem;
      }
      .section-header h2 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e272e;
      }
      .view-all-link {
        color: #0fb9b1;
        font-weight: 600;
        font-size: 0.88rem;
        text-decoration: none;
      }

      .recent-bookings {
        background: #fff;
        border-radius: 14px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      }
      .booking-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #f0f2f5;
      }
      .booking-item:last-child {
        border-bottom: none;
      }
      .booking-icon {
        width: 42px;
        height: 42px;
        background: #f0f9f8;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      .booking-details {
        flex: 1;
      }
      .booking-details strong {
        display: block;
        color: #1e272e;
        font-size: 0.92rem;
      }
      .booking-details span {
        color: #b2bec3;
        font-size: 0.82rem;
      }
      .booking-status {
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .status-confirmed {
        background: #d4edda;
        color: #155724;
      }
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      .status-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
      .status-completed {
        background: #d1ecf1;
        color: #0c5460;
      }

      .empty-state {
        text-align: center;
        padding: 2rem 1rem;
      }
      .empty-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.75rem;
      }
      .empty-state p {
        color: #636e72;
        font-size: 0.92rem;
        margin-bottom: 1rem;
      }
      .btn-sm-explore {
        background: #0fb9b1;
        color: #fff;
        padding: 8px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        text-decoration: none;
      }

      .quick-actions {
        background: #fff;
        border-radius: 14px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      }
      .quick-actions h2 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e272e;
        margin-bottom: 1.25rem;
      }
      .action-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid #e8ecef;
        transition: all 0.2s;
        margin-bottom: 0.75rem;
        text-decoration: none;
        color: inherit;
      }
      .action-card:hover {
        border-color: rgba(15, 185, 177, 0.3);
        background: #f0f9f8;
      }
      .action-icon {
        width: 42px;
        height: 42px;
        background: #f8f9fb;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      .action-card strong {
        display: block;
        font-size: 0.92rem;
        color: #1e272e;
      }
      .action-card span {
        font-size: 0.8rem;
        color: #b2bec3;
      }
      .action-arrow {
        margin-left: auto;
        color: #0fb9b1;
        font-size: 1.2rem;
        font-weight: 600;
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

      @media (max-width: 1024px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .section-row {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
        .welcome-card {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  userName = '';
  bookings: Booking[] = [];
  recentBookings: Booking[] = [];
  totalBookings = 0;
  confirmedBookings = 0;
  pendingBookings = 0;
  totalSpent = 0;

  constructor(
    private auth: AuthService,
    private api: ApiService,
  ) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.userName = user?.name || 'Traveler';
    this.loadBookings();
  }

  loadBookings() {
    this.api.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.recentBookings = bookings.slice(0, 5);
        this.totalBookings = bookings.length;
        this.confirmedBookings = bookings.filter(
          (b) => b.status === 'Confirmed',
        ).length;
        this.pendingBookings = bookings.filter(
          (b) => b.status === 'Pending',
        ).length;
        this.totalSpent = bookings
          .filter((b) => b.status !== 'Cancelled')
          .reduce((sum, b) => sum + (b.price || 0), 0);
      },
      error: () => {},
    });
  }
}
