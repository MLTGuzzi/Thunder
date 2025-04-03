import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { TokenService } from '../../services/token.service';
import { lastValueFrom, BehaviorSubject, takeUntil } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormsService } from '../../services/forms.service';
import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'check-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyMaterialModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  private destroy$ = new Subject<void>(); // Signal for cleanup
  arlaQuery: CreateQueryResult<ArlaAircraftResponse, Error> | null = null;
  private headersSubject = new BehaviorSubject<HttpHeaders | null>(null); // Reactive state for headers
  private headers: HttpHeaders | undefined = undefined;    
  form = new FormGroup({});
  model: ArlaAircraftResponse = { 
    tailNumber: '', 
    make: '', 
    model: '', 
    year: '', 
    serialNumber: '', 
    ownerName: '',
    ownerAddress1: '',
    ownerAddress2: '',
    ownerCity: '',
    ownerState: '',
    ownerZip: ''
  };
  fields: FormlyFieldConfig[] = [] // Initial value for fields 

  onSubmit(model: any) {
    console.log(model);
    this.form.reset({});
  }

  constructor(public http: HttpClient, public auth: AuthService, private tokenService: TokenService, private formsService: FormsService) {

    // Initialize the form fields from the API
    this.fields = this.formsService.getCheckinForm() || [];

    // Setup the arlaQuery, which retrieves aircraft data based on the tail number
    this.arlaQuery = injectQuery<ArlaAircraftResponse>(() => ({
      queryKey: ['arla'],
      queryFn: () => this.getArlaAircraft((this.form.get('tailNumber')?.value as unknown as string).toUpperCase() || ''),
      enabled: (this.model.tailNumber ?? '').length > 3, // Reactively enable the query
    }));

    // Subscribe to the query result and update the form model when data is available
    effect(() => {
      this.model = this.arlaQuery?.data() ?? { 
        tailNumber: '', 
        make: '', 
        model: '', 
        year: '', 
        serialNumber: '', 
        ownerName: '',
        ownerAddress1: '',
        ownerAddress2: '',
        ownerCity: '',
        ownerState: '',
        ownerZip: ''
      };
      this.form.reset(this.model);
    });

  }

  ngOnInit(): void {
    // Subscribe to accessToken$ to get the token reactively
    this.tokenService.accessToken$
      .pipe(takeUntil(this.destroy$))
      .subscribe((token) => {
        if (token) {
          this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          this.headersSubject.next(this.headers); // Update the reactive state
        } else {
          console.warn('No access token available');
        }
      });

    this.formsService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event === 'searchButtonClicked') {
          if(this.model.tailNumber && this.model.tailNumber.length > 3) {
          this.onSearchClick();
          }
        }
      });
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions and resources
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchClick(): void {
    // Trigger the query to fetch data when the search button is clicked
    if (this.arlaQuery) {
      this.arlaQuery.refetch();
    }
  }

  // Function to fetch aircraft data from the ARLA API
  private getArlaAircraft(tailNumber: string): Promise<ArlaAircraftResponse> {
    const options = { headers: this.headers };
    return lastValueFrom(this.http.get<ArlaAircraftResponse>(`http://localhost:8080/api/v1/arla/aircraft/${tailNumber}`, options));
  }

}

// Define the interface for the response from the ARLA API
interface ArlaAircraftResponse {
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