import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, from, of, interval } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private auth: AuthService) {
    // Automatically refresh the token every 15 minutes
    interval(15 * 60 * 1000).subscribe(() => {
      this.getAccessToken().subscribe();
    });
  }

  /**
   * Retrieves the access token reactively.
   * If the token is already available, it emits the cached token.
   * Otherwise, it fetches a new token and updates the subject.
   */
  getAccessToken(): Observable<string | null> {
    if (this.accessTokenSubject.value) {
      // Return the cached token
      return of(this.accessTokenSubject.value);
    }

    // Fetch a new token if not cached
    return from(this.auth.isAuthenticated$).pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return from(this.auth.getAccessTokenSilently()).pipe(
            tap((token) => this.accessTokenSubject.next(token)), // Cache the token
            catchError((error) => {
              console.error('Error retrieving access token:', error);
              this.accessTokenSubject.next(null);
              return of(null); // Return null in case of an error
            })
          );
        } else {
          console.warn('User is not authenticated. Cannot retrieve access token.');
          this.accessTokenSubject.next(null);
          return of(null);
        }
      })
    );
  }

  /**
   * Clears the cached token (e.g., on logout).
   */
  clearAccessToken(): void {
    this.accessTokenSubject.next(null);
  }
}