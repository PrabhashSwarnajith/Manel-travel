import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:5223/api/auth';
    private tokenKey = 'manel_token';
    private userSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap(res => this.setUser(res)));
    }

    register(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
            .pipe(tap(res => this.setUser(res)));
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
    }

    getToken(): string | null {
        return this.getStoredUser()?.token || null;
    }

    getRole(): string | null {
        return this.getStoredUser()?.role || null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.getRole() === 'Admin';
    }

    getCurrentUser(): AuthResponse | null {
        return this.getStoredUser();
    }

    private setUser(user: AuthResponse): void {
        localStorage.setItem(this.tokenKey, JSON.stringify(user));
        this.userSubject.next(user);
    }

    private getStoredUser(): AuthResponse | null {
        const data = localStorage.getItem(this.tokenKey);
        return data ? JSON.parse(data) : null;
    }
}
