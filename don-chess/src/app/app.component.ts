import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Don-chess';
  greeting = {};
  constructor(private http: HttpClient) {
    http.get('http://localhost:8080/api/user/resource').subscribe(data => {
      this.greeting = data;
      console.log(data);
    }
    );
  }
}
