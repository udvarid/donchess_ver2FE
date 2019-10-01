import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  wellcome = 'Login / Register';
  selectedAction: string;

  constructor() { }

  ngOnInit() {
  }

  login(): void {
    this.selectedAction = 'Login';
  }

  register(): void {
    this.selectedAction = 'Register';
  }

}
