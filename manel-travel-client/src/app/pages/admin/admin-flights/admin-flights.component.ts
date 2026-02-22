import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Flight } from '../../../models/models';

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-head">
        <h1>Manage Flights</h1>
        <button class="btn-add" (click)="openModal()">+ Add Flight</button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading flights...</p>
      </div>

      <div class="table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>Flight No</th>
              <th>Airline</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Class</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of flights">
              <td>
                <strong>{{ f.flightNumber }}</strong>
              </td>
              <td>{{ f.airline }}</td>
              <td>{{ f.origin }}</td>
              <td>{{ f.destination }}</td>
              <td>{{ f.departureTime | date: 'MMM d, HH:mm' }}</td>
              <td>{{ f.arrivalTime | date: 'MMM d, HH:mm' }}</td>
              <td>
                <span class="class-badge">{{ f.class }}</span>
              </td>
              <td>LKR {{ f.price | number: '1.0-0' }}</td>
              <td>{{ f.availableSeats }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-edit" (click)="openModal(f)">✏️</button>
                  <button class="btn-del" (click)="deleteFlight(f.flightId)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="flights.length === 0">
              <td colspan="10" class="empty-td">No flights found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <h2>{{ editing ? 'Edit Flight' : 'Add Flight' }}</h2>
            <button class="btn-close" (click)="closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-row two">
              <div class="form-group">
                <label>Flight Number *</label>
                <input
                  type="text"
                  [(ngModel)]="form.flightNumber"
                  class="f-input"
                  placeholder="e.g. UL101"
                />
              </div>
              <div class="form-group">
                <label>Airline *</label>
                <input
                  type="text"
                  [(ngModel)]="form.airline"
                  class="f-input"
                  placeholder="e.g. SriLankan Airlines"
                />
              </div>
            </div>

            <div class="form-row two">
              <div class="form-group">
                <label>Origin *</label>
                <input
                  type="text"
                  [(ngModel)]="form.origin"
                  class="f-input"
                  placeholder="Colombo"
                />
              </div>
              <div class="form-group">
                <label>Destination *</label>
                <input
                  type="text"
                  [(ngModel)]="form.destination"
                  class="f-input"
                  placeholder="Dubai"
                />
              </div>
            </div>

            <div class="form-row two">
              <div class="form-group">
                <label>Departure *</label>
                <input
                  type="datetime-local"
                  [(ngModel)]="form.departureTime"
                  class="f-input"
                />
              </div>
              <div class="form-group">
                <label>Arrival *</label>
                <input
                  type="datetime-local"
                  [(ngModel)]="form.arrivalTime"
                  class="f-input"
                />
              </div>
            </div>

            <div class="form-row three">
              <div class="form-group">
                <label>Class *</label>
                <select [(ngModel)]="form.class" class="f-input">
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
              <div class="form-group">
                <label>Price (LKR) *</label>
                <input
                  type="number"
                  [(ngModel)]="form.price"
                  class="f-input"
                  placeholder="50000"
                />
              </div>
              <div class="form-group">
                <label>Available Seats *</label>
                <input
                  type="number"
                  [(ngModel)]="form.availableSeats"
                  class="f-input"
                  placeholder="100"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Image URL</label>
              <input
                type="text"
                [(ngModel)]="form.imageUrl"
                class="f-input"
                placeholder="https://..."
              />
            </div>

            <div class="modal-error" *ngIf="modalError">{{ modalError }}</div>
          </div>

          <div class="modal-foot">
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button
              class="btn-primary"
              (click)="saveFlight()"
              [disabled]="saving"
            >
              {{ saving ? 'Saving...' : editing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        animation: fadeIn 0.3s ease;
      }
      .page-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .page-head h1 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1e272e;
        margin: 0;
      }
      .btn-add {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .btn-add:hover {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
      }

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

      /* Table */
      .table-card {
        background: #fff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        background: #f7f8fa;
        text-align: left;
        padding: 12px 16px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      td {
        padding: 12px 16px;
        font-size: 0.88rem;
        color: #2d3436;
        border-bottom: 1px solid #f0f2f5;
      }
      tr:hover td {
        background: #fafbfc;
      }
      .empty-td {
        text-align: center;
        color: #b2bec3;
        padding: 2rem;
      }
      .class-badge {
        background: #f0f9f8;
        color: #0fb9b1;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;
      }
      .action-btns {
        display: flex;
        gap: 4px;
      }
      .btn-edit,
      .btn-del {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.2s;
      }
      .btn-edit:hover {
        background: #f0f9f8;
      }
      .btn-del:hover {
        background: #ffeaea;
      }

      /* Modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s;
      }
      .modal-box {
        background: #fff;
        border-radius: 16px;
        width: 90%;
        max-width: 640px;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #f0f2f5;
      }
      .modal-head h2 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e272e;
      }
      .btn-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #636e72;
      }
      .modal-body {
        padding: 1.25rem 1.5rem;
      }
      .modal-foot {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid #f0f2f5;
      }
      .modal-error {
        background: #ffeaea;
        color: #d63031;
        padding: 10px 14px;
        border-radius: 8px;
        margin-top: 0.75rem;
        font-size: 0.85rem;
      }

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
      @media (max-width: 600px) {
        .form-row.two,
        .form-row.three {
          grid-template-columns: 1fr;
        }
      }
      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.25rem;
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

      .btn-secondary {
        background: #f7f8fa;
        color: #636e72;
        border: 1px solid #e8ecef;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
      }
      .btn-primary {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
      }
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AdminFlightsComponent implements OnInit {
  flights: Flight[] = [];
  loading = false;
  showModal = false;
  editing = false;
  saving = false;
  modalError = '';
  editId = 0;

  form: any = this.defaultForm();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadFlights();
  }

  defaultForm() {
    return {
      flightNumber: '',
      airline: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: 0,
      class: 'Economy',
      availableSeats: 100,
      imageUrl: '',
    };
  }

  loadFlights() {
    this.loading = true;
    this.api.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openModal(f?: Flight) {
    this.modalError = '';
    this.saving = false;
    if (f) {
      this.editing = true;
      this.editId = f.flightId;
      this.form = {
        flightNumber: f.flightNumber,
        airline: f.airline,
        origin: f.origin,
        destination: f.destination,
        departureTime: this.toDatetimeLocal(f.departureTime),
        arrivalTime: this.toDatetimeLocal(f.arrivalTime),
        price: f.price,
        class: f.class,
        availableSeats: f.availableSeats,
        imageUrl: f.imageUrl || '',
      };
    } else {
      this.editing = false;
      this.form = this.defaultForm();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  toDatetimeLocal(dt: string): string {
    if (!dt) return '';
    const d = new Date(dt);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  saveFlight() {
    const f = this.form;
    if (
      !f.flightNumber ||
      !f.airline ||
      !f.origin ||
      !f.destination ||
      !f.departureTime ||
      !f.arrivalTime ||
      !f.price
    ) {
      this.modalError = 'Please fill in all required fields.';
      return;
    }

    this.saving = true;
    this.modalError = '';

    const payload = {
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      price: f.price,
      class: f.class,
      availableSeats: f.availableSeats,
      imageUrl: f.imageUrl || null,
    };

    const req = this.editing
      ? this.api.updateFlight(this.editId, payload)
      : this.api.createFlight(payload);

    req.subscribe({
      next: () => {
        this.closeModal();
        this.loadFlights();
      },
      error: (err) => {
        this.modalError = err.error || 'Failed to save flight.';
        this.saving = false;
      },
    });
  }

  deleteFlight(id: number) {
    if (!confirm('Delete this flight? This cannot be undone.')) return;
    this.api.deleteFlight(id).subscribe({
      next: () => this.loadFlights(),
      error: (err) => alert(err.error || 'Failed to delete flight.'),
    });
  }
}
