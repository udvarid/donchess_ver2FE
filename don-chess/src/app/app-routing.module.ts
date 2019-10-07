import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { AuthComponent } from './auth/auth.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { InfoComponent } from './info/info.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: '/info', pathMatch: 'full' },
  { path: 'info', component: InfoComponent },
  { path: 'game', component: GameComponent },
  { path: 'challenge', component: ChallengeComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'login',
    component: MainComponent,
    resolve: { url: 'externalUrlRedirectResolver' },
    data: {
      externalUrl: 'http://localhost:8080/login'
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
