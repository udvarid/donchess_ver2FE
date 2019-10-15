import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDto } from 'src/app/shared/dto/userDto.model';
import { Subscription } from 'rxjs';
import { ChallengeService } from '../challenge.service';
import { ChallengeCreateDto } from 'src/app/shared/dto/challengeCreateDto.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private users: UserDto[];
  private subscription: Subscription;

  constructor(private challengeService: ChallengeService) { }

  ngOnInit() {
    this.subscription = this.challengeService.usersChanged
    .subscribe(
      (users: UserDto[]) => {
        this.users = users;
      }
    );

    this.challengeService.getUserDetail();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChallenge(index: number) {
    const challenge: ChallengeCreateDto = {challengedId: this.users[index].id};
    this.challengeService.challengeUser(challenge);
  }
}
