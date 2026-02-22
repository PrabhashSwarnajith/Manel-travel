import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Flight } from '../../models/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flights-container">
      <div class="hero">
        <h1>Find Your Next Adventure</h1>
        <p>Book flights to top destinations easily.</p>
        
        <div class="search-box">
          <div class="form-group">
            <label>From</label>
            <input type="text" [(ngModel)]="searchOrigin" placeholder="e.g. Colombo">
          </div>
          <div class="form-group">
            <label>To</label>
            <input type="text" [(ngModel)]="searchDest" placeholder="e.g. London">
          </div>
          <button (click)="filterFlights()">Search Flights</button>
        </div>
      </div>

      <div class="flight-list">
        <!-- Loading State -->
        <div *ngIf="loading" class="loading">Loading flights...</div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredFlights.length === 0" class="empty">
          No flights found matching your search.
        </div>

        <!-- Flight Cards -->
        <div *ngFor="let flight of filteredFlights" class="flight-card">
          <div class="card-left">
            <img [src]="flight.imageUrl || 'assets/flight-placeholder.jpg'" alt="{{ flight.airline }}" class="airline-logo">
            <div class="flight-details">
              <h3>{{ flight.origin }} ➝ {{ flight.destination }}</h3>
              <p class="airline">{{ flight.airline }} • {{ flight.flightNumber }}</p>
              <p class="time">
                {{ flight.departureTime | date:'short' }} - {{ flight.arrivalTime | date:'shortTime' }}
              </p>
            </div>
          </div>
          <div class="card-right">
            <div class="price">LKR {{ flight.price | number:'1.2-2' }}</div>
            <a [routerLink]="['/flights', flight.flightId]" class="book-btn">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flights-container { min-height: 100vh; background: #f8f9fa; }
    .hero { background: linear-gradient(135deg, #0fb9b1, #0a8d87); color: white; padding: 4rem 2rem; text-align: center; border-radius: 0 0 50px 50px; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .search-box { background: white; padding: 1.5rem; border-radius: 15px; display: flex; gap: 1rem; max-width: 800px; margin: 2rem auto -5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); align-items: flex-end; flex-wrap: wrap; }
    .form-group { flex: 1; min-width: 200px; }
    .form-group label { display: block; color: #636e72; margin-bottom: 0.5rem; font-weight: 500; text-align: left; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #dfe6e9; border-radius: 8px; font-size: 1rem; }
    .search-box button { background: #0fb9b1; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; height: 46px; }
    .search-box button:hover { background: #0a8d87; }
    
    .flight-list { max-width: 1000px; margin: 6rem auto 2rem; padding: 0 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .flight-card { background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; transition: 0.2s; }
    .flight-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    .card-left { display: flex; align-items: center; gap: 1.5rem; }
    .airline-logo { width: 60px; height: 60px; object-fit: contain; border-radius: 50%; border: 1px solid #f1f2f6; }
    .flight-details h3 { margin: 0 0 0.5rem; color: #2d3436; font-size: 1.3rem; }
    .airline { color: #636e72; margin: 0 0 0.25rem; font-weight: 500; }
    .time { color: #b2bec3; font-size: 0.9rem; }
    .card-right { text-align: right; }
    .price { font-size: 1.5rem; font-weight: 700; color: #0fb9b1; margin-bottom: 0.5rem; }
    .book-btn { display: inline-block; background: #2d3436; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; transition: 0.2s; }
    .book-btn:hover { background: #000; }
    .loading, .empty { text-align: center; color: #636e72; padding: 2rem; font-size: 1.1rem; }
  `]
})
export class FlightsComponent implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  loading = true;
  searchOrigin = '';
  searchDest = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.filteredFlights = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load flights', err);
        this.loading = false;
      }
    });
  }

  filterFlights() {
    this.filteredFlights = this.flights.filter(f =>
      f.origin.toLowerCase().includes(this.searchOrigin.toLowerCase()) &&
      f.destination.toLowerCase().includes(this.searchDest.toLowerCase())
    );
  }
}
