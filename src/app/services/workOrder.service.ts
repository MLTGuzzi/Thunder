import { Injectable, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private workOrderSubject = new BehaviorSubject<WorkOrder | null>(null);
  public workOrder$ = this.workOrderSubject.asObservable();

  constructor(
    private auth: AuthService,
    private tokenService: TokenService,
    private http: HttpClient,
    @Inject('ENV') private env: any // Inject the environment variables
  ) {}

  public getWorkOrders(filter?: string, top?: number, skip?: number): Observable<WorkOrder[]> {
    return this.tokenService.getAccessToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        // Dynamically construct query parameters
        const params: { [key: string]: string } = {};
        if (filter) params['filter'] = filter;
        if (top !== undefined) params['top'] = top.toString();
        if (skip !== undefined) params['skip'] = skip.toString();
  
        // Make the HTTP GET request with the constructed query parameters
        return this.http.get<WorkOrder[]>(`${this.env.API_BASE_URL}/workorders`, { headers, params });
      }),
      catchError((error) => {
        console.error('Error fetching work orders:', error);
        return new BehaviorSubject<WorkOrder[]>([]).asObservable(); // Return an empty observable on error
      })
    );
  } 
  public getByWorkOrderNumber(workOrderNumber: string): Observable<WorkOrder | null> {
    return this.tokenService.getAccessToken().pipe(
      // Use the token to create headers and make the HTTP request
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<WorkOrder>(`${this.env.API_BASE_URL}/workorders/${workOrderNumber}`, { headers });
      }),
      // Handle errors and emit null to the BehaviorSubject
      catchError((error) => {
        console.error('Error fetching aircraft data:', error);
        this.workOrderSubject.next(null);
        return new BehaviorSubject<WorkOrder | null>(null).asObservable(); // Return an empty observable on error
      })
    );
  }

  public updateWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    return this.tokenService.getAccessToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<WorkOrder>(`${this.env.API_BASE_URL}/workorders/${workOrder.id}`, workOrder, { headers });
      }),
      tap((updatedWorkOrder) => {
        this.workOrderSubject.next(updatedWorkOrder);
      }),
      catchError((error) => {
        console.error('Error updating work order:', error);
        return new BehaviorSubject<WorkOrder>(workOrder).asObservable(); // Return the original work order on error
      })
    );
  }

  public createWorkOrder(workOrder: WorkOrder): Observable<WorkOrder> {
    return this.tokenService.getAccessToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<WorkOrder>(`${this.env.API_BASE_URL}/workorders`, workOrder, { headers });
      }),
      tap((createdWorkOrder) => {
        this.workOrderSubject.next(createdWorkOrder);
      }),
      catchError((error) => {
        console.error('Error creating work order:', error);
        return new BehaviorSubject<WorkOrder>(workOrder).asObservable(); // Return the original work order on error
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
    workOrders?: WorkOrder[];
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
    workType: string;
    aircraft: Aircraft;
}

export interface ExtendedWorkOrder extends WorkOrder {
    tailNumber: string;
    ownerName: string;
}