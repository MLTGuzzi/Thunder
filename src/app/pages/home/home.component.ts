import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental'
import { lastValueFrom } from 'rxjs'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  }

  query = injectQuery(() => ({
    queryKey: ['tutorials'],
    queryFn: () =>
      lastValueFrom(
        this.http.get<Response>('https://localhost:3000/api/v1/tutorials'),
      ),
  }))

}

interface Response {
  id: number;
  title: string;
  description: string;
  published: boolean;  
}
