import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { WorkOrderListComponent } from '../../component/work-order-list/work-order-list.component';
import { CheckInComponent } from "../../component/check-in/check-in.component";
import { CommonModule } from '@angular/common'; // Import CommonModule
import { BehaviorSubject } from 'rxjs';
import { Aircraft, AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    WorkOrderListComponent,
    CheckInComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public mode = new BehaviorSubject<string>('list');

  constructor(
    private cdr: ChangeDetectorRef,
    private aircraftService: AircraftService
  ) {}

  public onAddWorkOrder = (): void => {
    this.mode.next('check-in');
  }

  public handleCheckInSubmit = (model: Aircraft | null): void => {
    // If the model has an id that is not null and not empty, then we use the aircraft service to update
    // the aircraft and the owner, and create a work order.
    if(model && model.id) {
      // Call the aircraft service to update the aircraft and owner, and create a work order.
      this.aircraftService.updateAircraft(model).subscribe({
        next: (response) => {
          // Handle the response here
          console.log('Aircraft updated successfully:', response);
        },
        error: (error) => {
          // Handle the error here
          console.error('Error updating aircraft:', error);
        }
      });
    } else if(model) {
      // If the model has an id that is null or empty, then we create a new aircraft and owner, and create a work order.
      this.aircraftService.createAircraft(model).subscribe({
        next: (response) => {
          // Handle the response here
          console.log('Aircraft created successfully:', response);
        },
        error: (error) => {
          // Handle the error here
          console.error('Error creating aircraft:', error);
        }
      });
    }

    // If the model does not have an id, then we create a new aircraft and owner, and create a work order.

    this.mode.next('list');
  }
}
