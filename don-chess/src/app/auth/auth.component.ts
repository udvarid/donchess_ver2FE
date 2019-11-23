import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { UserLoginDto } from '../shared/dto/userLoginDto.model';
import { RegisterDto } from '../shared/dto/registerDto.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {


  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService) {
    this.authService.authenticate();
  }

  ngOnInit() {
    this.subscription = this.authService.authenticatedSign.subscribe( (response: boolean) => {
      if (response === true) {
        this.toastrService.success('Succesfull login');
        this.isLoading = false;
        this.router.navigate(['/info']);
      } else {
        this.toastrService.warning('Unsuccesfull login');
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
      this.toastrService.info('Login attempt');
      const userLogin: UserLoginDto = {
        password: form.value.password,
        username: form.value.email,
      };
      this.authService.onLogin(userLogin).subscribe( () => {
        this.authService.authenticate();
      });
    } else {
      this.toastrService.info('Registration sent');
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
