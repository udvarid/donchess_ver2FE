import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserDto } from '../shared/dto/userDto.model';
import { UserLoginDto } from '../shared/dto/userLoginDto.model';
import { RegisterDto } from '../shared/dto/registerDto.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  authenticatedChanged = new Subject<boolean>();
  authenticated = false;
  userName = new Subject<UserDto>();
  userNameDto: UserDto;
  constructor(private http: HttpClient, private router: Router) {}

  pre = '';


  authenticate() {

    const header = new HttpHeaders({});

    this.pre = environment.apiUrl;

    this.http.get(this.pre + '/api/user/user', {headers: header}).subscribe(response => {
      if (response['name']) {
          this.getUserDetail(response['name']);
          this.authenticated = true;
          this.authenticatedChanged.next(true);
      } else {
          this.authenticated = false;
          this.authenticatedChanged.next(false);
      }
    });

  }

  getUserName() {
    return this.userNameDto;
  }

  getUserDetail(email: string) {
    const header = new HttpHeaders({});
    this.http.get(this.pre + 'api/user/oneUser?email=' + email, {headers: header}).subscribe((response: UserDto) => {
      this.userName.next(response);
      this.userNameDto = response;
    });
  }

  onLogout() {
    const header = new HttpHeaders({});
    this.authenticated = false;
    this.http.post(this.pre + '/logout', {}, {headers: header}).subscribe();
    this.authenticatedChanged.next(false);
    const emptyUser: UserDto = {
      id: null,
      fullName: null,
      role: null
    };
    this.userName.next(emptyUser);
    this.userNameDto = null;
    this.router.navigate(['/auth']);
  }

  onLogin(loginData: UserLoginDto) {
    const header = new HttpHeaders({});

    return this.http
      .post<any>(this.pre + '/api/user/login',
        {
          username: loginData.username,
          password: loginData.password
        },
        {headers: header}
      ).subscribe( (info) => {
        this.authenticate();
      });
  }

  onRegister(registerData: RegisterDto) {
    const header = new HttpHeaders({});

    return this.http
      .post<any>(this.pre + '/api/user/register',
        {
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName
        },
        {headers: header}
      ).subscribe();
  }

}
