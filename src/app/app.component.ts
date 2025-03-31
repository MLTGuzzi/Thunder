import { Component } from '@angular/core';
import { MenuComponent } from './component/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    MenuComponent, 
    RouterOutlet,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Thunder';

  constructor(private tokenService: TokenService) {
    tokenService.getAccessToken();
  }
}
