import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChallengeDto } from 'src/app/shared/dto/challengeDto.model';
import { Subscription } from 'rxjs';
import { ChallengeService } from '../challenge.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ChallengeActionDto } from 'src/app/shared/dto/challengeActionDto.model';
import { ChallengeCreateDto } from 'src/app/shared/dto/challengeCreateDto.model';
import { ChallengeAction } from 'src/app/shared/enums/enums.model';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrls: ['./challenge-list.component.css']
})
export class ChallengeListComponent implements OnInit, OnDestroy {

  private myChallenges: ChallengeDto[] = [];
  private freeChallenges: ChallengeDto[] = [];
  private challengesOnMe: ChallengeDto[] = [];
  private loggedInUser;
  private subscription: Subscription = new Subscription();
  private subscriptionLoggedIn: Subscription = new Subscription();

  constructor(private challengeService: ChallengeService, private auth: AuthService) { }


  ngOnInit() {
    this.loggedInUser = this.auth.getUserName();
    this.getChallenges();
    this.challengeService.getChallengeDetail();
  }

  getChallenges() {
    this.subscription = this.challengeService.challengeChanged
    .subscribe(
      (challenges: ChallengeDto[]) => {
        this.myChallenges = challenges.filter(ch => ch.challengerId === this.loggedInUser.id);
        this.freeChallenges = challenges.filter(ch => ch.challengedId === null && ch.challengerId !== this.loggedInUser.id);
        this.challengesOnMe = challenges.filter(ch => ch.challengedId === this.loggedInUser.id);
      }
    );
  }

  onAcceptFreeChallenge(index: number) {
    const answer: ChallengeActionDto = {
      challengeId: this.freeChallenges[index].id,
      challengeAction: ChallengeAction.Accept};

    this.challengeService.handleChallenge(answer);
  }

  onAcceptAimedChallenge(index: number) {
    const answer: ChallengeActionDto = {
      challengeId: this.challengesOnMe[index].id,
      challengeAction: ChallengeAction.Accept};

    this.challengeService.handleChallenge(answer);
  }

  onDeclineChallenge(index: number) {
    const answer: ChallengeActionDto = {
      challengeId: this.challengesOnMe[index].id,
      challengeAction: ChallengeAction.Decline};

    this.challengeService.handleChallenge(answer);
  }

  onDeleteMyChallenge(index: number) {
    const answer: ChallengeActionDto = {
      challengeId: this.myChallenges[index].id,
      challengeAction: ChallengeAction.Delete};

    this.challengeService.handleChallenge(answer);
  }

  onCreateFreeChallenge() {
    const myFreeChallenge: ChallengeCreateDto = {
      challengedId: null
    };
    this.challengeService.challengeUser(myFreeChallenge);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionLoggedIn.unsubscribe();
  }

}
