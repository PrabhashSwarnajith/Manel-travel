import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">✈️ Sri Lanka's #1 Travel Agency</span>
        <h1 *ngIf="!auth.isLoggedIn()">Discover Your Next <span class="accent">Adventure</span></h1>
        <h1 *ngIf="auth.isLoggedIn()">Welcome Back, <span class="accent">{{ getUserName() }}</span>!</h1>
        <p *ngIf="!auth.isLoggedIn()" class="hero-sub">
          Explore handcrafted tour packages to breathtaking destinations. From
          cultural pilgrimages to tropical getaways — we make every journey
          unforgettable.
        </p>
        <p *ngIf="auth.isLoggedIn()" class="hero-sub">
          Ready to plan your next adventure? Explore our latest packages and manage your bookings.
        </p>
        <div class="hero-btns">
          <a *ngIf="!auth.isLoggedIn()" routerLink="/register" class="btn-primary">Get Started</a>
          <a *ngIf="auth.isLoggedIn() && !auth.isAdmin()" routerLink="/dashboard" class="btn-primary">My Dashboard</a>
          <a *ngIf="auth.isAdmin()" routerLink="/admin" class="btn-primary">Admin Dashboard</a>
          <a (click)="scrollTo('about')" class="btn-outline">Learn More ↓</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>500+</strong><span>Happy Travelers</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat"><strong>50+</strong><span>Destinations</span></div>
          <div class="stat-sep"></div>
          <div class="stat"><strong>4.9</strong><span>User Rating</span></div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="section bg-white">
      <div class="container">
        <div class="sec-head">
          <span class="tag">Who We Are</span>
          <h2>About <span class="accent">ManelTravel</span></h2>
          <p>
            Local knowledge meets curated itineraries so every adventure feels
            effortless.
          </p>
        </div>
        <div class="grid-3">
          <div class="card-icon">
            <div class="ico">🌿</div>
            <h3>Responsible Travel</h3>
            <p>
              We partner with communities to protect culture and nature while
              sharing unforgettable journeys.
            </p>
          </div>
          <div class="card-icon">
            <div class="ico">🧭</div>
            <h3>Local Guides</h3>
            <p>
              Multilingual experts who bring stories, cuisine, rituals and
              off-grid trails to life.
            </p>
          </div>
          <div class="card-icon">
            <div class="ico">💬</div>
            <h3>24/7 Support</h3>
            <p>
              Round-the-clock concierge that handles changes and keeps your
              itinerary smooth.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="section bg-light">
      <div class="container">
        <div class="sec-head">
          <span class="tag">What We Offer</span>
          <h2>Why Choose <span class="accent">ManelTravel</span></h2>
          <p>We handle every detail so you can focus on making memories.</p>
        </div>
        <div class="grid-3">
          <div class="svc-card" *ngFor="let s of services">
            <div class="svc-ico">{{ s.icon }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages -->
    <section class="section bg-white">
      <div class="container">
        <div class="sec-head">
          <span class="tag">Top Picks</span>
          <h2>Popular <span class="accent">Packages</span></h2>
          <p>Our most loved tour experiences handpicked for you.</p>
        </div>
        <div class="grid-3">
          <div class="pkg-card" *ngFor="let p of featuredPackages">
            <div
              class="pkg-img"
              [style.backgroundImage]="'url(' + p.image + ')'"
            >
              <span class="pkg-price">{{ p.price | currency: 'USD' }}</span>
            </div>
            <div class="pkg-body">
              <span class="pkg-dest">📍 {{ p.destination }}</span>
              <h3>{{ p.name }}</h3>
              <p>{{ p.desc }}</p>
              <div class="pkg-meta">
                <span>🕐 {{ p.duration }} Days</span>
                <span>👥 {{ p.maxPax }} people</span>
              </div>
            </div>
          </div>
        </div>
        <div class="center mt-2">
          <a routerLink="/login" class="btn-outline-teal"
            >Sign In to Browse All →</a
          >
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section bg-light">
      <div class="container">
        <div class="sec-head">
          <span class="tag">Testimonials</span>
          <h2>What Our <span class="accent">Travelers</span> Say</h2>
        </div>
        <div class="grid-3">
          <div class="test-card" *ngFor="let t of testimonials">
            <div class="test-stars">{{ t.stars }}</div>
            <p class="test-text">"{{ t.text }}"</p>
            <div class="test-author">
              <div class="avatar">{{ t.initials }}</div>
              <div>
                <strong>{{ t.name }}</strong
                ><span>{{ t.trip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-box">
        <h2 *ngIf="!auth.isLoggedIn()">Ready to Start Your Journey?</h2>
        <h2 *ngIf="auth.isLoggedIn()">Ready for Your Next Adventure?</h2>
        <p *ngIf="!auth.isLoggedIn()">
          Create your account today and explore our exclusive tour packages.
        </p>
        <p *ngIf="auth.isLoggedIn()">
          Browse our latest packages and book your next unforgettable experience.
        </p>
        <div class="cta-btns">
          <a *ngIf="!auth.isLoggedIn()" routerLink="/register" class="btn-primary">Create Account</a>
          <a *ngIf="!auth.isLoggedIn()" routerLink="/login" class="btn-outline">Sign In</a>
          <a *ngIf="auth.isLoggedIn() && !auth.isAdmin()" routerLink="/packages" class="btn-primary">Browse Packages</a>
          <a *ngIf="auth.isAdmin()" routerLink="/admin/packages" class="btn-primary">Manage Packages</a>
          <a *ngIf="auth.isLoggedIn()" routerLink="/my-bookings" class="btn-outline">My Bookings</a>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section bg-white">
      <div class="container">
        <div class="sec-head">
          <span class="tag">Get In Touch</span>
          <h2>Contact <span class="accent">Us</span></h2>
          <p>Have a question? We'd love to hear from you.</p>
        </div>
        <div class="contact-grid">
          <div class="contact-tile" *ngFor="let c of contacts">
            <div class="ico">{{ c.icon }}</div>
            <h4>{{ c.title }}</h4>
            <p>{{ c.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="f-logo">
            ✈️ <span>Manel<strong>Travel</strong></span>
          </div>
          <p>
            Your trusted partner for unforgettable travel experiences across the
            globe.
          </p>
        </div>
        <div class="f-links">
          <h4>Quick Links</h4>
          <a routerLink="/">Home</a>
          <a *ngIf="!auth.isLoggedIn()" routerLink="/login">Sign In</a>
          <a *ngIf="!auth.isLoggedIn()" routerLink="/register">Register</a>
          <a *ngIf="auth.isLoggedIn() && !auth.isAdmin()" routerLink="/dashboard">Dashboard</a>
          <a *ngIf="auth.isAdmin()" routerLink="/admin">Admin</a>
          <a *ngIf="auth.isLoggedIn()" routerLink="/packages">Packages</a>
          <a routerLink="/register">Create Account</a>
        </div>
        <div class="f-links">
          <h4>Destinations</h4>
          <span>Anuradhapura</span>
          <span>Ella</span>
          <span>Sigiriya</span>
          <span>Bali, Indonesia</span>
        </div>
        <div class="f-links">
          <h4>Contact</h4>
          <span>📧 info&#64;maneltravel.com</span>
          <span>📞 +94 77 123 4567</span>
          <span>📍 Colombo, Sri Lanka</span>
        </div>
      </div>
      <div class="f-bottom">
        <span>&copy; {{ currentYear }} ManelTravel. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .accent {
        color: #0fb9b1;
      }
      .center {
        text-align: center;
      }
      .mt-2 {
        margin-top: 2.5rem;
      }

      /* ── Hero ── */
      .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #fff;
        overflow: hidden;
        background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')
          center/cover no-repeat;
      }
      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(30, 39, 46, 0.88),
          rgba(15, 185, 177, 0.3)
        );
      }
      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 720px;
        padding: 2rem;
      }
      .hero-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 8px 22px;
        border-radius: 30px;
        font-size: 0.88rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .hero-content h1 {
        font-size: 3.6rem;
        font-weight: 800;
        line-height: 1.15;
        margin-bottom: 1.2rem;
      }
      .hero-sub {
        font-size: 1.12rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.82);
        margin-bottom: 2rem;
        max-width: 580px;
        margin-left: auto;
        margin-right: auto;
      }
      .hero-btns {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 3rem;
      }
      .btn-primary {
        background: #0fb9b1;
        color: #fff;
        padding: 14px 36px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1rem;
        transition: all 0.3s;
        text-decoration: none;
      }
      .btn-primary:hover {
        background: #0a8d87;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(15, 185, 177, 0.4);
      }
      .btn-outline {
        border: 2px solid rgba(255, 255, 255, 0.35);
        color: #fff;
        padding: 14px 36px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s;
        text-decoration: none;
        cursor: pointer;
        background: transparent;
      }
      .btn-outline:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: #fff;
      }
      .hero-stats {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 1.2rem 2.5rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .stat {
        text-align: center;
      }
      .stat strong {
        display: block;
        font-size: 1.5rem;
        font-weight: 800;
        color: #0fb9b1;
      }
      .stat span {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
      }
      .stat-sep {
        width: 1px;
        height: 36px;
        background: rgba(255, 255, 255, 0.15);
      }

      /* ── Sections ── */
      .section {
        padding: 5rem 0;
      }
      .bg-white {
        background: #fff;
      }
      .bg-light {
        background: #f8f9fb;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      .sec-head {
        text-align: center;
        margin-bottom: 3rem;
      }
      .tag {
        display: inline-block;
        background: rgba(15, 185, 177, 0.1);
        color: #0fb9b1;
        padding: 6px 18px;
        border-radius: 30px;
        font-size: 0.82rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 1rem;
      }
      .sec-head h2 {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e272e;
        margin-bottom: 0.6rem;
      }
      .sec-head > p {
        color: #636e72;
        font-size: 1.02rem;
        max-width: 520px;
        margin: 0 auto;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }

      /* About cards */
      .card-icon {
        background: #fff;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        border: 1px solid rgba(15, 185, 177, 0.12);
        transition: all 0.3s;
      }
      .card-icon:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(15, 185, 177, 0.1);
      }
      .ico {
        font-size: 2rem;
        margin-bottom: 0.8rem;
      }
      .card-icon h3 {
        font-size: 1.15rem;
        margin-bottom: 0.4rem;
        color: #1e272e;
      }
      .card-icon p {
        color: #636e72;
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Service cards */
      .svc-card {
        background: #fff;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        border: 1px solid transparent;
        transition: all 0.3s;
      }
      .svc-card:hover {
        border-color: rgba(15, 185, 177, 0.2);
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
      }
      .svc-ico {
        font-size: 2.2rem;
        margin-bottom: 0.8rem;
      }
      .svc-card h3 {
        font-size: 1.08rem;
        font-weight: 600;
        color: #1e272e;
        margin-bottom: 0.4rem;
      }
      .svc-card p {
        color: #636e72;
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Packages */
      .pkg-card {
        background: #fff;
        border-radius: 18px;
        overflow: hidden;
        transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      }
      .pkg-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
      }
      .pkg-img {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
      }
      .pkg-price {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: #0fb9b1;
        color: #fff;
        padding: 6px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.95rem;
      }
      .pkg-body {
        padding: 1.5rem;
      }
      .pkg-dest {
        font-size: 0.82rem;
        color: #0fb9b1;
        font-weight: 600;
      }
      .pkg-body h3 {
        font-size: 1.12rem;
        font-weight: 600;
        color: #1e272e;
        margin: 6px 0;
      }
      .pkg-body > p {
        color: #636e72;
        font-size: 0.88rem;
        line-height: 1.5;
        margin-bottom: 0.75rem;
      }
      .pkg-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: #b2bec3;
        font-weight: 500;
      }
      .btn-outline-teal {
        display: inline-block;
        color: #0fb9b1;
        font-weight: 700;
        font-size: 1rem;
        border: 2px solid #0fb9b1;
        padding: 12px 32px;
        border-radius: 12px;
        transition: all 0.3s;
        text-decoration: none;
      }
      .btn-outline-teal:hover {
        background: #0fb9b1;
        color: #fff;
      }

      /* Testimonials */
      .test-card {
        background: #fff;
        padding: 2rem;
        border-radius: 16px;
        border: 1px solid #e8ecef;
        transition: all 0.3s;
      }
      .test-card:hover {
        border-color: rgba(15, 185, 177, 0.25);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      }
      .test-stars {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
      }
      .test-text {
        color: #485460;
        font-size: 0.92rem;
        line-height: 1.7;
        margin-bottom: 1.2rem;
        font-style: italic;
      }
      .test-author {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .avatar {
        width: 42px;
        height: 42px;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
      }
      .test-author strong {
        display: block;
        color: #1e272e;
        font-size: 0.92rem;
      }
      .test-author span {
        color: #b2bec3;
        font-size: 0.8rem;
      }

      /* CTA */
      .cta {
        background: linear-gradient(135deg, #1e272e, #2d3436);
        padding: 5rem 2rem;
        text-align: center;
      }
      .cta-box {
        max-width: 600px;
        margin: 0 auto;
      }
      .cta-box h2 {
        color: #fff;
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
      .cta-box p {
        color: rgba(255, 255, 255, 0.65);
        font-size: 1.05rem;
        margin-bottom: 2rem;
      }
      .cta-btns {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      /* Contact */
      .contact-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
      .contact-tile {
        background: #f8f9fb;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        border: 1px solid rgba(15, 185, 177, 0.12);
        transition: all 0.3s;
      }
      .contact-tile:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 28px rgba(15, 185, 177, 0.1);
      }
      .contact-tile h4 {
        margin-bottom: 0.35rem;
        font-size: 1rem;
        color: #1e272e;
      }
      .contact-tile p {
        color: #636e72;
        font-size: 0.9rem;
      }

      /* Footer */
      .footer {
        background: #111;
        color: rgba(255, 255, 255, 0.7);
        padding: 4rem 2rem 0;
      }
      .footer-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 3rem;
      }
      .f-logo {
        font-size: 1.4rem;
        color: #fff;
        margin-bottom: 1rem;
      }
      .f-logo strong {
        color: #0fb9b1;
      }
      .footer-brand p {
        font-size: 0.9rem;
        line-height: 1.6;
        max-width: 280px;
      }
      .f-links h4 {
        color: #fff;
        font-size: 0.95rem;
        margin-bottom: 1.2rem;
      }
      .f-links a,
      .f-links span {
        display: block;
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.55);
        margin-bottom: 0.6rem;
        text-decoration: none;
        transition: color 0.2s;
      }
      .f-links a:hover {
        color: #0fb9b1;
      }
      .f-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 1.5rem 0;
        margin-top: 3rem;
        text-align: center;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.35);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .grid-3 {
          grid-template-columns: repeat(2, 1fr);
        }
        .contact-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .footer-inner {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 768px) {
        .hero-content h1 {
          font-size: 2.4rem;
        }
        .hero-stats {
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
        }
        .stat-sep {
          width: 80px;
          height: 1px;
        }
        .hero-btns {
          flex-direction: column;
          align-items: center;
        }
        .grid-3,
        .contact-grid {
          grid-template-columns: 1fr;
        }
        .sec-head h2 {
          font-size: 1.8rem;
        }
        .footer-inner {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .cta-btns {
          flex-direction: column;
          align-items: center;
        }
      }
    `,
  ],
})
export class HomeComponent {
  currentYear = new Date().getFullYear();

  constructor(public auth: AuthService) {}

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  getUserName(): string {
    const user = this.auth.getCurrentUser();
    return user ? user.name?.split(' ')[0] || 'Traveler' : 'Traveler';
  }

  services = [
    {
      icon: '🗺️',
      title: 'Curated Itineraries',
      desc: 'Expert-planned routes covering must-see attractions, hidden gems, and local experiences.',
    },
    {
      icon: '🏨',
      title: 'Premium Stays',
      desc: 'Handpicked hotels and resorts that blend comfort with authentic local charm.',
    },
    {
      icon: '🚐',
      title: 'Seamless Transport',
      desc: 'Private transfers, domestic flights, and scenic train rides — all arranged for you.',
    },
    {
      icon: '🛡️',
      title: 'Travel Insurance',
      desc: 'Comprehensive coverage for medical, trip cancellation, and baggage protection.',
    },
    {
      icon: '🧑‍🤝‍🧑',
      title: 'Expert Guides',
      desc: 'Multilingual local guides who bring history and culture to life at every stop.',
    },
    {
      icon: '💬',
      title: '24/7 Support',
      desc: 'Round-the-clock assistance before, during, and after your trip.',
    },
  ];

  contacts = [
    { icon: '📞', title: 'Phone', value: '+94 77 123 4567' },
    { icon: '📧', title: 'Email', value: 'info@maneltravel.com' },
    { icon: '📍', title: 'Office', value: 'Colombo, Sri Lanka' },
    { icon: '🌐', title: 'Social', value: 'Instagram · Facebook · X' },
  ];

  featuredPackages = [
    {
      name: 'Sacred Anuradhapura Pilgrimage',
      destination: 'Anuradhapura, Sri Lanka',
      desc: 'Visit ancient Buddhist temples, sacred Bodhi tree, and historical ruins.',
      price: 450,
      duration: 3,
      maxPax: 30,
      image:
        'https://images.unsplash.com/photo-1588258219511-64eb629cb833?w=600&q=80',
    },
    {
      name: 'Ella Adventure Retreat',
      destination: 'Ella, Sri Lanka',
      desc: "Hike Little Adam's Peak, Nine Arches Bridge, and tea plantations.",
      price: 620,
      duration: 5,
      maxPax: 20,
      image:
        'https://images.unsplash.com/photo-1586523969917-8b3e80cf0464?w=600&q=80',
    },
    {
      name: 'Bali Paradise Escape',
      destination: 'Bali, Indonesia',
      desc: 'Temples, rice terraces, stunning beaches, and world-class surfing.',
      price: 1200,
      duration: 7,
      maxPax: 15,
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    },
  ];

  testimonials = [
    {
      name: 'Kumara Perera',
      initials: 'KP',
      trip: 'Anuradhapura Tour',
      stars: '⭐⭐⭐⭐⭐',
      text: 'ManelTravel made our pilgrimage absolutely seamless. The guides were knowledgeable and the accommodations were perfect.',
    },
    {
      name: 'Sarah Johnson',
      initials: 'SJ',
      trip: 'Ella Retreat',
      stars: '⭐⭐⭐⭐⭐',
      text: 'An incredible experience! The train ride through the hill country and hiking to the peak were unforgettable moments.',
    },
    {
      name: 'Mohamed Rizwan',
      initials: 'MR',
      trip: 'Bali Escape',
      stars: '⭐⭐⭐⭐⭐',
      text: "From booking to the trip itself, everything was perfectly organized. Can't wait for my next trip with ManelTravel!",
    },
  ];
}
