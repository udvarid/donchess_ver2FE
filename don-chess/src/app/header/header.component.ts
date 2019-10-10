import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userName = '';

  subscription: Subscription;
  subscription2: Subscription;


  constructor(private authService: AuthService, private router: Router, private http: HttpClient ) { }

  ngOnInit() {
    this.subscription = this.authService.authenticatedChanged.subscribe(auth => this.isAuthenticated = auth);
    this.subscription2 = this.authService.userName.subscribe(name => this.userName = name);
  }

  onLogout() {
    this.authService.onLogout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
