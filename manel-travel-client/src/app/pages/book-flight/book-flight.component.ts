import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Flight } from '../../models/models';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-page" *ngIf="flight">
      <div class="page-head">
        <h1>Book Flight</h1>
        <p>
          {{ flight.origin }} → {{ flight.destination }} ·
          {{ flight.flightNumber }}
        </p>
      </div>

      <!-- Flight Summary -->
      <div class="summary-card">
        <div class="sum-route">
          <div class="sum-point">
            <span class="sum-time">{{
              flight.departureTime | date: 'HH:mm'
            }}</span>
            <span class="sum-city">{{ flight.origin }}</span>
            <span class="sum-date">{{
              flight.departureTime | date: 'MMM d, y'
            }}</span>
          </div>
          <div class="sum-line">
            <span class="sum-dur">{{ getDuration() }}</span>
            <div class="dash-line">
              <span class="d"></span><span class="ln"></span
              ><span class="d"></span>
            </div>
          </div>
          <div class="sum-point">
            <span class="sum-time">{{
              flight.arrivalTime | date: 'HH:mm'
            }}</span>
            <span class="sum-city">{{ flight.destination }}</span>
            <span class="sum-date">{{
              flight.arrivalTime | date: 'MMM d, y'
            }}</span>
          </div>
        </div>
        <div class="sum-info">
          <span
            ><strong>{{ flight.airline }}</strong> ·
            {{ flight.flightNumber }}</span
          >
          <span>{{ flight.class }} Class</span>
          <span>LKR {{ flight.price | number: '1.0-0' }} / person</span>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="section-card">
        <h2>Contact Details</h2>
        <div class="form-row three">
          <div class="form-group">
            <label>Country Code</label>
            <select [(ngModel)]="contact.countryCode" class="f-input">
              <option value="+94">🇱🇰 +94</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+65">🇸🇬 +65</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+49">🇩🇪 +49</option>
            </select>
          </div>
          <div class="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              [(ngModel)]="contact.mobileNumber"
              placeholder="7X XXX XXXX"
              class="f-input"
            />
          </div>
          <div class="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              [(ngModel)]="contact.contactEmail"
              placeholder="email@example.com"
              class="f-input"
            />
          </div>
        </div>
      </div>

      <!-- Passenger Details -->
      <div class="section-card" *ngFor="let p of passengers; let i = index">
        <div class="pass-head">
          <h2>Passenger {{ i + 1 }}</h2>
          <button
            class="btn-remove"
            *ngIf="passengers.length > 1"
            (click)="removePassenger(i)"
          >
            ✕ Remove
          </button>
        </div>

        <div class="form-row two">
          <div class="form-group">
            <label>Age Category *</label>
            <select [(ngModel)]="p.ageCategory" class="f-input">
              <option value="Adult">Adult</option>
              <option value="Child">Child</option>
              <option value="Infant">Infant</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nationality *</label>
            <input
              type="text"
              [(ngModel)]="p.nationality"
              placeholder="e.g. Sri Lankan"
              class="f-input"
            />
          </div>
        </div>

        <div class="form-row three">
          <div class="form-group">
            <label>First / Middle Name *</label>
            <input
              type="text"
              [(ngModel)]="p.firstName"
              placeholder="First name"
              class="f-input"
            />
          </div>
          <div class="form-group">
            <label>Surname *</label>
            <input
              type="text"
              [(ngModel)]="p.surname"
              placeholder="Surname"
              class="f-input"
            />
          </div>
          <div class="form-group">
            <label>Gender *</label>
            <select [(ngModel)]="p.gender" class="f-input">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-row three">
          <div class="form-group">
            <label>Date of Birth *</label>
            <input type="date" [(ngModel)]="p.dateOfBirth" class="f-input" />
          </div>
          <div class="form-group">
            <label>Passport Number *</label>
            <input
              type="text"
              [(ngModel)]="p.passportNumber"
              placeholder="Passport number"
              class="f-input"
            />
          </div>
          <div class="form-group">
            <label>Passport Expiry</label>
            <div class="expiry-row">
              <input
                type="date"
                [(ngModel)]="p.passportExpiry"
                class="f-input"
                [disabled]="p.noExpiration"
              />
              <label class="cb-label">
                <input type="checkbox" [(ngModel)]="p.noExpiration" />
                No Expiration
              </label>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-add-pass" (click)="addPassenger()">
        + Add Passenger
      </button>

      <!-- Total & Submit -->
      <div class="total-bar">
        <div class="total-left">
          <span class="total-label">Total Price</span>
          <span class="total-val">LKR {{ totalPrice | number: '1.0-0' }}</span>
          <span class="total-sub"
            >{{ passengers.length }} passenger(s) × LKR
            {{ flight.price | number: '1.0-0' }}</span
          >
        </div>
        <button
          class="btn-submit"
          (click)="submitBooking()"
          [disabled]="submitting"
        >
          {{ submitting ? 'Booking...' : '✈ Confirm Booking' }}
        </button>
      </div>

      <div class="error-msg" *ngIf="error">{{ error }}</div>
      <div class="success-msg" *ngIf="success">{{ success }}</div>
    </div>

    <div class="loading-page" *ngIf="!flight && !loadError">
      <div class="spinner"></div>
      <p>Loading flight details...</p>
    </div>
    <div class="error-page" *ngIf="loadError">
      <p>{{ loadError }}</p>
      <button class="btn-back" (click)="goBack()">← Back to Flights</button>
    </div>
  `,
  styles: [
    `
      .booking-page {
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

      /* ── Summary Card ── */
      .summary-card {
        background: linear-gradient(135deg, #0fb9b1 0%, #0a8d87 100%);
        border-radius: 14px;
        padding: 1.5rem;
        color: #fff;
        margin-bottom: 1.5rem;
      }
      .sum-route {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 1rem;
      }
      .sum-point {
        text-align: center;
      }
      .sum-time {
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
      }
      .sum-city {
        display: block;
        font-size: 0.95rem;
        opacity: 0.9;
      }
      .sum-date {
        display: block;
        font-size: 0.75rem;
        opacity: 0.7;
      }
      .sum-line {
        text-align: center;
        flex: 1;
        max-width: 200px;
      }
      .sum-dur {
        display: block;
        font-size: 0.8rem;
        opacity: 0.8;
        margin-bottom: 4px;
      }
      .dash-line {
        display: flex;
        align-items: center;
      }
      .d {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
      }
      .ln {
        flex: 1;
        height: 2px;
        background: rgba(255, 255, 255, 0.4);
      }
      .sum-info {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        font-size: 0.85rem;
        opacity: 0.9;
        flex-wrap: wrap;
      }

      /* ── Section Cards ── */
      .section-card {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        margin-bottom: 1rem;
      }
      .section-card h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e272e;
        margin: 0 0 1rem;
      }
      .pass-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .pass-head h2 {
        margin: 0;
      }
      .btn-remove {
        background: none;
        border: none;
        color: #e17055;
        font-size: 0.85rem;
        cursor: pointer;
        font-weight: 600;
        font-family: inherit;
      }
      .btn-remove:hover {
        color: #d63031;
      }

      /* ── Form Layout ── */
      .form-row {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .form-row.two {
        grid-template-columns: 1fr 1fr;
      }
      .form-row.three {
        grid-template-columns: 1fr 1fr 1fr;
      }
      @media (max-width: 768px) {
        .form-row.two,
        .form-row.three {
          grid-template-columns: 1fr;
        }
      }
      .form-group {
        display: flex;
        flex-direction: column;
      }
      .form-group label {
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
      .f-input:disabled {
        background: #f7f8fa;
        color: #b2bec3;
      }

      .expiry-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .expiry-row .f-input {
        flex: 1;
      }
      .cb-label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: #636e72;
        cursor: pointer;
        white-space: nowrap;
      }
      .cb-label input {
        accent-color: #0fb9b1;
      }

      /* ── Add Passenger ── */
      .btn-add-pass {
        background: #f0f9f8;
        color: #0fb9b1;
        border: 2px dashed #0fb9b1;
        border-radius: 14px;
        padding: 14px;
        width: 100%;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        font-family: inherit;
        margin-bottom: 1.5rem;
        transition: all 0.2s;
      }
      .btn-add-pass:hover {
        background: #0fb9b1;
        color: #fff;
      }

      /* ── Total Bar ── */
      .total-bar {
        background: #fff;
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .total-label {
        display: block;
        font-size: 0.78rem;
        color: #636e72;
      }
      .total-val {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e272e;
      }
      .total-sub {
        display: block;
        font-size: 0.78rem;
        color: #b2bec3;
      }
      .btn-submit {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 14px 36px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-submit:hover:not(:disabled) {
        box-shadow: 0 6px 20px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
      }
      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error-msg {
        background: #ffeaea;
        color: #d63031;
        padding: 12px 16px;
        border-radius: 10px;
        margin-top: 1rem;
        font-size: 0.9rem;
      }
      .success-msg {
        background: #e8f8f5;
        color: #0fb9b1;
        padding: 12px 16px;
        border-radius: 10px;
        margin-top: 1rem;
        font-size: 0.9rem;
      }

      .loading-page,
      .error-page {
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
      .btn-back {
        margin-top: 1rem;
        background: none;
        border: 2px solid #0fb9b1;
        color: #0fb9b1;
        padding: 8px 20px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-family: inherit;
      }
      .btn-back:hover {
        background: #0fb9b1;
        color: #fff;
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
export class BookFlightComponent implements OnInit {
  flight: Flight | null = null;
  loadError = '';
  error = '';
  success = '';
  submitting = false;

  contact = {
    countryCode: '+94',
    mobileNumber: '',
    contactEmail: '',
  };

  passengers: any[] = [];

  get totalPrice(): number {
    return this.flight ? this.passengers.length * this.flight.price : 0;
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError = 'No flight selected.';
      return;
    }
    this.api.getFlight(+id).subscribe({
      next: (f) => {
        this.flight = f;
        this.addPassenger();
      },
      error: () => (this.loadError = 'Flight not found.'),
    });

    const user = this.auth.getCurrentUser();
    if (user) this.contact.contactEmail = user.email || '';
  }

  addPassenger() {
    this.passengers.push({
      firstName: '',
      surname: '',
      ageCategory: 'Adult',
      nationality: '',
      gender: 'Male',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      noExpiration: false,
    });
  }

  removePassenger(i: number) {
    this.passengers.splice(i, 1);
  }

  getDuration(): string {
    if (!this.flight) return '';
    const dep = new Date(this.flight.departureTime).getTime();
    const arr = new Date(this.flight.arrivalTime).getTime();
    const diff = Math.abs(arr - dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  submitBooking() {
    this.error = '';
    this.success = '';

    if (!this.contact.mobileNumber || !this.contact.contactEmail) {
      this.error = 'Please fill in all contact details.';
      return;
    }

    for (let i = 0; i < this.passengers.length; i++) {
      const p = this.passengers[i];
      if (
        !p.firstName ||
        !p.surname ||
        !p.nationality ||
        !p.dateOfBirth ||
        !p.passportNumber
      ) {
        this.error = `Please fill in all required fields for Passenger ${i + 1}.`;
        return;
      }
    }

    this.submitting = true;

    const payload = {
      flightId: this.flight!.flightId,
      countryCode: this.contact.countryCode,
      mobileNumber: this.contact.mobileNumber,
      contactEmail: this.contact.contactEmail,
      passengers: this.passengers.map((p) => ({
        firstName: p.firstName,
        surname: p.surname,
        ageCategory: p.ageCategory,
        nationality: p.nationality,
        gender: p.gender,
        dateOfBirth: p.dateOfBirth,
        passportNumber: p.passportNumber,
        passportExpiry: p.noExpiration ? null : p.passportExpiry,
        noExpiration: p.noExpiration,
      })),
    };

    this.api.createFlightBooking(payload).subscribe({
      next: () => {
        this.success =
          '✅ Flight booked successfully! Redirecting to your flights...';
        setTimeout(() => this.router.navigate(['/my-flights']), 2000);
      },
      error: (err) => {
        this.error = err.error || 'Failed to book flight. Please try again.';
        this.submitting = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/flights']);
  }
}
