import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Notification } from '../../models/models';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Public Navbar -->
    <header *ngIf="isPublic && !isAuthPage" class="pub-header">
      <div class="pub-inner">
        <a routerLink="/" class="pub-logo">
          <span class="logo-icon">✈️</span>
          <span class="logo-name"
            >Manel<span class="logo-accent">Travel</span></span
          >
        </a>
        <nav class="pub-nav">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a (click)="scrollToSection('about')" class="nav-link">About</a>
          <a (click)="scrollToSection('contact')" class="nav-link">Contact</a>
        </nav>
        <div class="pub-actions">
          <ng-container *ngIf="!auth.isLoggedIn()">
            <a routerLink="/login" class="btn-login">Login</a>
          </ng-container>

          <ng-container *ngIf="auth.isLoggedIn() && auth.isAdmin()">
            <a routerLink="/admin" class="dashboard-btn">📊 Dashboard</a>
            <div class="user-pill">
              <span class="user-avatar">{{ getInitials() }}</span>
              <span class="user-name">{{ getUserName() }}</span>
            </div>
            <button class="pub-logout" (click)="logout()">Logout</button>
          </ng-container>

          <ng-container *ngIf="auth.isLoggedIn() && !auth.isAdmin()">
            <a routerLink="/dashboard" class="dashboard-btn">📊 Dashboard</a>
            <div class="user-pill">
              <span class="user-avatar">{{ getInitials() }}</span>
              <span class="user-name">{{ getUserName() }}</span>
            </div>
            <button class="pub-logout" (click)="logout()">Logout</button>
          </ng-container>
        </div>
      </div>
    </header>

    <!-- Dashboard Navbar -->
    <header *ngIf="!isPublic" class="dash-header">
      <div class="dash-left">
        <span class="breadcrumb">{{ getBreadcrumb() }}</span>
      </div>
      <div class="dash-right">
        <ng-container *ngIf="auth.isLoggedIn()">
          <!-- Notifications -->
          <div class="notification-container">
            <button
              class="notification-bell"
              (click)="toggleNotifications()"
              [class.has-unread]="unreadCount > 0"
            >
              🔔
              <span *ngIf="unreadCount > 0" class="unread-badge">{{
                unreadCount
              }}</span>
            </button>
            <div *ngIf="showNotifications" class="notification-dropdown">
              <div class="notification-header">
                <h4>Notifications</h4>
              </div>
              <div class="notification-list">
                <div
                  *ngFor="let notif of notifications"
                  class="notification-item"
                  [class.unread]="!notif.isRead"
                  (click)="markAsRead(notif)"
                >
                  <div class="notification-content">
                    <p>{{ notif.message }}</p>
                    <small>{{ notif.createdAt | date: 'short' }}</small>
                  </div>
                  <div *ngIf="!notif.isRead" class="unread-dot"></div>
                </div>
                <div
                  *ngIf="notifications.length === 0"
                  class="no-notifications"
                >
                  No notifications
                </div>
              </div>
            </div>
          </div>
          <div class="user-pill">
            <span class="user-avatar">{{ getInitials() }}</span>
            <span class="user-name">{{ getUserName() }}</span>
          </div>
        </ng-container>
      </div>
    </header>
  `,
  styles: [
    `
      .pub-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #e8ecef;
      }
      .pub-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .pub-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }
      .logo-icon {
        font-size: 1.6rem;
      }
      .logo-name {
        font-size: 1.35rem;
        font-weight: 700;
        color: #1e272e;
      }
      .logo-accent {
        color: #0fb9b1;
      }
      .pub-nav {
        display: flex;
        gap: 2rem;
      }
      .pub-nav a {
        font-weight: 500;
        font-size: 0.95rem;
        color: #636e72;
        padding: 6px 0;
        position: relative;
        transition: color 0.2s;
        text-decoration: none;
      }
      .pub-nav a:hover,
      .pub-nav a.active {
        color: #0fb9b1;
      }
      .pub-nav a.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: #0fb9b1;
        border-radius: 2px;
      }
      .pub-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .nav-link {
        cursor: pointer;
      }
      .btn-login {
        background: #0fb9b1;
        color: #fff;
        padding: 9px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        text-decoration: none;
        transition: all 0.25s;
      }
      .btn-login:hover {
        background: #0a8d87;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(15, 185, 177, 0.3);
      }
      .dashboard-btn,
      .bookings-btn {
        background: #f8f9fb;
        padding: 8px 18px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.88rem;
        color: #0fb9b1;
        border: 1px solid rgba(15, 185, 177, 0.2);
        transition: all 0.2s;
        text-decoration: none;
      }
      .dashboard-btn:hover,
      .bookings-btn:hover {
        background: #0fb9b1;
        color: #fff;
      }
      .pub-logout {
        background: none;
        border: none;
        cursor: pointer;
        color: #b2bec3;
        font-family: inherit;
        font-weight: 500;
        font-size: 0.88rem;
      }
      .pub-logout:hover {
        color: #e74c3c;
      }
      .dash-header {
        position: sticky;
        top: 0;
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        height: 65px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #e8ecef;
      }
      .dash-left {
        display: flex;
        align-items: center;
      }
      .breadcrumb {
        font-size: 0.95rem;
        color: #636e72;
        font-weight: 500;
      }
      .dash-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-pill {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f8f9fb;
        padding: 5px 16px 5px 5px;
        border-radius: 30px;
        border: 1px solid #e8ecef;
      }
      .user-avatar {
        width: 34px;
        height: 34px;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.8rem;
      }
      .user-name {
        font-weight: 600;
        font-size: 0.88rem;
        color: #1e272e;
      }

      /* Notification Styles */
      .notification-container {
        position: relative;
        margin-right: 1rem;
      }

      .notification-bell {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s;
        position: relative;
      }

      .notification-bell:hover {
        background-color: #f8f9fa;
      }

      .notification-bell.has-unread {
        color: #dc3545;
      }

      .unread-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        background: #dc3545;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      .notification-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 350px;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-height: 400px;
        overflow: hidden;
      }

      .notification-header {
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        background: #f8f9fa;
      }

      .notification-header h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #2d3748;
      }

      .notification-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .notification-item {
        padding: 1rem;
        border-bottom: 1px solid #f1f3f4;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .notification-item:hover {
        background-color: #f8f9fa;
      }

      .notification-item.unread {
        background-color: #fff3cd;
      }

      .notification-content p {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #2d3748;
        line-height: 1.4;
      }

      .notification-content small {
        color: #718096;
        font-size: 0.8rem;
      }

      .unread-dot {
        width: 8px;
        height: 8px;
        background: #dc3545;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 4px;
      }

      .no-notifications {
        padding: 2rem;
        text-align: center;
        color: #718096;
        font-style: italic;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isPublic = true;
  isAuthPage = false;
  private currentUrl = '/';
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;
  private subscription: Subscription = new Subscription();

  constructor(
    public auth: AuthService,
    private router: Router,
    private api: ApiService,
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl = e.urlAfterRedirects || e.url;
        this.checkPublic();
      });
    // Initial check
    this.currentUrl = this.router.url;
    this.checkPublic();
  }

  private checkPublic() {
    this.isPublic =
      this.currentUrl === '/' ||
      (!this.currentUrl.startsWith('/admin') &&
      !this.currentUrl.startsWith('/dashboard') &&
      !this.currentUrl.startsWith('/my-bookings') &&
      !this.currentUrl.startsWith('/my-flights') &&
      !this.currentUrl.startsWith('/book-flight') &&
      !this.currentUrl.startsWith('/flights-search'));
    this.isAuthPage =
      this.currentUrl === '/login' || this.currentUrl === '/register';
  }

  scrollToSection(id: string) {
    if (this.currentUrl !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(
          () =>
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
          100,
        );
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  getInitials(): string {
    const user = this.auth.getCurrentUser();
    if (!user || (!user.name && !user.email)) return '?';
    const name = user.name || user.email;
    const parts = name.split(' ');
    if (name === 'System Admin') return 'SA';
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  }

  getUserName(): string {
    const user = this.auth.getCurrentUser();
    return user ? user.name || user.email : '';
  }

  getBreadcrumb(): string {
    // Admin breadcrumbs
    if (this.currentUrl === '/admin') return '📊 / Dashboard';
    if (this.currentUrl.includes('/admin/packages'))
      return '🎒 / Manage Packages';
    if (this.currentUrl.includes('/admin/users')) return '👥 / Manage Users';
    if (this.currentUrl.includes('/admin/bookings'))
      return '📑 / Manage Bookings';
    if (this.currentUrl.includes('/admin/reviews'))
      return '⭐ / Manage Reviews';
    if (this.currentUrl.includes('/admin/notifications'))
      return '🔔 / Send Notifications';
    // Customer breadcrumbs
    if (this.currentUrl === '/dashboard') return '📊 / Dashboard';
    if (this.currentUrl.startsWith('/my-bookings')) return '🎫 / My Bookings';
    if (this.currentUrl.startsWith('/packages/')) return '🎒 / Package Details';
    if (this.currentUrl === '/packages') return '🎒 / Browse Packages';
    return this.auth.isAdmin() ? 'Admin' : 'Dashboard';
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadNotifications();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadNotifications() {
    this.subscription.add(
      this.api.getMyNotifications().subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.filter((n) => !n.isRead).length;
        },
        error: (err) => console.error('Failed to load notifications', err),
      }),
    );
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.subscription.add(
        this.api.markNotificationRead(notification.notificationId).subscribe({
          next: () => {
            notification.isRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          },
          error: (err) => console.error('Failed to mark as read', err),
        }),
      );
    }
  }
}
