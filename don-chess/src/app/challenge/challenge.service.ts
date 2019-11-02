import { Injectable } from '@angular/core';
import { UserDto } from '../shared/dto/userDto.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChallengeCreateDto } from '../shared/dto/challengeCreateDto.model';
import { ChallengeDto } from '../shared/dto/challengeDto.model';
import { ChallengeActionDto } from '../shared/dto/challengeActionDto.model';


@Injectable({ providedIn: 'root' })

export class ChallengeService {

    private users: UserDto[] = [];
    private challenges: ChallengeDto[] = [];
    usersChanged = new Subject<UserDto[]>();
    challengeChanged = new Subject<ChallengeDto[]>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getUserDetail() {
        const header = new HttpHeaders({});
        this.http.get('api/user/listOfFreeUsers', {headers: header}).subscribe((response: UserDto[]) => {
            this.users = response;
            this.usersChanged.next(response);
        });
    }

    getChallengeDetail() {
        const header = new HttpHeaders({});
        this.http.get('api/challenge/listForTheRequester', {headers: header}).subscribe((response: ChallengeDto[]) => {
            this.challenges = response;
            this.challengeChanged.next(response);
        });
    }

    challengeUser(challengedDto: ChallengeCreateDto) {
        const header = new HttpHeaders({});
        this.http.post('api/challenge/create', challengedDto, {headers: header}).subscribe( ans => {
            this.getUserDetail();
            this.getChallengeDetail();
        }
        );
    }

    handleChallenge(answer: ChallengeActionDto) {
        const header = new HttpHeaders({});
        this.http.post('api/challenge/answer', answer, {headers: header}).subscribe( ans => {
            this.getUserDetail();
            this.getChallengeDetail();
        }
        );
    }

}
