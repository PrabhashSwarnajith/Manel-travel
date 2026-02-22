import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <!-- Left brand panel (identical to login) -->
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-icon">✈️</div>
          <h2>Manel<span>Travel</span></h2>
          <p>Join thousands of happy travelers exploring the world with us.</p>
          <div class="brand-features">
            <div class="feature">
              <span class="dot"></span> Instant itinerary sync
            </div>
            <div class="feature">
              <span class="dot"></span> Local expert guides
            </div>
            <div class="feature">
              <span class="dot"></span> Secure booking system
            </div>
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-right">
        <div class="auth-card">
          <h2>Create Account</h2>
          <p class="subtitle">
            Let's get you set up so you can start exploring.
          </p>

          <div class="alert-error" *ngIf="error">{{ error }}</div>

          <div class="field">
            <label>Full Name</label>
            <div class="row-2">
              <input
                class="input"
                [(ngModel)]="firstName"
                placeholder="First name"
              />
              <input
                class="input"
                [(ngModel)]="lastName"
                placeholder="Last name"
              />
            </div>
          </div>

          <div class="row-2">
            <div class="field">
              <label>Email</label>
              <input
                class="input"
                type="email"
                [(ngModel)]="email"
                placeholder="name&#64;example.com"
              />
            </div>
            <div class="field">
              <label>NIC</label>
              <input
                class="input"
                [(ngModel)]="nic"
                placeholder="e.g., 901234567V"
              />
            </div>
          </div>

          <div class="row-2">
            <div class="field">
              <label>Phone Number</label>
              <input
                class="input"
                [(ngModel)]="phone"
                placeholder="+94 77 123 4567"
              />
            </div>
            <div class="field">
              <label>Date of Birth</label>
              <input class="input" type="date" [(ngModel)]="dob" />
            </div>
          </div>

          <div class="field">
            <label>Address</label>
            <input
              class="input"
              [(ngModel)]="address"
              placeholder="Your address"
            />
          </div>

          <div class="row-2">
            <div class="field">
              <label>Password</label>
              <div class="pwd-wrap">
                <input
                  class="input"
                  [type]="showPwd ? 'text' : 'password'"
                  [(ngModel)]="password"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  class="pwd-btn"
                  (click)="showPwd = !showPwd"
                >
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <div class="field">
              <label>Confirm Password</label>
              <div class="pwd-wrap">
                <input
                  class="input"
                  [type]="showPwd2 ? 'text' : 'password'"
                  [(ngModel)]="confirmPassword"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  class="pwd-btn"
                  (click)="showPwd2 = !showPwd2"
                >
                  {{ showPwd2 ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
          </div>

          <button class="btn-submit" (click)="register()" [disabled]="loading">
            {{ loading ? 'Creating…' : 'Create Account' }}
          </button>

          <p class="auth-link">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* ── Layout ── */
      .auth-page {
        display: flex;
        min-height: 100vh;
        font-family: 'Poppins', sans-serif;
        animation: fadeIn 0.35s ease;
      }

      /* ── Left panel (same as login) ── */
      .auth-left {
        width: 440px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        background: linear-gradient(
          160deg,
          #1e272e 0%,
          #2d3436 60%,
          rgba(15, 185, 177, 0.22) 100%
        );
      }
      .auth-left::before {
        content: '';
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')
          center/cover;
        opacity: 0.1;
      }
      .auth-brand {
        position: relative;
        z-index: 2;
        text-align: center;
        color: #fff;
        max-width: 320px;
      }
      .brand-icon {
        font-size: 3.2rem;
        margin-bottom: 0.8rem;
      }
      .auth-brand h2 {
        font-size: 1.9rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
      }
      .auth-brand h2 span {
        color: #0fb9b1;
      }
      .auth-brand > p {
        color: rgba(255, 255, 255, 0.55);
        line-height: 1.6;
        font-size: 0.9rem;
        margin-bottom: 2rem;
      }
      .brand-features {
        text-align: left;
      }
      .feature {
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.88rem;
        margin-bottom: 0.65rem;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #0fb9b1;
        flex-shrink: 0;
      }

      /* ── Right panel ── */
      .auth-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem;
        background: #f8f9fb;
        overflow-y: auto;
      }
      .auth-card {
        width: 560px;
        max-width: 100%;
        background: #fff;
        padding: 2.5rem;
        border-radius: 18px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      }
      .auth-card h2 {
        font-size: 1.55rem;
        font-weight: 700;
        color: #1e272e;
        margin-bottom: 4px;
      }
      .subtitle {
        color: #636e72;
        font-size: 0.9rem;
        margin-bottom: 1.4rem;
      }

      /* ── Form fields ── */
      .field {
        margin-bottom: 1rem;
      }
      .field label {
        display: block;
        font-weight: 500;
        font-size: 0.88rem;
        color: #485460;
        margin-bottom: 6px;
      }
      .input {
        width: 100%;
        padding: 11px 14px;
        border: 2px solid #e8ecef;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.92rem;
        color: #1e272e;
        transition:
          border-color 0.2s,
          box-shadow 0.2s;
        box-sizing: border-box;
      }
      .input:focus {
        outline: none;
        border-color: #0fb9b1;
        box-shadow: 0 0 0 3px rgba(15, 185, 177, 0.12);
      }
      .input::placeholder {
        color: #b2bec3;
      }
      .row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .pwd-wrap {
        position: relative;
      }
      .pwd-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
      }

      /* ── Submit button ── */
      .btn-submit {
        width: 100%;
        padding: 12px;
        margin-top: 0.5rem;
        border: none;
        border-radius: 10px;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-submit:hover:not(:disabled) {
        box-shadow: 0 6px 18px rgba(15, 185, 177, 0.35);
        transform: translateY(-2px);
      }
      .btn-submit:disabled {
        background: #b2bec3;
        cursor: not-allowed;
      }

      /* ── Footer link ── */
      .auth-link {
        text-align: center;
        margin-top: 1.4rem;
        color: #636e72;
        font-size: 0.9rem;
      }
      .auth-link a {
        color: #0fb9b1;
        font-weight: 600;
        text-decoration: none;
      }

      /* ── Alert ── */
      .alert-error {
        background: #fff5f5;
        color: #e74c3c;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.88rem;
        margin-bottom: 1rem;
        border: 1px solid #fed7d7;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .auth-left {
          display: none;
        }
        .auth-right {
          padding: 1.5rem;
        }
        .row-2 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  nic = '';
  address = '';
  dob = '';
  password = '';
  confirmPassword = '';
  showPwd = false;
  showPwd2 = false;
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (
      !this.email ||
      !this.firstName ||
      !this.lastName ||
      !this.phone ||
      !this.nic ||
      !this.password
    ) {
      this.error = 'Please fill in all required fields';
      return;
    }
    this.loading = true;
    this.error = '';
    const dob = this.dob ? new Date(this.dob) : null;
    this.auth
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        teleNo: this.phone,
        nic: this.nic,
        address: this.address,
        dateOfBirth: dob,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed';
        },
      });
  }
}
