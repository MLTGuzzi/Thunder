import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { WorkOrderListComponent } from '../../component/work-order-list/work-order-list.component';
import { CheckInComponent } from "../../component/check-in/check-in.component";
import { CommonModule } from '@angular/common'; // Import CommonModule
import { BehaviorSubject } from 'rxjs';
import { Aircraft } from '../../services/aircraft.service';

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

  constructor(private cdr: ChangeDetectorRef) {}

  public onAddWorkOrder = (): void => {
    this.mode.next('check-in');
  }

  public handleCheckInSubmit = (model: Aircraft | null): void => {
    this.mode.next('list');
  }
}
