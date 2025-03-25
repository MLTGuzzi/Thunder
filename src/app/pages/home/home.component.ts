import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.idTokenClaims$.subscribe((claims) => {
      if (claims) {
        const token = claims.__raw;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.get('http://localhost:8080/api/v1/tutorials', { headers }).subscribe(
          (response) => {
            this.data = response;
          },
          (error) => {
            console.error('Error fetching data', error);
          }
        );
      }
    });
  }
}
