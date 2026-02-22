import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    ChatbotComponent,
  ],
  template: `
    <!-- Global Chatbot (Customer/Public only) -->
    <app-chatbot *ngIf="!auth.isAdmin()"></app-chatbot>

    <!-- Public layout: no sidebar (Home, Login, Register) -->
    <div *ngIf="!showSidebar" class="public-layout">
      <app-navbar></app-navbar>
      <main class="public-content" [class.full-width]="isFullWidth">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Dashboard layout: with sidebar (Admin + Customer dashboard) -->
    <div *ngIf="showSidebar" class="app-layout">
      <app-sidebar (sidebarToggle)="onSidebarToggle($event)"></app-sidebar>
      <div class="main-area" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-navbar></app-navbar>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .public-layout {
        min-height: 100vh;
      }
      .public-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .public-content.full-width {
        max-width: 100%;
        padding: 0;
      }
      .app-layout {
        display: flex;
        min-height: 100vh;
      }
      .main-area {
        flex: 1;
        margin-left: 260px;
        transition: margin-left 0.3s ease;
      }
      .main-area.sidebar-collapsed {
        margin-left: 72px;
      }
      .page-content {
        padding: 2rem;
        max-width: 1400px;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  sidebarCollapsed = false;
  showSidebar = false;
  isFullWidth = false;

  constructor(
    private router: Router,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.updateLayout(e.urlAfterRedirects || e.url);
      });
    // Check initial URL
    this.updateLayout(this.router.url);
  }

  private updateLayout(url: string) {
    const isLoggedIn = this.auth.isLoggedIn();
    const isAdmin = this.auth.isAdmin();

    // Show sidebar for all dashboard routes:
    // - /admin/* (admin dashboard)
    // - /dashboard (customer dashboard)
    // - /my-bookings (customer bookings)
    // - /packages/* when logged in (browse packages in dashboard mode)
    // - /flights, /book-flight, /my-flights (flight booking routes)
    this.showSidebar =
      url.startsWith('/admin') ||
      url.startsWith('/dashboard') ||
      url.startsWith('/my-bookings') ||
      url.startsWith('/flights') ||
      url.startsWith('/book-flight') ||
      url.startsWith('/my-flights') ||
      (isLoggedIn && url.startsWith('/packages'));

    // Home page (/) and auth pages should be full width (no padding/max-width)
    this.isFullWidth = url === '/' || url === '/login' || url === '/register';
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
