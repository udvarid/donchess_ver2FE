import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  constructor() { }

  ngOnInit() {
  }

  onLogout() {
    this.isAuthenticated = false;
  }

  onLogin() {
    this.isAuthenticated = true;
  }


}
