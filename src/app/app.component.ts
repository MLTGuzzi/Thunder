import { Component } from '@angular/core';
import { MenuComponent } from './component/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TokenService } from './services/token.service';
import { FormsService } from './services/forms.service';
import { AircraftService } from './services/aircraft.service';
import { FormlyButtonComponent } from './component/FormlyButtonComponent/FormlyButton.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    MenuComponent, 
    RouterOutlet,
    ReactiveFormsModule,
    FormlyMaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Thunder';

  constructor(private tokenService: TokenService, private formsService: FormsService, private aircraftService: AircraftService) {
    tokenService.getAccessToken();
  }
}
