import { Routes, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { LoginService } from './services/login.service';
import { map, tap } from 'rxjs';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';

const isLoggedIn = (route, state) => {
    return inject(LoginService).isAuthenticated()
        .pipe(
            tap(console.log),
            map(loggedIn => loggedIn ? true : createUrlTreeFromSnapshot(route, ['/login'])),
            tap(console.log)
        );
};

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'home', component: HomeComponent,
        canActivate: [isLoggedIn]
    },
    {
        path: 'game/:id', component: GameComponent,
        canActivate: [isLoggedIn]
    },
    {
        path: 'login', component: LoginComponent,
        canActivate: [(route, state) => {
            return inject(LoginService).isAuthenticated()
                .pipe(
                    tap(console.log),
                    map(loggedIn => loggedIn ? createUrlTreeFromSnapshot(route, ['/']) : true),
                    tap(console.log)
                )
        }]
    },
    { path: '**', redirectTo: 'home' }

];

