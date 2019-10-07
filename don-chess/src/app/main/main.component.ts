import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {

  constructor(
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
  }

  showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
