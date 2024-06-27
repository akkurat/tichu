import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, map, of, switchMap, tap } from 'rxjs';

type Credentials = {
    username: string;
    password: string;
};

@Injectable({ providedIn: 'root' })
export class LoginService {

    authenticated$ = new ReplaySubject<boolean>(1)

    constructor(private http: HttpClient) {
        this.authenticated$.subscribe(auth => console.log('state of auth', auth))
        this.http.get('/api/user').pipe(
            map(v => v['name'] ? true : false),
            catchError(err => { console.log(err); return of(false) })
        )
            .subscribe(v => this.authenticated$.next(v))
    }

    logout() {
        return this.http.post('/api/logout', '', { observe: 'response' }).pipe(
            map(response => response.status === 200 ? true : false),
            catchError(err => {
                console.log(err);
                return of(false)
            }),
            tap(loggedOut => this.authenticated$.next(!loggedOut)),
        )
    }

    isAuthenticated(): Observable<boolean> {
        return this.authenticated$.asObservable()
    }

    authenticate(credentials: Credentials) {
        // let set csrf into cookie first
        return this.http.get('/api/login', { responseType: 'text' }).pipe(
            switchMap( v => {
            const formData = new URLSearchParams()
            for (const [k, v] of Object.entries(credentials)) {
                formData.append(k, v)
            }
            const options = {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            };
            return this.http.post('/api/login', formData, options) 
        }),
        tap( response => {
                const isLoggedIn = loggedIn(response);
                this.authenticated$.next(isLoggedIn)
            })
        )
    }
}

const loggedIn = response => {
    if (response['username']) {
        return true
    } else {
        return false
    }
}