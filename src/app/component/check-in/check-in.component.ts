import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { TokenService } from '../../services/token.service';
import { lastValueFrom, BehaviorSubject } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyMaterialModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
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
  fields: FormlyFieldConfig[] = [
    {
      key: 'tailNumber',
      type: 'input',
      name: 'tailNumber',
      templateOptions: {
        label: 'Tail Number N-',
        placeholder: 'xxxxx',
        required: true
      },
      expressionProperties: {
        'templateOptions.onChange': (model: ArlaAircraftResponse) => {
          const tailNumber = model.tailNumber?.toUpperCase() ?? '';
          if (tailNumber.length > 4) {
            this.arlaQuery?.refetch(); // Trigger the query when tail number is entered
          }
        }
      }
    },
    {
      key: "make",
      type: "input",
      templateOptions: {
        label: "Manufacturer",
        placeholder: "e.g. Cessna",
        required: true
      }
    },
    {
      key: 'model',
      type: 'input',
      templateOptions: {
        label: 'Aircraft Type',
        placeholder: 'e.g. 172',
        required: true
      }
    },
    {
      key: 'year',
      type: 'input',
      templateOptions: {
        label: 'Manufacture Year',
        placeholder: 'e.g. 1990',
        required: true
      }
    },
    {
      key: 'serialNumber',
      type: 'input',
      templateOptions: {
        label: 'Serial Number',
        placeholder: 'e.g. 1234567890',
        required: true
      }
    },
    {
      key: 'ownerName',
      type: 'input',
      templateOptions: {
        label: 'Owner Name',
        placeholder: 'e.g. John Doe',
        required: true
      }
    },
    {
      key: 'ownerAddress1',
      type: 'input',
      templateOptions: {
        label: 'Owner Address 1',
        placeholder: 'e.g. 123 Main St',
        required: true
      }
    },
    {
      key: 'ownerAddress2',
      type: 'input',
      templateOptions: {
        label: 'Owner Address 2',
        placeholder: 'e.g. Apt 4B'
      }
    },
    {
      key: 'ownerCity',
      type: 'input',
      templateOptions: {
        label: 'Owner City',
        placeholder: 'e.g. Springfield',
        required: true
      }
    },
    {
      key: 'ownerState',
      type: 'input',
      templateOptions: {
        label: 'Owner State',
        placeholder: 'e.g. IL',
        required: true
      }
    },
    {
      key: 'ownerZip',
      type: 'input',
      templateOptions: {
        label: 'Owner Zip Code',
        placeholder: 'e.g. 62704',
        required: true
      }
    }
  ];

  onSubmit(model: any) {
    console.log(model);
    this.form.reset({});
  }

  constructor(public http: HttpClient, public auth: AuthService, private tokenService: TokenService) {

    // Setup the arlaQuery, which retrieves aircraft data based on the tail number
    this.arlaQuery = injectQuery<ArlaAircraftResponse>(() => ({
      queryKey: ['arla'],
      queryFn: () => this.getArlaAircraft((this.form.get('tailNumber')?.value as unknown as string).toUpperCase() || ''),
      enabled: (this.model.tailNumber ?? '').length > 4, // Reactively enable the query
    }));

    // Subscribe to the query result
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
    this.tokenService.accessToken$.subscribe((token) => {
      if (token) {
        this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.headersSubject.next(this.headers); // Update the reactive state
      } else {
        console.warn('No access token available');
      }
    });
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