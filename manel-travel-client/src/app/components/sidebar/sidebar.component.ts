import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">✈️</span>
          <div class="logo-text" *ngIf="!collapsed">
            <span class="logo-name">Manel</span>
            <span class="logo-sub">Travel</span>
          </div>
        </div>
        <button class="collapse-btn" (click)="toggleSidebar()">
          <span>{{ collapsed ? '▶' : '◀' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <!-- Admin Section -->
        <div class="nav-section" *ngIf="auth.isAdmin() && !collapsed">
          <span class="nav-section-title">Admin Panel</span>
        </div>
        <a
          routerLink="/admin"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">📊</span>
          <span class="nav-label" *ngIf="!collapsed">Dashboard</span>
        </a>
        <a
          routerLink="/admin/packages"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">🎒</span>
          <span class="nav-label" *ngIf="!collapsed">Manage Packages</span>
        </a>
        <a
          routerLink="/admin/users"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">👥</span>
          <span class="nav-label" *ngIf="!collapsed">Manage Users</span>
        </a>
        <a
          routerLink="/admin/bookings"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">📑</span>
          <span class="nav-label" *ngIf="!collapsed">Manage Bookings</span>
        </a>
        <a
          routerLink="/admin/reviews"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">⭐</span>
          <span class="nav-label" *ngIf="!collapsed">Manage Reviews</span>
        </a>
        <a
          routerLink="/admin/notifications"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">🔔</span>
          <span class="nav-label" *ngIf="!collapsed">Send Notifications</span>
        </a>

        <!-- Admin Flights Section -->
        <div class="nav-section" *ngIf="auth.isAdmin() && !collapsed">
          <span class="nav-section-title">Flights</span>
        </div>
        <a
          routerLink="/admin/flights"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">✈️</span>
          <span class="nav-label" *ngIf="!collapsed">Manage Flights</span>
        </a>
        <a
          routerLink="/admin/flight-bookings"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isAdmin()"
        >
          <span class="nav-icon">🎟️</span>
          <span class="nav-label" *ngIf="!collapsed">Flight Bookings</span>
        </a>

        <!-- Customer Section -->
        <div
          class="nav-section"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin() && !collapsed"
        >
          <span class="nav-section-title">My Account</span>
        </div>
        <a
          routerLink="/dashboard"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin()"
        >
          <span class="nav-icon">📊</span>
          <span class="nav-label" *ngIf="!collapsed">Dashboard</span>
        </a>
        <a
          routerLink="/packages"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin()"
        >
          <span class="nav-icon">🎒</span>
          <span class="nav-label" *ngIf="!collapsed">Browse Packages</span>
        </a>
        <a
          routerLink="/my-bookings"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin()"
        >
          <span class="nav-icon">🎫</span>
          <span class="nav-label" *ngIf="!collapsed">My Bookings</span>
        </a>

        <!-- Customer Flights Section -->
        <div
          class="nav-section"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin() && !collapsed"
        >
          <span class="nav-section-title">Flights</span>
        </div>
        <a
          routerLink="/flights"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin()"
        >
          <span class="nav-icon">✈️</span>
          <span class="nav-label" *ngIf="!collapsed">Browse Flights</span>
        </a>
        <a
          routerLink="/my-flights"
          routerLinkActive="active"
          class="nav-item"
          *ngIf="auth.isLoggedIn() && !auth.isAdmin()"
        >
          <span class="nav-icon">🎟️</span>
          <span class="nav-label" *ngIf="!collapsed">My Flights</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div
          class="nav-item logout-link"
          *ngIf="auth.isLoggedIn()"
          (click)="doLogout()"
        >
          <span class="nav-icon">🚪</span>
          <span class="nav-label" *ngIf="!collapsed">Logout</span>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: var(--sidebar-width, 260px);
        height: 100vh;
        background: linear-gradient(180deg, #1e272e 0%, #2d3436 100%);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        transition: width 0.3s ease;
        overflow-x: hidden;
      }
      .sidebar.collapsed {
        width: 72px;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .logo-icon {
        font-size: 2rem;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      .logo-text {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }
      .logo-name {
        font-weight: 700;
        font-size: 1.25rem;
        color: #0fb9b1;
      }
      .logo-sub {
        font-weight: 500;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .collapse-btn {
        background: rgba(255, 255, 255, 0.05);
        border: none;
        color: rgba(255, 255, 255, 0.5);
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        transition: all 0.2s;
      }
      .collapse-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .sidebar-nav {
        flex: 1;
        padding: 1rem 0.75rem;
        overflow-y: auto;
      }
      .nav-section {
        padding: 1rem 0.75rem 0.5rem;
      }
      .nav-section-title {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: rgba(255, 255, 255, 0.35);
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 14px;
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 2px;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
      }
      .nav-item:hover {
        background: rgba(15, 185, 177, 0.1);
        color: #0fb9b1;
      }
      .nav-item.active {
        background: rgba(15, 185, 177, 0.15);
        color: #0fb9b1;
        font-weight: 600;
      }
      .nav-item.active::before {
        content: '';
        position: absolute;
        left: 0;
        width: 3px;
        height: 28px;
        background: #0fb9b1;
        border-radius: 0 3px 3px 0;
      }
      .nav-icon {
        font-size: 1.15rem;
        flex-shrink: 0;
      }
      .nav-label {
        white-space: nowrap;
      }

      .nav-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 1rem 0.75rem;
      }
      .nav-back {
        color: rgba(255, 255, 255, 0.4);
      }
      .nav-back:hover {
        color: rgba(255, 255, 255, 0.7);
        background: rgba(255, 255, 255, 0.05);
      }

      .sidebar-footer {
        padding: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .logout-link {
        color: rgba(255, 255, 255, 0.5);
      }
      .logout-link:hover {
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.1);
      }

      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  collapsed = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.sidebarToggle.emit(this.collapsed);
  }

  doLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
