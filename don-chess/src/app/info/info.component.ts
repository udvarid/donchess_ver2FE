import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
