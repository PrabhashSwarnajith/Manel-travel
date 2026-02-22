import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <!-- Left brand panel -->
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-icon">✈️</div>
          <h2>Manel<span>Travel</span></h2>
          <p>
            Your trusted partner for unforgettable travel experiences across the
            globe.
          </p>
          <div class="brand-features">
            <div class="feature">
              <span class="dot"></span> 500+ happy travelers
            </div>
            <div class="feature">
              <span class="dot"></span> 50+ destinations
            </div>
            <div class="feature">
              <span class="dot"></span> 24/7 concierge support
            </div>
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-right">
        <div class="auth-card">
          <h2>Welcome Back</h2>
          <p class="subtitle">Sign in to access your account</p>

          <div class="alert-error" *ngIf="error">{{ error }}</div>

          <div class="field">
            <label for="email">Email Address</label>
            <input
              id="email"
              class="input"
              type="email"
              [(ngModel)]="email"
              placeholder="name&#64;example.com"
            />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <div class="pwd-wrap">
              <input
                id="password"
                class="input"
                [type]="showPwd ? 'text' : 'password'"
                [(ngModel)]="password"
                placeholder="Enter your password"
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

          <button class="btn-submit" (click)="login()" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>

          <p class="auth-link">
            Don't have an account? <a routerLink="/register">Create one</a>
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

      /* ── Left panel ── */
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
        width: 420px;
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
        margin-bottom: 1.6rem;
      }

      /* ── Form fields ── */
      .field {
        margin-bottom: 1.15rem;
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
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  showPwd = false;
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password';
      },
    });
  }
}
