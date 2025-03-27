import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private auth: AuthService) {}

  async retrieveAccessToken(): Promise<void> {
    try {
      const token = await lastValueFrom(this.auth.getAccessTokenSilently());
      this.accessTokenSubject.next(token);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      this.accessTokenSubject.next(null);
    }
  }

  getAccessToken(): string | null {
    if(!this.accessTokenSubject.value) {
      this.retrieveAccessToken();
    }
    return this.accessTokenSubject.value;
  }
}