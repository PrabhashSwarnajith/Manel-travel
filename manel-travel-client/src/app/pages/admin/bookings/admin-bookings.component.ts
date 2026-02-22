import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Booking } from '../../../models/models';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-bookings">
      <div class="page-top">
        <div>
          <h1>Manage Bookings</h1>
          <p>View and manage all customer bookings</p>
        </div>
        <div class="header-actions">
          <button class="btn-export" (click)="exportPdf()">
            📄 Export PDF
          </button>
          <button class="btn-export excel" (click)="exportExcel()">
            📊 Export Excel
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Type</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings; let i = index">
              <td>{{ i + 1 }}</td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ (b.customerName || '?').charAt(0) }}
                  </div>
                  <strong>{{ b.customerName }}</strong>
                </div>
              </td>
              <td>{{ b.packageInfo }}</td>
              <td>
                <span class="type-badge">{{ b.bookingType }}</span>
              </td>
              <td>{{ b.bookingDate | date: 'mediumDate' }}</td>
              <td>
                <strong>LKR {{ b.price | number: '1.0-0' }}</strong>
              </td>
              <td>
                <span
                  class="status-badge"
                  [ngClass]="'st-' + b.status.toLowerCase()"
                  >{{ b.status }}</span
                >
              </td>
              <td>
                <div class="action-btns">
                  <button
                    class="btn-status pending"
                    (click)="updateStatus(b.bookingId, 'Pending')"
                    *ngIf="b.status !== 'Pending'"
                    title="Set Pending"
                  >
                    ⏳
                  </button>
                  <button
                    class="btn-status confirm"
                    (click)="updateStatus(b.bookingId, 'Confirmed')"
                    *ngIf="b.status !== 'Confirmed'"
                    title="Confirm"
                  >
                    ✅
                  </button>
                  <button
                    class="btn-del"
                    (click)="deleteBooking(b.bookingId)"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" *ngIf="bookings.length === 0">
        <p>No bookings found.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-bookings {
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
      .header-actions {
        display: flex;
        gap: 0.75rem;
      }
      .btn-export {
        background: #fff;
        border: 1px solid #e8ecef;
        padding: 9px 18px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.85rem;
        color: #636e72;
        transition: all 0.2s;
        font-family: inherit;
      }
      .btn-export:hover {
        border-color: #0fb9b1;
        color: #0fb9b1;
      }
      .btn-export.excel:hover {
        border-color: #27ae60;
        color: #27ae60;
      }
      .table-container {
        background: white;
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        padding: 14px 16px;
        text-align: left;
        font-weight: 600;
        font-size: 0.82rem;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #f0f2f5;
      }
      td {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f2f5;
        font-size: 0.88rem;
        color: #485460;
      }
      tbody tr:hover td {
        background: #f0f9f8;
      }
      tbody tr:last-child td {
        border-bottom: none;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .user-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        flex-shrink: 0;
      }
      .user-info strong {
        color: #1e272e;
        font-size: 0.88rem;
      }
      .type-badge {
        background: #f0f2f5;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 500;
        color: #485460;
      }
      .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .st-confirmed {
        background: #d4edda;
        color: #155724;
      }
      .st-pending {
        background: #fff3cd;
        color: #856404;
      }
      .st-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
      .st-completed {
        background: #d1ecf1;
        color: #0c5460;
      }
      .action-btns {
        display: flex;
        gap: 6px;
      }
      .btn-status {
        width: 32px;
        height: 32px;
        border: 1px solid #e8ecef;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        transition: all 0.2s;
      }
      .btn-status.pending:hover {
        background: #fff3cd;
        border-color: #f39c12;
      }
      .btn-status.confirm:hover {
        background: #d4edda;
        border-color: #27ae60;
      }
      .btn-del {
        width: 32px;
        height: 32px;
        border: 1px solid #fed7d7;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff5f5;
        transition: all 0.2s;
      }
      .btn-del:hover {
        background: #e74c3c;
        border-color: #e74c3c;
      }
      .empty {
        text-align: center;
        padding: 3rem;
        color: #b2bec3;
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
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getAllBookings().subscribe((data) => (this.bookings = data));
  }

  updateStatus(id: number, status: string) {
    this.api
      .updateBookingStatus(id, status)
      .subscribe(() => this.loadBookings());
  }

  deleteBooking(id: number) {
    if (confirm('Delete this booking?')) {
      this.api.deleteBooking(id).subscribe(() => this.loadBookings());
    }
  }

  exportPdf() {
    this.api.exportBookingsPdf().subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ManelTravel_Bookings.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  exportExcel() {
    this.api.exportBookingsExcel().subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ManelTravel_Bookings.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
