# Manel Travel

A full-stack travel booking application with Angular frontend and .NET 8 backend API.

## Project Structure

### Backend
- **Technology**: .NET 8 (C#)
- **Location**: `ManelTravel.API/`
- **Features**: 
  - RESTful API Controllers
  - Authentication & Authorization
  - Flight & Package Management
  - Booking System
  - User Management
  - Notification Service

### Frontend
- **Technology**: Angular
- **Location**: `manel-travel-client/`
- **Features**:
  - User Authentication (Login/Register)
  - Flight Search & Booking
  - Package Browsing
  - Booking Management
  - Admin Dashboard
  - Chatbot Support

## Getting Started

### Backend Setup
1. Navigate to `ManelTravel.API/`
2. Restore NuGet packages: `dotnet restore`
3. Run migrations: `dotnet ef database update`
4. Start the API: `dotnet run`

### Frontend Setup
1. Navigate to `manel-travel-client/`
2. Install dependencies: `npm install`
3. Start development server: `ng serve`
4. Open browser: `http://localhost:4200`

## API Endpoints
- Base URL: `http://localhost:5000`
- Documentation: See `ManelTravel.API/ManelTravel.API.http`

## Technologies Used

### Backend
- .NET 8
- Entity Framework Core
- SQL Server/MySQL
- Authentication (JWT)

### Frontend
- Angular 18+
- TypeScript
- SCSS
- Bootstrap/Tailwind CSS

## Project Status
🚧 In Development

## License
MIT License
