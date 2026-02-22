import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Flight } from '../../models/models';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flights-page">
      <div class="page-head">
        <h1>Search Flights</h1>
        <p>Find and book the best flights for your journey</p>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="filter-row">
          <div class="filter-group">
            <label>✈ From</label>
            <input
              type="text"
              [(ngModel)]="filters.origin"
              placeholder="Origin city"
              class="f-input"
            />
          </div>
          <div class="swap-btn" (click)="swapCities()">⇄</div>
          <div class="filter-group">
            <label>📍 To</label>
            <input
              type="text"
              [(ngModel)]="filters.destination"
              placeholder="Destination city"
              class="f-input"
            />
          </div>
          <div class="filter-group">
            <label>📅 Date</label>
            <input type="date" [(ngModel)]="filters.date" class="f-input" />
          </div>
          <div class="filter-group">
            <label>🏢 Airline</label>
            <select [(ngModel)]="filters.airline" class="f-input">
              <option value="">All Airlines</option>
              <option *ngFor="let a of airlines" [value]="a">{{ a }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>💺 Class</label>
            <select [(ngModel)]="filters.flightClass" class="f-input">
              <option value="">All Classes</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>
          <button class="btn-search" (click)="search()">🔍 Search</button>
        </div>
      </div>

      <!-- Results -->
      <div class="results-section">
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Searching flights...</p>
        </div>

        <div *ngIf="!loading && flights.length === 0" class="empty">
          <span>✈️</span>
          <p>No flights found. Try adjusting your search.</p>
        </div>

        <div class="flight-list" *ngIf="!loading && flights.length > 0">
          <div class="flight-card" *ngFor="let f of flights">
            <div class="fc-airline">
              <span class="airline-icon">✈</span>
              <div>
                <strong>{{ f.airline }}</strong>
                <span class="flight-no">{{ f.flightNumber }}</span>
              </div>
            </div>

            <div class="fc-route">
              <div class="route-point">
                <span class="time">{{ f.departureTime | date: 'HH:mm' }}</span>
                <span class="city">{{ f.origin }}</span>
              </div>
              <div class="route-line">
                <span class="duration">{{ getDuration(f) }}</span>
                <div class="line-draw">
                  <span class="dot"></span>
                  <span class="dash"></span>
                  <span class="dot"></span>
                </div>
              </div>
              <div class="route-point">
                <span class="time">{{ f.arrivalTime | date: 'HH:mm' }}</span>
                <span class="city">{{ f.destination }}</span>
              </div>
            </div>

            <div class="fc-meta">
              <span class="class-badge">{{ f.class }}</span>
              <span class="seats">{{ f.availableSeats }} seats left</span>
            </div>

            <div class="fc-price">
              <span class="price-label">per person</span>
              <span class="price-val">LKR {{ f.price | number: '1.0-0' }}</span>
              <button
                class="btn-book"
                (click)="bookFlight(f.flightId)"
                [disabled]="f.availableSeats === 0"
              >
                {{ f.availableSeats === 0 ? 'Sold Out' : 'Book Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flights-page {
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

      /* ── Filter Bar ── */
      .filter-bar {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        margin-bottom: 1.5rem;
      }
      .filter-row {
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .filter-group {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 140px;
      }
      .filter-group label {
        font-size: 0.78rem;
        font-weight: 600;
        color: #636e72;
        margin-bottom: 4px;
      }
      .f-input {
        padding: 10px 14px;
        border: 2px solid #e8ecef;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.9rem;
        color: #1e272e;
        transition: border-color 0.2s;
      }
      .f-input:focus {
        outline: none;
        border-color: #0fb9b1;
      }
      .swap-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f0f9f8;
        color: #0fb9b1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 2px;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .swap-btn:hover {
        background: #0fb9b1;
        color: #fff;
      }
      .btn-search {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .btn-search:hover {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
      }

      /* ── Loading / Empty ── */
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

      /* ── Flight Cards ── */
      .flight-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .flight-card {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        display: grid;
        grid-template-columns: 160px 1fr auto 180px;
        align-items: center;
        gap: 1.5rem;
        transition: all 0.25s;
      }
      .flight-card:hover {
        border-color: rgba(15, 185, 177, 0.2);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
      }
      @media (max-width: 900px) {
        .flight-card {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }

      .fc-airline {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .airline-icon {
        width: 40px;
        height: 40px;
        background: #f0f9f8;
        color: #0fb9b1;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }
      .fc-airline strong {
        display: block;
        color: #1e272e;
        font-size: 0.92rem;
      }
      .flight-no {
        display: block;
        font-size: 0.78rem;
        color: #b2bec3;
      }

      .fc-route {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .route-point {
        text-align: center;
      }
      .route-point .time {
        display: block;
        font-size: 1.2rem;
        font-weight: 700;
        color: #1e272e;
      }
      .route-point .city {
        display: block;
        font-size: 0.78rem;
        color: #636e72;
      }
      .route-line {
        flex: 1;
        text-align: center;
      }
      .duration {
        display: block;
        font-size: 0.75rem;
        color: #636e72;
        margin-bottom: 4px;
      }
      .line-draw {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #0fb9b1;
      }
      .dash {
        flex: 1;
        height: 2px;
        background: #e8ecef;
        max-width: 120px;
      }

      .fc-meta {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .class-badge {
        background: #f0f9f8;
        color: #0fb9b1;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;
      }
      .seats {
        font-size: 0.75rem;
        color: #b2bec3;
      }

      .fc-price {
        text-align: center;
      }
      .price-label {
        display: block;
        font-size: 0.72rem;
        color: #b2bec3;
      }
      .price-val {
        display: block;
        font-size: 1.3rem;
        font-weight: 700;
        color: #1e272e;
        margin-bottom: 8px;
      }
      .btn-book {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 9px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
        width: 100%;
      }
      .btn-book:hover:not(:disabled) {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
      }
      .btn-book:disabled {
        background: #b2bec3;
        cursor: not-allowed;
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
export class FlightsSearchComponent implements OnInit {
  flights: Flight[] = [];
  airlines: string[] = [];
  loading = false;

  filters: any = {
    origin: '',
    destination: '',
    airline: '',
    flightClass: '',
    date: '',
  };

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.search();
  }

  search() {
    this.loading = true;
    this.api.getFlights(this.filters).subscribe({
      next: (data) => {
        this.flights = data;
        // Build airline list for filter dropdown
        const set = new Set(data.map((f) => f.airline));
        this.airlines = Array.from(set).sort();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  swapCities() {
    const tmp = this.filters.origin;
    this.filters.origin = this.filters.destination;
    this.filters.destination = tmp;
  }

  getDuration(f: Flight): string {
    const dep = new Date(f.departureTime).getTime();
    const arr = new Date(f.arrivalTime).getTime();
    const diff = Math.abs(arr - dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  bookFlight(id: number) {
    this.router.navigate(['/book-flight', id]);
  }
}
