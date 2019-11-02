import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { UserLoginDto } from '../shared/dto/userLoginDto.model';
import { RegisterDto } from '../shared/dto/registerDto.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLoginMode = true;
  isLoading = false;
  error: string = null;


  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
    this.authService.authenticate();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  getApiUrl(): string {
    return environment.apiUrl;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLoginMode) {
      const userLogin: UserLoginDto = {
        password: form.value.password,
        username: form.value.email,
      };
      this.authService.onLogin(userLogin);
      this.router.navigate(['/info']);
    } else {
      const userRegister: RegisterDto = {
        email: form.value.email,
        password: form.value.password,
        fullName: form.value.fullName,
      };
      this.authService.onRegister(userRegister);
      this.router.navigate(['/info']);
    }

    form.reset();
  }

  authenticated() { return this.authService.authenticated; }


}
