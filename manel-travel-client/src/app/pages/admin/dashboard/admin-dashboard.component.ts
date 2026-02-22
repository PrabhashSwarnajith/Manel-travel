import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { DashboardStats, ChartData } from '../../../models/models';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="adm-dash">
      <!-- Header -->
      <div class="adm-head">
        <div>
          <h1 class="adm-title">Dashboard</h1>
          <p class="adm-sub">Welcome back! Here's your business overview.</p>
        </div>
        <div class="adm-actions">
          <button class="btn-rpt" (click)="exportPdf()" [disabled]="exporting">
            <span class="btn-ico">📄</span> Export PDF
          </button>
          <button
            class="btn-rpt btn-xl"
            (click)="exportExcel()"
            [disabled]="exporting"
          >
            <span class="btn-ico">📊</span> Export Excel
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="adm-loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="adm-error">
        <span>⚠️</span>
        <p>{{ error }}</p>
        <button (click)="reload()">Retry</button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-row" *ngIf="!loading && !error">
        <div class="s-card">
          <div class="s-icon bg-blue">👥</div>
          <div class="s-body">
            <span class="s-label">Total Customers</span>
            <span class="s-val">{{ stats?.totalCustomers || 0 }}</span>
          </div>
        </div>
        <div class="s-card">
          <div class="s-icon bg-purple">🎟️</div>
          <div class="s-body">
            <span class="s-label">Total Bookings</span>
            <span class="s-val">{{ stats?.totalBookings || 0 }}</span>
          </div>
        </div>
        <div class="s-card">
          <div class="s-icon bg-orange">🎒</div>
          <div class="s-body">
            <span class="s-label">Tour Packages</span>
            <span class="s-val">{{ stats?.totalPackages || 0 }}</span>
          </div>
        </div>
        <div class="s-card s-highlight">
          <div class="s-icon bg-teal">💰</div>
          <div class="s-body">
            <span class="s-label">Total Revenue</span>
            <span class="s-val"
              >LKR {{ stats?.totalRevenue | number: '1.0-0' }}</span
            >
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-row" *ngIf="!loading && !error">
        <div class="ch-card">
          <div class="ch-head">
            <h3>Bookings by Package</h3>
            <span class="ch-badge" *ngIf="pkgData.length"
              >{{ pkgData.length }} packages</span
            >
          </div>
          <div class="ch-body">
            <canvas id="destChart"></canvas>
            <p *ngIf="pkgData.length === 0" class="ch-empty">
              No booking data yet
            </p>
          </div>
        </div>
        <div class="ch-card">
          <div class="ch-head">
            <h3>Revenue Trend</h3>
            <span class="ch-badge" *ngIf="revData.length"
              >{{ revData.length }} months</span
            >
          </div>
          <div class="ch-body">
            <canvas id="revenueChart"></canvas>
            <p *ngIf="revData.length === 0" class="ch-empty">
              No revenue data yet
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .adm-dash {
        animation: fadeIn 0.3s ease;
      }

      /* ── Header ── */
      .adm-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .adm-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #1e272e;
        margin: 0 0 4px;
      }
      .adm-sub {
        color: #636e72;
        font-size: 0.92rem;
        margin: 0;
      }
      .adm-actions {
        display: flex;
        gap: 0.6rem;
      }
      .btn-rpt {
        display: inline-flex;
        align-items: center;
        gap: 6px;
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
      .btn-rpt:hover:not(:disabled) {
        border-color: #0fb9b1;
        color: #0fb9b1;
        background: #f0faf9;
      }
      .btn-rpt.btn-xl:hover:not(:disabled) {
        border-color: #27ae60;
        color: #27ae60;
        background: #f0faf0;
      }
      .btn-rpt:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-ico {
        font-size: 1rem;
      }

      /* ── Loading / Error ── */
      .adm-loading {
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
      .adm-error {
        text-align: center;
        padding: 3rem 2rem;
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 14px;
        color: #e74c3c;
        margin-bottom: 2rem;
      }
      .adm-error span {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .adm-error p {
        margin: 0 0 1rem;
        font-size: 0.95rem;
      }
      .adm-error button {
        background: #e74c3c;
        color: #fff;
        border: none;
        padding: 8px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-family: inherit;
      }

      /* ── Stats Grid ── */
      .stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.25rem;
        margin-bottom: 2rem;
      }
      @media (max-width: 1100px) {
        .stats-row {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 600px) {
        .stats-row {
          grid-template-columns: 1fr;
        }
      }
      .s-card {
        background: #fff;
        padding: 1.25rem 1.5rem;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        transition: all 0.25s;
      }
      .s-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
      }
      .s-highlight {
        background: linear-gradient(135deg, #0fb9b1 0%, #0a8d87 100%);
        border-color: transparent;
      }
      .s-highlight .s-label {
        color: rgba(255, 255, 255, 0.85) !important;
      }
      .s-highlight .s-val {
        color: #fff !important;
      }
      .s-icon {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      .bg-blue {
        background: #e8f4fd;
      }
      .bg-purple {
        background: #f0e6ff;
      }
      .bg-orange {
        background: #fff3e0;
      }
      .bg-teal {
        background: rgba(255, 255, 255, 0.2);
      }
      .s-body {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .s-label {
        font-size: 0.82rem;
        color: #636e72;
        font-weight: 500;
        margin-bottom: 2px;
      }
      .s-val {
        font-size: 1.45rem;
        font-weight: 700;
        color: #1e272e;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ── Charts ── */
      .charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      @media (max-width: 900px) {
        .charts-row {
          grid-template-columns: 1fr;
        }
        .adm-head {
          flex-direction: column;
        }
      }
      .ch-card {
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        border: 1px solid #f0f2f5;
        overflow: hidden;
      }
      .ch-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #f0f2f5;
      }
      .ch-head h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e272e;
      }
      .ch-badge {
        font-size: 0.75rem;
        background: #f0f9f8;
        color: #0fb9b1;
        padding: 3px 10px;
        border-radius: 20px;
        font-weight: 600;
      }
      .ch-body {
        padding: 1.25rem 1.5rem 1.5rem;
        min-height: 260px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ch-body canvas {
        max-height: 280px;
        width: 100% !important;
      }
      .ch-empty {
        color: #b2bec3;
        font-size: 0.92rem;
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
export class AdminDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  stats: DashboardStats | null = null;
  pkgData: ChartData[] = [];
  revData: ChartData[] = [];
  loading = true;
  error = '';
  exporting = false;

  private destChart: Chart | null = null;
  private revenueChart: Chart | null = null;
  private viewReady = false;
  private pendingPkg: ChartData[] | null = null;
  private pendingRev: ChartData[] | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.viewReady = true;
    // If data arrived before view was ready, render now
    if (this.pendingPkg) {
      this.initDestChart(this.pendingPkg);
      this.pendingPkg = null;
    }
    if (this.pendingRev) {
      this.initRevenueChart(this.pendingRev);
      this.pendingRev = null;
    }
  }

  ngOnDestroy() {
    this.destChart?.destroy();
    this.revenueChart?.destroy();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard stats. Is the server running?';
        this.loading = false;
      },
    });

    this.api.getBookingsByPackage().subscribe({
      next: (data: ChartData[]) => {
        this.pkgData = data;
        if (this.viewReady) {
          // Use timeout to let Angular render the canvas first
          setTimeout(() => this.initDestChart(data), 50);
        } else {
          this.pendingPkg = data;
        }
      },
      error: () => {},
    });

    this.api.getRevenueByMonth().subscribe({
      next: (data: ChartData[]) => {
        this.revData = data;
        if (this.viewReady) {
          setTimeout(() => this.initRevenueChart(data), 50);
        } else {
          this.pendingRev = data;
        }
      },
      error: () => {},
    });
  }

  reload() {
    this.destChart?.destroy();
    this.revenueChart?.destroy();
    this.destChart = null;
    this.revenueChart = null;
    this.loadData();
  }

  exportPdf() {
    this.exporting = true;
    this.api.exportBookingsPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ManelTravel_Report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: () => (this.exporting = false),
    });
  }

  exportExcel() {
    this.exporting = true;
    this.api.exportBookingsExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ManelTravel_Report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: () => (this.exporting = false),
    });
  }

  private initDestChart(data: ChartData[]) {
    if (!data.length) return;
    const el = document.getElementById('destChart') as HTMLCanvasElement;
    if (!el) return;

    this.destChart?.destroy();
    this.destChart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: [
              '#0fb9b1',
              '#a55eea',
              '#fdcb6e',
              '#e17055',
              '#0984e3',
              '#00b894',
              '#6c5ce7',
            ],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { size: 12, family: 'Poppins' },
            },
          },
        },
        cutout: '60%',
      },
    });
  }

  private initRevenueChart(data: ChartData[]) {
    if (!data.length) return;
    const el = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!el) return;

    this.revenueChart?.destroy();
    this.revenueChart = new Chart(el, {
      type: 'line',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Revenue (LKR)',
            data: data.map((d) => d.value),
            borderColor: '#0fb9b1',
            backgroundColor: 'rgba(15,185,177,0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0fb9b1',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Poppins' }, color: '#636e72' },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f0f2f5' },
            ticks: {
              font: { size: 11, family: 'Poppins' },
              color: '#636e72',
              callback: (v: any) => 'LKR ' + Number(v).toLocaleString(),
            },
          },
        },
      },
    });
  }
}
