import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './services/app.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, FormsModule]
})
export class AppComponent {
  private readonly http = inject(HttpClient)
  private readonly loginService = inject(LoginService)
  private readonly router = inject(Router)

  logout() {
    this.loginService.logout()
      .subscribe(success => this.router.navigateByUrl('/login'))
  }
}