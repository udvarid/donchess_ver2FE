import { Component } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket.service';
import { ChallengeService } from './challenge.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent {
  constructor(private webSocketService: WebSocketService, private challengeService: ChallengeService) {
    const stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
      stompClient.subscribe('/topic/notificationChallenge', (notifications) => {
        this.challengeService.getUserDetail();
        this.challengeService.getChallengeDetail();
    });
    });
   }
}
