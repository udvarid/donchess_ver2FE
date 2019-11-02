import { Injectable } from '@angular/core';
import { UserDto } from '../shared/dto/userDto.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChallengeCreateDto } from '../shared/dto/challengeCreateDto.model';
import { ChallengeDto } from '../shared/dto/challengeDto.model';
import { ChallengeActionDto } from '../shared/dto/challengeActionDto.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })

export class ChallengeService {

    private users: UserDto[] = [];
    private challenges: ChallengeDto[] = [];
    usersChanged = new Subject<UserDto[]>();
    challengeChanged = new Subject<ChallengeDto[]>();
    pre: string;

    constructor(private http: HttpClient, private router: Router) {
        this.pre = environment.apiUrl;
    }

    getUserDetail() {
        const header = new HttpHeaders({});
        this.http.get(this.pre + 'api/user/listOfFreeUsers', {headers: header}).subscribe((response: UserDto[]) => {
            this.users = response;
            this.usersChanged.next(response);
        });
    }

    getChallengeDetail() {
        const header = new HttpHeaders({});
        this.http.get(this.pre + 'api/challenge/listForTheRequester', {headers: header}).subscribe((response: ChallengeDto[]) => {
            this.challenges = response;
            this.challengeChanged.next(response);
        });
    }

    challengeUser(challengedDto: ChallengeCreateDto) {
        const header = new HttpHeaders({});
        this.http.post(this.pre + 'api/challenge/create', challengedDto, {headers: header}).subscribe( ans => {
            this.getUserDetail();
            this.getChallengeDetail();
        }
        );
    }

    handleChallenge(answer: ChallengeActionDto) {
        const header = new HttpHeaders({});
        this.http.post(this.pre + 'api/challenge/answer', answer, {headers: header}).subscribe( ans => {
            this.getUserDetail();
            this.getChallengeDetail();
        }
        );
    }

}
