import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminPackagesComponent } from './pages/admin/packages/admin-packages.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';
import { AdminReviewsComponent } from './pages/admin/reviews/admin-reviews.component';
import { AdminNotificationsComponent } from './pages/admin/notifications/admin-notifications.component';
import { AdminBookingsComponent } from './pages/admin/bookings/admin-bookings.component';
import { FlightsSearchComponent } from './pages/flights-search/flights-search.component';
import { BookFlightComponent } from './pages/book-flight/book-flight.component';
import { MyFlightsComponent } from './pages/my-flights/my-flights.component';
import { AdminFlightsComponent } from './pages/admin/admin-flights/admin-flights.component';
import { AdminFlightBookingsComponent } from './pages/admin/admin-flight-bookings/admin-flight-bookings.component';
import { authGuard, adminGuard, customerGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Customer routes (requires login)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'packages',
    component: PackagesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'packages/:id',
    component: PackageDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [authGuard, customerGuard],
  },

  // Flight routes (Customer)
  {
    path: 'flights',
    component: FlightsSearchComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book-flight/:id',
    component: BookFlightComponent,
    canActivate: [authGuard, customerGuard],
  },
  {
    path: 'my-flights',
    component: MyFlightsComponent,
    canActivate: [authGuard, customerGuard],
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/packages',
    component: AdminPackagesComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/bookings',
    component: AdminBookingsComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/reviews',
    component: AdminReviewsComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/notifications',
    component: AdminNotificationsComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/flights',
    component: AdminFlightsComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/flight-bookings',
    component: AdminFlightBookingsComponent,
    canActivate: [authGuard, adminGuard],
  },

  { path: '**', redirectTo: '' },
];
