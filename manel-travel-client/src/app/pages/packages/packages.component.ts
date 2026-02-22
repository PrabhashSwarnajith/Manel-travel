import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TourPackage } from '../../models/models';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="packages-page">
      <!-- Page Header -->
      <div class="page-header">
        <span class="header-tag">🌍 Explore</span>
        <h1>Tour Packages</h1>
        <p>Discover amazing travel experiences crafted just for you</p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Search by name or destination..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <select
            [(ngModel)]="selectedDestination"
            (change)="onFilterChange()"
            class="filter-select"
            title="Filter by destination"
          >
            <option value="">All Destinations</option>
            <option *ngFor="let dest of destinations" [value]="dest">
              {{ dest }}
            </option>
          </select>
          <select
            [(ngModel)]="selectedDuration"
            (change)="onFilterChange()"
            class="filter-select"
            title="Filter by duration"
          >
            <option value="">All Durations</option>
            <option *ngFor="let duration of durations" [value]="duration">
              {{ duration }}
            </option>
          </select>
        </div>
        <span class="results-count" *ngIf="!loading">
          {{ filteredPackages.length }} package{{
            filteredPackages.length !== 1 ? 's' : ''
          }}
        </span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading packages...</p>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!loading && filteredPackages.length === 0"
        class="empty-state"
      >
        <span class="empty-icon">📭</span>
        <h3>No packages found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>

      <!-- Packages Grid -->
      <div
        *ngIf="!loading && filteredPackages.length > 0"
        class="packages-grid"
      >
        <div
          *ngFor="let package of filteredPackages"
          class="card"
          (click)="viewDetails(package.packageId)"
        >
          <div class="card-image">
            <img
              [src]="package.imageUrl"
              [alt]="'Image of ' + package.packageName"
              [title]="package.packageName"
            />
            <div class="card-overlay"></div>
            <span class="price-tag">Rs. {{ package.price | number }}</span>
            <span
              class="avail-tag"
              [class.low]="
                package.maxParticipants - package.currentParticipants <= 3
              "
            >
              {{ package.maxParticipants - package.currentParticipants }} spots
              left
            </span>
          </div>

          <div class="card-body">
            <span class="dest-label">📍 {{ package.destination }}</span>
            <h3>{{ package.packageName }}</h3>
            <p class="desc">{{ package.description }}</p>

            <div class="meta-row">
              <span class="meta-chip">📅 {{ package.duration }} days</span>
              <span class="meta-chip">
                👥 {{ package.currentParticipants }}/{{
                  package.maxParticipants
                }}
              </span>
            </div>

            <div class="card-footer">
              <div class="date-range">
                {{ package.startDate | date: 'MMM d' }} –
                {{ package.endDate | date: 'MMM d, y' }}
              </div>
              <button
                class="btn-view"
                (click)="
                  viewDetails(package.packageId); $event.stopPropagation()
                "
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* ─── Browse Packages Page ─── */

      .packages-page {
        max-width: 1200px;
        margin: 0 auto;
        animation: fadeIn 0.35s ease;
      }

      /* ─── Header ─── */
      .page-header {
        text-align: center;
        margin-bottom: 2rem;

        .header-tag {
          display: inline-block;
          background: rgba(15, 185, 177, 0.1);
          color: #0fb9b1;
          padding: 6px 18px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: 2.2rem;
          color: #1e272e;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        p {
          color: #636e72;
          font-size: 1rem;
        }
      }

      /* ─── Toolbar ─── */
      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
        background: #fff;
        padding: 0.75rem 1rem;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #e8ecef;
        flex-wrap: wrap;
      }

      .search-box {
        flex: 1;
        min-width: 220px;
        position: relative;
      }

      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.95rem;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 10px 14px 10px 40px;
        border: 2px solid #e8ecef;
        border-radius: 10px;
        font-size: 0.9rem;
        font-family: inherit;
        color: #1e272e;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: #0fb9b1;
          box-shadow: 0 0 0 3px rgba(15, 185, 177, 0.1);
        }

        &::placeholder {
          color: #b2bec3;
        }
      }

      .filter-group {
        display: flex;
        gap: 0.5rem;
      }

      .filter-select {
        padding: 10px 14px;
        border: 2px solid #e8ecef;
        border-radius: 10px;
        font-size: 0.9rem;
        font-family: inherit;
        color: #1e272e;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 160px;

        &:focus {
          outline: none;
          border-color: #0fb9b1;
          box-shadow: 0 0 0 3px rgba(15, 185, 177, 0.1);
        }
      }

      .results-count {
        color: #b2bec3;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        margin-left: auto;
      }

      /* ─── States ─── */
      .loading-state {
        text-align: center;
        padding: 4rem 2rem;

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e8ecef;
          border-top-color: #0fb9b1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 1rem;
        }

        p {
          color: #636e72;
          font-size: 0.95rem;
        }
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        h3 {
          color: #1e272e;
          font-size: 1.2rem;
          margin-bottom: 0.4rem;
        }

        p {
          color: #b2bec3;
          font-size: 0.92rem;
        }
      }

      /* ─── Grid ─── */
      .packages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.5rem;
      }

      /* ─── Card ─── */
      .card {
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.1);
          border-color: rgba(15, 185, 177, 0.18);
        }

        &:hover .card-image img {
          transform: scale(1.06);
        }
      }

      .card-image {
        position: relative;
        height: 210px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
      }

      .card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.35) 0%,
          transparent 55%
        );
        pointer-events: none;
      }

      .price-tag {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: #0fb9b1;
        color: #fff;
        padding: 6px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.92rem;
        letter-spacing: 0.3px;
      }

      .avail-tag {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.92);
        color: #1e272e;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);

        &.low {
          background: rgba(231, 76, 60, 0.12);
          color: #e74c3c;
        }
      }

      /* ─── Card Body ─── */
      .card-body {
        padding: 1.25rem 1.5rem 1.5rem;
      }

      .dest-label {
        font-size: 0.84rem;
        font-weight: 600;
        color: #0fb9b1;
        display: block;
        margin-bottom: 4px;
      }

      .card-body h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e272e;
        margin: 0 0 6px;
        line-height: 1.35;
      }

      .desc {
        color: #636e72;
        font-size: 0.86rem;
        line-height: 1.55;
        margin: 0 0 0.75rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meta-row {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .meta-chip {
        background: #f1f2f6;
        color: #485460;
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      /* ─── Card Footer ─── */
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #f0f2f5;
        padding-top: 0.9rem;
      }

      .date-range {
        font-size: 0.82rem;
        color: #b2bec3;
        font-weight: 500;
      }

      .btn-view {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 9px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.25s;
        white-space: nowrap;

        &:hover {
          box-shadow: 0 4px 14px rgba(15, 185, 177, 0.35);
          transform: translateY(-2px);
        }
      }

      /* ─── Animations ─── */
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

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ─── Responsive ─── */
      @media (max-width: 768px) {
        .toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .filter-group {
          flex-direction: column;
        }

        .filter-select {
          min-width: unset;
        }

        .results-count {
          margin-left: 0;
          text-align: center;
        }

        .packages-grid {
          grid-template-columns: 1fr;
        }

        .page-header h1 {
          font-size: 1.7rem;
        }
      }

      @media (max-width: 480px) {
        .card-footer {
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }

        .btn-view {
          text-align: center;
        }

        .date-range {
          text-align: center;
        }
      }
    `,
  ],
})
export class PackagesComponent implements OnInit {
  packages: TourPackage[] = [];
  filteredPackages: TourPackage[] = [];
  loading = false;
  searchTerm = '';
  selectedDestination = '';
  selectedDuration = '';
  destinations: string[] = [];
  durations: string[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.loading = true;
    this.apiService.getPackages().subscribe({
      next: (data: TourPackage[]) => {
        this.packages = data;
        this.filteredPackages = data;
        this.extractFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packages', error);
        this.loading = false;
      },
    });
  }

  extractFilters(): void {
    this.destinations = [...new Set(this.packages.map((p) => p.destination))];
    this.durations = [
      ...new Set(this.packages.map((p) => `${p.duration} days`)),
    ];
  }

  applyFilters(): void {
    this.filteredPackages = this.packages.filter((pkg) => {
      const matchesSearch =
        pkg.packageName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDestination =
        !this.selectedDestination ||
        pkg.destination === this.selectedDestination;
      const matchesDuration =
        !this.selectedDuration ||
        `${pkg.duration} days` === this.selectedDuration;

      return matchesSearch && matchesDestination && matchesDuration;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  viewDetails(packageId: number): void {
    this.router.navigate(['/packages', packageId]);
  }
}
