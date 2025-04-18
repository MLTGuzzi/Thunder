import { Component, OnInit } from '@angular/core';
import { MatCardModule, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { WorkOrder, WorkOrderService } from '../../services/workOrder.service';

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
export class WorkOrderListComponent implements OnInit {
  displayedColumns: string[] = ['workOrderNumber', 'tailNumber', 'ownerName', 'status', 'workType', 'description'];
  dataSource: WorkOrder[] = [];
  
  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    // Fetch work orders with any status other than 'Completed'
    this.workOrderService.getWorkOrders("workOrder.status <> 'Completed'").subscribe((workOrders) => {
      this.dataSource = workOrders;
      console.log('Work Orders:', workOrders);
    });
  }

  onWorkOrderClick(workOrder: WorkOrder): void {
    // Handle work order click event
    console.log('Work Order clicked:', workOrder);
  }

  onTailNumberClick(tailNumber: string): void {
    // Handle tail number click event
    console.log('Tail Number clicked:', tailNumber);
  }
}
