import { Routes, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { LoginService } from './services/app.service';
import { map, tap } from 'rxjs';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'home', component: HomeComponent,
        canActivate: [(route, state) => {
            return inject(LoginService).isAuthenticated()
                .pipe(
                    tap(console.log),
                    map(loggedIn => loggedIn ? true : createUrlTreeFromSnapshot(route, ['/login'])),
                    tap(console.log)
                )
        }]
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
    }
];
