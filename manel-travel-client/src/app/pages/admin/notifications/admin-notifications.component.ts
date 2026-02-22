import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-top">
        <h1>Send Notification</h1>
        <p>Broadcast messages to all registered users</p>
      </div>

      <div class="notif-form">
        <div class="form-icon">🔔</div>
        <h3>Compose Notification</h3>
        <p class="hint">
          This message will be sent to all users in the system.
        </p>

        <div class="form-group">
          <label>Recipient</label>
          <select [(ngModel)]="targetUser" class="form-select">
            <option [ngValue]="0">All Users</option>
          </select>
        </div>

        <div class="form-group">
          <label>Message</label>
          <textarea
            [(ngModel)]="message"
            rows="5"
            placeholder="Type your notification message here..."
            class="form-textarea"
          ></textarea>
        </div>

        <button
          class="send-btn"
          (click)="send()"
          [disabled]="!message || sending"
        >
          {{ sending ? 'Sending...' : '📤 Send Notification' }}
        </button>

        <div *ngIf="success" class="success-msg">
          ✅ Notification sent successfully!
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-page {
        max-width: 600px;
        animation: fadeIn 0.3s ease;
      }
      .page-top {
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
      .notif-form {
        background: white;
        padding: 2rem;
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      }
      .form-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .notif-form h3 {
        font-size: 1.2rem;
        color: #1e272e;
        margin-bottom: 0.25rem;
      }
      .hint {
        color: #636e72;
        margin-bottom: 1.5rem;
        font-size: 0.88rem;
      }
      .form-group {
        margin-bottom: 1.25rem;
      }
      .form-group label {
        display: block;
        margin-bottom: 6px;
        color: #485460;
        font-weight: 500;
        font-size: 0.88rem;
      }
      .form-select,
      .form-textarea {
        width: 100%;
        padding: 11px 16px;
        border: 2px solid #e8ecef;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.95rem;
        color: #1e272e;
        transition:
          border-color 0.2s,
          box-shadow 0.2s;
      }
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #0fb9b1;
        box-shadow: 0 0 0 3px rgba(15, 185, 177, 0.12);
      }
      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }
      .send-btn {
        width: 100%;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: white;
        border: none;
        padding: 14px;
        border-radius: 10px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
      }
      .send-btn:hover:not(:disabled) {
        box-shadow: 0 4px 15px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
      }
      .send-btn:disabled {
        background: #b2bec3;
        cursor: not-allowed;
      }
      .success-msg {
        margin-top: 1rem;
        padding: 1rem;
        background: #f0f9f8;
        color: #0fb9b1;
        text-align: center;
        border-radius: 10px;
        font-weight: 600;
        border: 1px solid rgba(15, 185, 177, 0.2);
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
export class AdminNotificationsComponent {
  targetUser = 0;
  message = '';
  sending = false;
  success = false;

  constructor(private api: ApiService) {}

  send() {
    this.sending = true;
    this.success = false;
    this.api
      .sendNotification({ userId: this.targetUser, message: this.message })
      .subscribe({
        next: () => {
          this.sending = false;
          this.success = true;
          this.message = '';
          setTimeout(() => (this.success = false), 3000);
        },
        error: () => (this.sending = false),
      });
  }
}
