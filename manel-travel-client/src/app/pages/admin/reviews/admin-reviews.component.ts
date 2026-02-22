import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Review } from '../../../models/models';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-top">
        <div>
          <h1>Manage Reviews</h1>
          <p>View and moderate customer reviews</p>
        </div>
        <div class="review-count">
          <span class="count-badge">{{ reviews.length }}</span>
          <span>Total Reviews</span>
        </div>
      </div>

      <div class="reviews-grid">
        <div *ngFor="let r of reviews" class="review-card">
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
            <div class="rating-badge">⭐ {{ r.rating }}/5</div>
          </div>
          <p class="comment">"{{ r.comment }}"</p>
          <div class="review-footer">
            <button class="btn-del" (click)="deleteReview(r.reviewId)">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
      <div *ngIf="reviews.length === 0" class="empty">
        <span class="empty-icon">⭐</span>
        <p>No reviews yet.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-page {
        animation: fadeIn 0.3s ease;
      }
      .page-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .page-top h1 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1e272e;
        margin-bottom: 4px;
      }
      .page-top p {
        color: #636e72;
        font-size: 0.9rem;
      }
      .review-count {
        text-align: center;
      }
      .count-badge {
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
        color: #0fb9b1;
      }
      .review-count span:last-child {
        font-size: 0.8rem;
        color: #b2bec3;
      }
      .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.25rem;
      }
      .review-card {
        background: white;
        padding: 1.5rem;
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        transition: all 0.2s;
        border: 1px solid transparent;
      }
      .review-card:hover {
        border-color: rgba(15, 185, 177, 0.15);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      }
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }
      .review-author {
        display: flex;
        align-items: center;
        gap: 10px;
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
        flex-shrink: 0;
      }
      .review-author strong {
        display: block;
        color: #1e272e;
        font-size: 0.92rem;
      }
      .review-date {
        display: block;
        font-size: 0.78rem;
        color: #b2bec3;
      }
      .rating-badge {
        background: #fff8e1;
        color: #f59f00;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.82rem;
        font-weight: 600;
      }
      .comment {
        color: #485460;
        flex: 1;
        margin-bottom: 1rem;
        font-style: italic;
        line-height: 1.6;
        font-size: 0.92rem;
      }
      .review-footer {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #f0f2f5;
        padding-top: 1rem;
      }
      .btn-del {
        background: #fff5f5;
        border: 1px solid #fed7d7;
        color: #e74c3c;
        padding: 6px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.82rem;
        font-weight: 600;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-del:hover {
        background: #e74c3c;
        color: #fff;
        border-color: #e74c3c;
      }
      .empty {
        text-align: center;
        padding: 3rem;
        color: #b2bec3;
      }
      .empty-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.75rem;
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
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.api.getReviews().subscribe((data) => (this.reviews = data));
  }

  deleteReview(id: number) {
    if (confirm('Delete this review?')) {
      this.api.deleteReview(id).subscribe(() => this.loadReviews());
    }
  }
}
