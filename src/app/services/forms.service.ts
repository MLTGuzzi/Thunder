import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private checkinFormSubject = new BehaviorSubject<FormlyFieldConfig[] | null>(null);
  public checkinForm$ = this.checkinFormSubject.asObservable();
  private events = new BehaviorSubject<string>('no event');
  public events$ = this.events.asObservable();

  constructor(
    private auth: AuthService,
    private tokenService: TokenService,
    private http: HttpClient,
    @Inject('ENV') private env: any // Inject the environment variables
  ) {}

  /**
   * Initializes the retrieval of the check-in form fields.
   * This method is intended to be called during app initialization.
   */
  public initializeCheckinForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tokenService.getAccessToken().subscribe({
        next: (token) => {
          if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const options = { headers: headers };
            const apiUrl = `${this.env.API_BASE_URL}/forms/checkin`; // Use the .env value
            this.http.get<string>(apiUrl, options).subscribe({
              next: (response) => {
                // Parse the response to create FormlyFieldConfig objects
                const fields: FormlyFieldConfig[] = JSON.parse(response);
                console.log('Check-in form fields:', fields);
                // Update the BehaviorSubject with the new form fields
                this.checkinFormSubject.next(fields);
                resolve(); // Resolve the promise once the fields are fetched
              },
              error: (error) => {
                console.error('Error fetching check-in form fields:', error);
                reject(error); // Reject the promise if an error occurs
              }
            });
          } else {
            console.warn('No access token available');
            resolve(); // Resolve the promise even if no token is available
          }
        },
        error: (error) => {
          console.error('Error subscribing to accessToken$', error);
          reject(error); // Reject the promise if an error occurs
        }
      });
    });
  }

  /**
   * Returns the cached check-in form fields.
   */
  public getCheckinForm(): FormlyFieldConfig[] | null {
    return this.checkinFormSubject.getValue();
  }

  public publishEvent(event: string): void {
    this.events.next(event);
  }
}
