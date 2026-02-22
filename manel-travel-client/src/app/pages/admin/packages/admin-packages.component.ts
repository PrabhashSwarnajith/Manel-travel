import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { TourPackage } from '../../../models/models';

@Component({
  selector: 'app-admin-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.scss'],
})
export class AdminPackagesComponent implements OnInit {
  packages: TourPackage[] = [];
  loading = false;
  showForm = false;
  isEditing = false;
  submitting = false;

  formData: Partial<TourPackage> = {
    packageName: '',
    destination: '',
    description: '',
    duration: 0,
    startDate: undefined,
    endDate: undefined,
    price: 0,
    maxParticipants: 0,
    imageUrl: '',
    itinerary: '',
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.loading = true;
    this.apiService.getPackages().subscribe({
      next: (data: TourPackage[]) => {
        this.packages = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading packages', error);
        this.loading = false;
      },
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.showForm = true;
    this.formData = {
      packageName: '',
      destination: '',
      description: '',
      duration: 0,
      startDate: undefined,
      endDate: undefined,
      price: 0,
      maxParticipants: 0,
      imageUrl: '',
      itinerary: '',
    };
  }

  openEditForm(pkg: TourPackage): void {
    this.isEditing = true;
    this.showForm = true;
    this.formData = { ...pkg };
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {
      packageName: '',
      destination: '',
      description: '',
      duration: 0,
      startDate: undefined,
      endDate: undefined,
      price: 0,
      maxParticipants: 0,
      imageUrl: '',
      itinerary: '',
    };
  }

  submitForm(): void {
    if (!this.validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    this.submitting = true;

    if (this.isEditing && this.formData.packageId) {
      this.apiService
        .updatePackage(
          this.formData.packageId as number,
          this.formData as TourPackage,
        )
        .subscribe({
          next: () => {
            alert('Package updated successfully');
            this.closeForm();
            this.loadPackages();
          },
          error: (error: any) => {
            console.error('Error updating package', error);
            alert('Failed to update package');
            this.submitting = false;
          },
        });
    } else {
      this.apiService.createPackage(this.formData as TourPackage).subscribe({
        next: () => {
          alert('Package created successfully');
          this.closeForm();
          this.loadPackages();
        },
        error: (error: any) => {
          console.error('Error creating package', error);
          alert('Failed to create package');
          this.submitting = false;
        },
      });
    }
  }

  deletePackage(packageId: number): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.apiService.deletePackage(packageId).subscribe({
        next: () => {
          alert('Package deleted successfully');
          this.loadPackages();
        },
        error: (error: any) => {
          console.error('Error deleting package', error);
          alert('Failed to delete package');
        },
      });
    }
  }

  private validateForm(): boolean {
    return !!(
      this.formData.packageName &&
      this.formData.destination &&
      this.formData.description &&
      this.formData.duration &&
      this.formData.price &&
      this.formData.maxParticipants &&
      this.formData.startDate &&
      this.formData.endDate
    );
  }
}
