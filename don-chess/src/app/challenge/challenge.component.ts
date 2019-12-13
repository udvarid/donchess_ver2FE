import { Component } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket.service';
import { ChallengeService } from './challenge.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent {
  pre: string;

  constructor(private webSocketService: WebSocketService, private challengeService: ChallengeService) {
    this.pre = environment.apiUrl;
    const stompClient = this.webSocketService.connect();
    stompClient.connect({}, frame => {
      stompClient.subscribe(this.pre + '/topic/notificationChallenge', (notifications) => {
        this.challengeService.getUserDetail();
        this.challengeService.getChallengeDetail();
    });
    });
   }
}
