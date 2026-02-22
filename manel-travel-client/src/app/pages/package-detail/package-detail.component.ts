import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TourPackage, Booking, Review } from '../../models/models';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="package-detail-container">
      <!-- Back Button -->
      <button class="btn-back" (click)="goBack()">← Back to Packages</button>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <p>Loading package details...</p>
      </div>

      <!-- Package Details -->
      <div *ngIf="!loading && package" class="detail-content">
        <!-- Package Header -->
        <div class="package-header">
          <div class="header-image">
            <img
              [src]="package.imageUrl"
              [alt]="'Image of ' + package.packageName"
              [title]="package.packageName"
            />
          </div>
          <div class="header-info">
            <h1>{{ package.packageName }}</h1>
            <p class="destination">📍 {{ package.destination }}</p>
            <p class="duration">📅 {{ package.duration }} Days</p>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Overview Section -->
            <section class="section">
              <h2>Package Overview</h2>
              <p class="description">{{ package.description }}</p>
            </section>

            <!-- Details Section -->
            <section class="section">
              <h2>Trip Details</h2>
              <div class="details-list">
                <div class="detail-item">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">{{
                    package.startDate | date: 'fullDate'
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">End Date:</span>
                  <span class="detail-value">{{
                    package.endDate | date: 'fullDate'
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Destination:</span>
                  <span class="detail-value">{{ package.destination }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Price per Person:</span>
                  <span class="detail-value price"
                    >Rs. {{ package.price | number }}</span
                  >
                </div>
                <div class="detail-item">
                  <span class="detail-label">Available Seats:</span>
                  <span
                    class="detail-value"
                    [class.full]="availableSeats === 0"
                  >
                    {{ availableSeats }} / {{ package.maxParticipants }}
                  </span>
                </div>
              </div>
            </section>

            <!-- Itinerary Section -->
            <section class="section" *ngIf="package.itinerary">
              <h2>Itinerary</h2>
              <div class="itinerary">
                <p class="itinerary-text">{{ package.itinerary }}</p>
              </div>
            </section>
          </div>

          <!-- Right Column (Booking Form) -->
          <div class="right-column">
            <!-- Price Summary -->
            <div class="price-summary-card">
              <h3>Trip Summary</h3>
              <div class="price-details">
                <div class="price-row">
                  <span>Price per Person:</span>
                  <span>Rs. {{ package.price | number }}</span>
                </div>
                <div class="price-row" *ngIf="numberOfParticipants > 1">
                  <span>Number of Participants:</span>
                  <span>{{ numberOfParticipants }}</span>
                </div>
                <div class="price-row total">
                  <span>Total Price:</span>
                  <span
                    >Rs.
                    {{ package.price * numberOfParticipants | number }}</span
                  >
                </div>
              </div>

              <!-- Booking Form -->
              <div *ngIf="!showBookingForm" class="form-section">
                <button
                  class="btn-book"
                  (click)="toggleBookingForm()"
                  [disabled]="availableSeats === 0"
                >
                  {{ availableSeats === 0 ? 'No Seats Available' : 'Book Now' }}
                </button>
              </div>

              <div *ngIf="showBookingForm" class="form-section">
                <h3>Booking Details</h3>

                <!-- Booking Type Selection -->
                <div class="form-group">
                  <label>Booking Type:</label>
                  <div class="booking-type-options">
                    <label class="type-option">
                      <input
                        type="radio"
                        value="Homage"
                        [(ngModel)]="bookingType"
                        name="bookingType"
                      />
                      <span class="option-text">
                        <strong>Homage</strong>
                        <small>(Traditional Package)</small>
                      </span>
                    </label>
                    <label class="type-option">
                      <input
                        type="radio"
                        value="Console"
                        [(ngModel)]="bookingType"
                        name="bookingType"
                      />
                      <span class="option-text">
                        <strong>Console</strong>
                        <small>(Online Experience)</small>
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Number of Participants -->
                <div class="form-group">
                  <label for="participants">Number of Participants:</label>
                  <input
                    id="participants"
                    type="number"
                    [(ngModel)]="numberOfParticipants"
                    [min]="1"
                    [max]="availableSeats"
                    class="form-input"
                  />
                  <small class="help-text"
                    >Max {{ availableSeats }} available</small
                  >
                </div>

                <!-- Special Requests -->
                <div class="form-group">
                  <label for="requests">Special Requests:</label>
                  <textarea
                    id="requests"
                    [(ngModel)]="specialRequests"
                    placeholder="Any special requirements..."
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions">
                  <button
                    class="btn-confirm"
                    (click)="submitBooking()"
                    [disabled]="bookingInProgress"
                  >
                    {{
                      bookingInProgress ? 'Processing...' : 'Confirm Booking'
                    }}
                  </button>
                  <button
                    class="btn-cancel"
                    (click)="toggleBookingForm()"
                    [disabled]="bookingInProgress"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- Info Card -->
            <div class="info-card">
              <h3>Important Information</h3>
              <ul class="info-list">
                <li>✓ Confirmed bookings receive email notification</li>
                <li>
                  ✓ {{ package.maxParticipants }} person maximum per group
                </li>
                <li>✓ Free cancellation up to 14 days before</li>
                <li>✓ 24/7 customer support available</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Reviews & Ratings Section -->
        <div class="reviews-section">
          <h2>Reviews & Ratings</h2>
          <div class="reviews-summary" *ngIf="reviews.length > 0">
            <div class="avg-rating">
              <span class="avg-num">{{ avgRating | number: '1.1-1' }}</span>
              <span class="avg-stars">{{ getStars(avgRating) }}</span>
              <span class="review-count">{{ reviews.length }} review(s)</span>
            </div>
          </div>

          <!-- Add Review Form (Customer only) -->
          <div class="add-review-card" *ngIf="isLoggedIn && !isAdmin">
            <h3>Write a Review</h3>
            <div class="rating-input">
              <label>Your Rating:</label>
              <div class="star-select">
                <span
                  *ngFor="let s of [1, 2, 3, 4, 5]"
                  class="star-btn"
                  [class.active]="s <= newRating"
                  (click)="newRating = s"
                  >⭐</span
                >
              </div>
            </div>
            <div class="form-group-review">
              <label>Your Comment:</label>
              <textarea
                [(ngModel)]="newComment"
                placeholder="Share your experience..."
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            <button
              class="btn-submit-review"
              (click)="submitReview()"
              [disabled]="
                reviewSubmitting || !newComment.trim() || newRating === 0
              "
            >
              {{ reviewSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list" *ngIf="reviews.length > 0">
            <div class="review-card" *ngFor="let r of reviews">
              <div class="review-header">
                <div class="review-author">
                  <div class="author-avatar">
                    {{ (r.customerName || '?').charAt(0) }}
                  </div>
                  <div>
                    <strong>{{ r.customerName }}</strong>
                    <span class="review-date">{{
                      r.createdAt | date: 'mediumDate'
                    }}</span>
                  </div>
                </div>
                <div class="review-stars">{{ getStars(r.rating) }}</div>
              </div>
              <p class="review-comment">{{ r.comment }}</p>
            </div>
          </div>
          <div class="no-reviews" *ngIf="reviews.length === 0">
            <p>No reviews yet. Be the first to review this package!</p>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div *ngIf="!loading && !package" class="not-found">
        <h2>Package not found</h2>
        <button (click)="goBack()" class="btn-back-home">
          Go back to packages
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .package-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .btn-back {
        background: none;
        border: none;
        color: #0fb9b1;
        font-size: 1rem;
        cursor: pointer;
        margin-bottom: 2rem;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
          color: #0a8d87;
        }
      }

      .loading,
      .not-found {
        text-align: center;
        padding: 3rem;
        color: #666;
        font-size: 1.1rem;
      }

      .detail-content {
        background: white;
        border-radius: 8px;
        overflow: hidden;
      }

      .package-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #1e272e 0%, #2d3436 100%);
        color: white;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        .header-image {
          border-radius: 8px;
          overflow: hidden;
          height: 300px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .header-info {
          display: flex;
          flex-direction: column;
          justify-content: center;

          h1 {
            font-size: 2rem;
            margin: 0 0 1rem 0;
          }

          p {
            font-size: 1.1rem;
            margin: 0.5rem 0;
          }
        }
      }

      .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        padding: 2rem;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 4px solid #0fb9b1;

        h2 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.3rem;
        }
      }

      .description {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }

      .details-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;

        .detail-label {
          font-weight: 600;
          color: #333;
        }

        .detail-value {
          color: #666;

          &.price {
            color: #0fb9b1;
            font-weight: 600;
            font-size: 1.1rem;
          }

          &.full {
            color: #e74c3c;
            font-weight: 600;
          }
        }
      }

      .itinerary {
        .itinerary-text {
          white-space: pre-wrap;
          line-height: 1.8;
          color: #666;
          margin: 0;
        }
      }

      .right-column {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .price-summary-card,
      .info-card {
        background: white;
        border: 2px solid #eee;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.1rem;
        }
      }

      .price-details {
        background: #f9f9f9;
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        color: #666;

        &.total {
          border-top: 2px solid #ddd;
          padding-top: 1rem;
          margin-top: 0.5rem;
          color: #333;
          font-weight: 600;
          font-size: 1.1rem;
        }
      }

      .form-section {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
      }

      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }
      }

      .booking-type-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .type-option {
        display: flex;
        align-items: flex-start;
        padding: 0.75rem;
        border: 2px solid #eee;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;

        input[type='radio'] {
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          cursor: pointer;
        }

        input[type='radio']:checked {
          accent-color: #0fb9b1;
        }

        &:hover {
          border-color: #0fb9b1;
          background: #f9f9f9;
        }

        .option-text {
          display: flex;
          flex-direction: column;

          strong {
            color: #333;
          }

          small {
            color: #999;
            font-size: 0.8rem;
            margin-top: 0.2rem;
          }
        }
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #0fb9b1;
          box-shadow: 0 0 0 3px rgba(15, 185, 177, 0.12);
        }

        &:disabled {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }
      }

      .form-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .help-text {
        display: block;
        margin-top: 0.25rem;
        color: #999;
        font-size: 0.8rem;
      }

      .form-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .btn-book,
      .btn-confirm,
      .btn-cancel {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-book {
        width: 100%;
        background: linear-gradient(135deg, #0fb9b1 0%, #0a8d87 100%);
        color: white;

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #0a8d87 0%, #078a82 100%);
          box-shadow: 0 4px 12px rgba(15, 185, 177, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }

      .btn-confirm {
        flex: 1;
        background: #27ae60;
        color: white;

        &:hover:not(:disabled) {
          background: #229954;
          box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }

      .btn-cancel {
        flex: 1;
        background: #e74c3c;
        color: white;

        &:hover:not(:disabled) {
          background: #c0392b;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
          transform: translateY(-2px);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }

      .btn-back-home {
        background: #0fb9b1;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 1rem;

        &:hover {
          background: #0a8d87;
        }
      }

      .info-card {
        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 0.75rem 0;
            color: #666;
            border-bottom: 1px solid #eee;

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }

      /* Reviews Section */
      .reviews-section {
        padding: 2rem;
        margin-top: 1rem;

        h2 {
          font-size: 1.4rem;
          color: #1e272e;
          margin-bottom: 1.5rem;
        }
      }

      .reviews-summary {
        margin-bottom: 1.5rem;
      }

      .avg-rating {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .avg-num {
        font-size: 2rem;
        font-weight: 800;
        color: #1e272e;
      }

      .avg-stars {
        font-size: 1.1rem;
      }

      .review-count {
        color: #636e72;
        font-size: 0.9rem;
      }

      .add-review-card {
        background: #f8f9fb;
        border: 1px solid #e8ecef;
        border-radius: 14px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;

        h3 {
          margin: 0 0 1rem;
          font-size: 1.1rem;
          color: #1e272e;
        }
      }

      .rating-input {
        margin-bottom: 1rem;

        label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
      }

      .star-select {
        display: flex;
        gap: 4px;
      }

      .star-btn {
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.3;
        transition:
          opacity 0.2s,
          transform 0.2s;

        &.active {
          opacity: 1;
        }

        &:hover {
          transform: scale(1.2);
        }
      }

      .form-group-review {
        margin-bottom: 1rem;

        label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
      }

      .btn-submit-review {
        background: #0fb9b1;
        color: #fff;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background: #0a8d87;
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .review-card {
        background: #fff;
        border: 1px solid #e8ecef;
        border-radius: 12px;
        padding: 1.25rem;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .review-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .author-avatar {
        width: 38px;
        height: 38px;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
      }

      .review-author strong {
        display: block;
        color: #1e272e;
        font-size: 0.92rem;
      }

      .review-date {
        color: #b2bec3;
        font-size: 0.8rem;
      }

      .review-stars {
        font-size: 0.9rem;
      }

      .review-comment {
        color: #485460;
        font-size: 0.92rem;
        line-height: 1.6;
        margin: 0;
      }

      .no-reviews {
        text-align: center;
        padding: 2rem;
        color: #b2bec3;
        font-size: 0.95rem;
      }
    `,
  ],
})
export class PackageDetailComponent implements OnInit {
  package: TourPackage | null = null;
  loading = false;
  bookingInProgress = false;
  showBookingForm = false;
  bookingType: 'Homage' | 'Console' = 'Homage';
  numberOfParticipants = 1;
  specialRequests = '';
  isLoggedIn = false;
  isAdmin = false;

  // Reviews
  reviews: Review[] = [];
  newRating = 0;
  newComment = '';
  reviewSubmitting = false;
  avgRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.loadPackage(packageId);
      this.loadReviews(parseInt(packageId, 10));
    }
  }

  loadPackage(packageId: string): void {
    this.loading = true;
    const id = parseInt(packageId, 10);
    this.apiService.getPackage(id).subscribe({
      next: (data: TourPackage) => {
        this.package = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading package', error);
        this.loading = false;
      },
    });
  }

  loadReviews(packageId: number): void {
    this.apiService.getReviewsByPackage(packageId).subscribe({
      next: (data: Review[]) => {
        this.reviews = data;
        if (data.length > 0) {
          this.avgRating =
            data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        }
      },
      error: () => {},
    });
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '⭐'.repeat(full) + '☆'.repeat(5 - full);
  }

  submitReview(): void {
    if (!this.package || !this.newComment.trim() || this.newRating === 0)
      return;
    this.reviewSubmitting = true;
    this.apiService
      .addReview({
        packageId: this.package.packageId,
        rating: this.newRating,
        comment: this.newComment.trim(),
      })
      .subscribe({
        next: () => {
          this.reviewSubmitting = false;
          this.newRating = 0;
          this.newComment = '';
          this.loadReviews(this.package!.packageId);
        },
        error: () => {
          this.reviewSubmitting = false;
          alert('Failed to submit review');
        },
      });
  }

  toggleBookingForm(): void {
    if (!this.isLoggedIn) {
      alert('Please login to book this package');
      this.router.navigate(['/login']);
      return;
    }
    this.showBookingForm = !this.showBookingForm;
  }

  submitBooking(): void {
    if (!this.package || this.numberOfParticipants < 1) {
      alert('Please enter valid number of participants');
      return;
    }

    if (
      this.numberOfParticipants >
      this.package.maxParticipants - this.package.currentParticipants
    ) {
      alert(
        `Only ${this.package.maxParticipants - this.package.currentParticipants} seats available`,
      );
      return;
    }

    this.bookingInProgress = true;
    const booking: Booking = {
      bookingId: 0,
      customerId: this.authService.getCurrentUser()?.userId || 0,
      packageId: parseInt(this.package!.packageId.toString(), 10),
      bookingDate: new Date().toISOString(),
      bookingType: this.bookingType,
      numberOfParticipants: this.numberOfParticipants,
      price: this.package!.price * this.numberOfParticipants,
      status: 'Confirmed',
      packageInfo: this.package!.packageName,
    };

    this.apiService.createBooking(booking).subscribe({
      next: (response: any) => {
        alert('Booking confirmed successfully!');
        this.showBookingForm = false;
        this.bookingInProgress = false;
        this.router.navigate(['/my-bookings']);
      },
      error: (error: any) => {
        console.error('Error creating booking', error);
        alert('Failed to create booking. Please try again.');
        this.bookingInProgress = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/packages']);
  }

  get availableSeats(): number {
    return this.package
      ? this.package.maxParticipants - this.package.currentParticipants
      : 0;
  }
}
