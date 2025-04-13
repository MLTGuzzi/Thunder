import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {
  private aircraftSubject = new BehaviorSubject<Aircraft | null>(null);
  public aircraft$ = this.aircraftSubject.asObservable();

  constructor(
    private auth: AuthService,
    private tokenService: TokenService,
    private http: HttpClient,
    @Inject('ENV') private env: any // Inject the environment variables
  ) {}

  public getByTailNumber(tailNumber: string): Observable<Aircraft | null> {
    return this.tokenService.getAccessToken().pipe(
      // Use the token to create headers and make the HTTP request
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Aircraft>(`${this.env.API_BASE_URL}/aircraft/${tailNumber}`, { headers });
      }),
      // Handle errors and emit null to the BehaviorSubject
      catchError((error) => {
        console.error('Error fetching aircraft data:', error);
        this.aircraftSubject.next(null);
        return new BehaviorSubject<Aircraft | null>(null).asObservable(); // Return an empty observable on error
      })
    );
  }

  public getArlaAircraftByTailNumber(tailNumber: string): Observable<ArlaAircraftResponse | null> {
    return this.tokenService.getAccessToken().pipe(
      // Use the token to create headers and make the HTTP request
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<ArlaAircraftResponse>(`${this.env.API_BASE_URL}/arla/aircraft/${tailNumber}`, { headers });
      }),
      // Handle errors and emit null to the BehaviorSubject
      catchError((error) => {
        console.error('Error fetching aircraft data:', error);
        this.aircraftSubject.next(null);
        return new BehaviorSubject<ArlaAircraftResponse | null>(null).asObservable(); // Return an empty observable on error
      })
    );
  }

  /**
   * Returns the requested aircraft data, first from local data, and then from ARLA if not found.
   */
  public getByTailNumberOrArla(tailNumber: string): Observable<Aircraft | null> {
    // Call getByTailNumber first.  If it returns null, call getArlaAircraftByTailNumber.
    return this.getByTailNumber(tailNumber).pipe(
      switchMap((aircraft) => {
        if (aircraft) {
          this.aircraftSubject.next(aircraft);
          return this.aircraft$;
        } else {
          return this.getArlaAircraftByTailNumber(tailNumber).pipe(
            switchMap((arlaAircraft) => {
              if (arlaAircraft) {
                // Map the ARLA response to the Aircraft interface
                const mappedAircraft: Aircraft = {
                  id: '',
                  tailNumber: arlaAircraft.tailNumber,
                  serialNumber: arlaAircraft.serialNumber,
                  make: arlaAircraft.make,
                  model: arlaAircraft.model,
                  year: arlaAircraft.year,
                  owners: [
                    {
                      id: '',
                      name: arlaAircraft.ownerName,
                      contactName: arlaAircraft.ownerName,
                      email: '',
                      phone: '',
                      addressLine1: arlaAircraft.ownerAddress1,
                      addressLine2: arlaAircraft.ownerAddress2 || '',
                      city: arlaAircraft.ownerCity,
                      state: arlaAircraft.ownerState,
                      zipCode: arlaAircraft.ownerZip
                    }
                  ],
                  workOrders: []
                };
                this.aircraftSubject.next(mappedAircraft);
                return this.aircraft$;
              } else {
                return new BehaviorSubject<Aircraft | null>(null).asObservable();
              }
            })
          );
        }
      })
    );    
  }
}

export interface Aircraft {
    id: string;
    tailNumber: string;
    serialNumber: string;
    make: string;
    model: string;
    year: string;
    owners: Owner[];
    workOrders: WorkOrder[];
}

export interface Owner {
    id: string;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface WorkOrder {
    id: string;
    workOrderNumber: string;
    description: string;
    status: string;
}

// Define the interface for the response from the ARLA API
export interface ArlaAircraftResponse {
  tailNumber: string;
  serialNumber: string;
  make: string;
  model: string;
  year: string;
  ownerName: string;
  ownerAddress1: string;
  ownerAddress2?: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
}
