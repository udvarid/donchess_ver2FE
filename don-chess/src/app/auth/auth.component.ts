import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { UserLoginDto } from '../shared/dto/userLoginDto.model';
import { RegisterDto } from '../shared/dto/registerDto.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {


  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
    this.authService.authenticate();
  }

  ngOnInit() {
    this.subscription = this.authService.authenticatedSign.subscribe( (response: boolean) => {
      if (response === true) {
        this.isLoading = false;
        this.router.navigate(['/info']);
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    if (this.isLoginMode) {
      const userLogin: UserLoginDto = {
        password: form.value.password,
        username: form.value.email,
      };
      this.authService.onLogin(userLogin).subscribe( () => {
        this.authService.authenticate();
      });
    } else {
      const userRegister: RegisterDto = {
        email: form.value.email,
        password: form.value.password,
        fullName: form.value.fullName,
      };
      this.authService.onRegister(userRegister).subscribe( () => {
        this.isLoading = false;
        this.router.navigate(['/info']);
      });
    }

    form.reset();
  }

  authenticated() { return this.authService.authenticated; }


}
