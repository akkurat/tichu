import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SnackService } from '../services/snack.service';

@Component({
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {

  error = ""
  credentials = { username: '', password: '' };
  snack = inject(SnackService)


  constructor(private app: LoginService, private http: HttpClient, private router: Router) {
  }

  login() {
    this.app.authenticate(this.credentials).subscribe({
      complete: () => {this.error = '', this.router.navigateByUrl('/')},
      error: e => this.snack.push(JSON.stringify(e))
    })
  }
}