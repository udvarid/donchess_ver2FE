import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserDto } from '../Dto/userDto.model';
import { UserLoginDto } from '../Dto/userLoginDto.model';
import { RegisterDto } from '../Dto/registerDto.model';




@Injectable({ providedIn: 'root' })
export class AuthService {

  authenticatedChanged = new Subject<boolean>();
  authenticated = false;
  userName = new Subject<string>();
  constructor(private http: HttpClient, private router: Router) {}

  authenticate() {

    const header = new HttpHeaders({});

    this.http.get('/api/user/user', {headers: header}).subscribe(response => {
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

  getUserDetail(email: string) {
    const header = new HttpHeaders({});
    this.http.get('api/user/oneUser?email=' + email, {headers: header}).subscribe((response: UserDto) => {
      this.userName.next(response.fullName);
    });
  }

  onLogout() {
    const header = new HttpHeaders({});
    this.authenticated = false;
    this.http.post('/logout', {}, {headers: header}).subscribe();
    this.authenticatedChanged.next(false);
    this.userName.next('');
    this.router.navigate(['/auth']);
  }

  onLogin(loginData: UserLoginDto) {
    const header = new HttpHeaders({});

    return this.http
      .post<any>(
        '/api/user/login',
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
      .post<any>(
        '/api/user/register',
        {
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName
        },
        {headers: header}
      ).subscribe();
  }


  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email exists already';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist.';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'This password is not correct.';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }
}
