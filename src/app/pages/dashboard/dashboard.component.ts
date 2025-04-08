import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarRow } from '@angular/material/toolbar';
import { WorkOrderListComponent } from '../../component/work-order-list/work-order-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [ 
    RouterModule, 
    MatSidenavModule, 
    MatListModule, 
    MatToolbarRow,
    WorkOrderListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
