import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Flight } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="detail-container" *ngIf="flight">
      <div class="detail-card">
        <div class="top-row">
            <button class="back-btn" routerLink="/flights">← Back to Flights</button>
            <span class="flight-no">{{ flight.flightNumber }}</span>
        </div>
        
        <div class="main-info">
            <img [src]="flight.imageUrl || 'assets/flight-placeholder.jpg'" alt="{{ flight.airline }}">
            <div class="route">
                <h2>{{ flight.origin }}</h2>
                <div class="arrow">➝</div>
                <h2>{{ flight.destination }}</h2>
            </div>
        </div>

        <div class="flight-meta">
            <div class="meta-item">
                <span class="label">Airline</span>
                <span class="value">{{ flight.airline }}</span>
            </div>
            <div class="meta-item">
                <span class="label">Departure</span>
                <span class="value">{{ flight.departureTime | date:'medium' }}</span>
            </div>
            <div class="meta-item">
                <span class="label">Arrival</span>
                <span class="value">{{ flight.arrivalTime | date:'medium' }}</span>
            </div>
            <div class="meta-item">
                <span class="label">Duration</span>
                <span class="value">{{ getDuration(flight.departureTime, flight.arrivalTime) }}</span>
            </div>
        </div>

        <div class="action-bar">
            <div class="price">LKR {{ flight.price | number:'1.2-2' }} <small>/ person</small></div>
            <button class="book-btn" (click)="bookFlight()" [disabled]="bookingParams.processing">
                {{ bookingParams.processing ? 'Booking...' : 'Book Now' }}
            </button>
        </div>

        <div *ngIf="bookingParams.success" class="success-msg">
            Booking Confirmed! Check your <a routerLink="/my-bookings">My Bookings</a>.
        </div>
        <div *ngIf="bookingParams.error" class="error-msg">
            {{ bookingParams.error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { min-height: 100vh; background: #f8f9fa; padding: 2rem; display: flex; justify-content: center; align-items: center; }
    .detail-card { background: white; width: 100%; max-width: 800px; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .top-row { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .back-btn { background: none; border: none; color: #636e72; cursor: pointer; font-size: 0.95rem; font-weight: 500; text-decoration: none; }
    .flight-no { background: #f1f2f6; padding: 5px 10px; border-radius: 5px; color: #2d3436; font-weight: 600; font-size: 0.9rem; }
    
    .main-info { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; text-align: center; }
    .main-info img { width: 100px; height: 100px; object-fit: contain; }
    .route { display: flex; align-items: center; gap: 1rem; color: #2d3436; }
    .route h2 { font-size: 2rem; margin: 0; }
    .arrow { font-size: 1.5rem; color: #0fb9b1; }
    
    .flight-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
    .meta-item { display: flex; flex-direction: column; }
    .label { font-size: 0.85rem; color: #636e72; margin-bottom: 0.25rem; }
    .value { font-size: 1.1rem; font-weight: 600; color: #2d3436; }
    
    .action-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f2f6; padding-top: 2rem; }
    .price { font-size: 2rem; font-weight: 700; color: #0fb9b1; }
    .price small { font-size: 1rem; color: #636e72; font-weight: 400; }
    .book-btn { background: #0fb9b1; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .book-btn:hover { background: #0a8d87; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(15,185,177,0.3); }
    .book-btn:disabled { background: #b2bec3; cursor: not-allowed; transform: none; box-shadow: none; }
    
    .success-msg { margin-top: 1rem; padding: 1rem; background: #dff9fb; color: #0fb9b1; border-radius: 8px; text-align: center; }
    .error-msg { margin-top: 1rem; padding: 1rem; background: #fab1a0; color: #d63031; border-radius: 8px; text-align: center; }
  `]
})
export class FlightDetailComponent implements OnInit {
  flight: Flight | null = null;
  bookingParams = { processing: false, success: false, error: '' };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.api.getFlight(+params['id']).subscribe({
          next: (data) => this.flight = data,
          error: (err) => console.error(err)
        });
      }
    });
  }

  getDuration(start: string, end: string): string {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = e - s;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  }

  bookFlight() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.flight) return;

    this.bookingParams.processing = true;
    this.bookingParams.error = '';

    this.api.createBooking({ flightId: this.flight.flightId }).subscribe({
      next: () => {
        this.bookingParams.processing = false;
        this.bookingParams.success = true;
      },
      error: (err) => {
        this.bookingParams.processing = false;
        this.bookingParams.error = 'Booking failed. Please try again.';
        console.error(err);
      }
    });
  }
}
