import { Component } from '@angular/core';
import { MatCardModule, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'work-order-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.css'
})
export class WorkOrderListComponent {
  displayedColumns: string[] = ['tailNumber', 'status', 'description'];
  dataSource = [
    { tailNumber: 'A123', status: 'Open', description: 'Engine maintenance' },
    { tailNumber: 'B456', status: 'Closed', description: 'Landing gear check' },
    { tailNumber: 'C789', status: 'In Progress', description: 'Cabin inspection' }
  ];

}
