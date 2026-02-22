import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Customer } from '../../../models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-top">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage registered customers</p>
        </div>
        <div class="user-count">
          <span class="count-badge">{{ users.length }}</span>
          <span>Total Users</span>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>NIC</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users; let i = index">
              <td>{{ i + 1 }}</td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ (u.firstName || '?').charAt(0)
                    }}{{ (u.lastName || '?').charAt(0) }}
                  </div>
                  <strong>{{ u.firstName }} {{ u.lastName }}</strong>
                </div>
              </td>
              <td>{{ u.email }}</td>
              <td>
                <span class="mono">{{ u.nic }}</span>
              </td>
              <td>{{ u.teleNo }}</td>
              <td>
                <button class="btn-del" (click)="deleteUser(u.cusId)">
                  🗑️ Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="users.length === 0" class="empty">
          <p>No registered users found.</p>
        </div>
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
      .user-count {
        text-align: center;
      }
      .count-badge {
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
        color: #0fb9b1;
      }
      .user-count span:last-child {
        font-size: 0.8rem;
        color: #b2bec3;
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
        padding: 14px 18px;
        text-align: left;
        font-weight: 600;
        font-size: 0.82rem;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #f0f2f5;
      }
      td {
        padding: 14px 18px;
        border-bottom: 1px solid #f0f2f5;
        font-size: 0.9rem;
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
        width: 34px;
        height: 34px;
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
        font-size: 0.92rem;
      }
      .mono {
        font-family: 'Courier New', monospace;
        color: #636e72;
        font-size: 0.88rem;
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
export class AdminUsersComponent implements OnInit {
  users: Customer[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe((data) => (this.users = data));
  }

  deleteUser(id: number) {
    if (
      confirm(
        'Are you sure you want to delete this user? This will remove all their bookings.',
      )
    ) {
      this.api.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
