import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  imports: [ RouterModule, MatSidenavModule, MatListModule, MatToolbarRow ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
