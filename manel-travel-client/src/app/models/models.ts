export interface User {
  userId: number;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  token: string;
}

export interface Customer {
  cusId: number;
  firstName: string;
  lastName: string;
  email: string;
  teleNo: string;
  nic: string;
  status: string;
}

export interface TourPackage {
  packageId: number;
  packageName: string;
  destination: string;
  description: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl: string;
  itinerary?: string;
}

export interface Booking {
  bookingId: number;
  bookingDate: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  bookingType: 'Homage' | 'Console'; // Homage = Regular, Console = Online
  customerId: number;
  customerName?: string;
  packageId: number;
  packageInfo: string;
  price: number;
  numberOfParticipants: number;
}

export interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
  customerId: number;
  packageId: number;
}

export interface Notification {
  notificationId: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalCustomers: number;
  totalBookings: number;
  totalPackages: number;
  totalRevenue: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  email: string;
  userId: number;
}

// ── Flight Models ──
export interface Flight {
  flightId: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  class: string;
  availableSeats: number;
  imageUrl: string;
}

export interface Passenger {
  firstName: string;
  surname: string;
  ageCategory: string;
  nationality: string;
  gender: string;
  dateOfBirth?: string;
  passportNumber: string;
  passportExpiry?: string;
  noExpiration: boolean;
}

export interface FlightBooking {
  flightBookingId: number;
  bookingDate: string;
  status: string;
  totalPrice: number;
  customerId: number;
  customerName: string;
  flightId: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  passengers: Passenger[];
}
