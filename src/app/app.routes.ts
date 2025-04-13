import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WorkOrderListComponent } from './component/work-order-list/work-order-list.component';
import { CheckInComponent } from './component/check-in/check-in.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
  },
  { 
    path: '', 
    component: AboutComponent 
  }
];
