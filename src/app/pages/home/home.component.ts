import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { TokenService } from '../../services/token.service';
import { lastValueFrom } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tutorialsQuery: CreateQueryResult<Response[], Error> | null = null;
  private headers: HttpHeaders | undefined = undefined;    

  constructor(public http: HttpClient, public auth: AuthService, private tokenService: TokenService) {

    this.tutorialsQuery = injectQuery(() => ({
      queryKey: ['tutorials'],
      queryFn: () => this.getTutorials(),
      enabled: this.headers !== undefined,
    }));
  
  }

  ngOnInit(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
  }

  private getTutorials() {
    console.log(`Headers: ${this.headers?.get('Authorization')}`);
    const options = { headers: this.headers };
    return lastValueFrom(this.http.get<Response[]>('http://localhost:8080/api/v1/tutorials', options));
  }
}

interface Response {
  id: number;
  title: string;
  description: string;
  published: boolean;
}