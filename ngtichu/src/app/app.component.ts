import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { SnackService } from './services/snack.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ServerSelectionService } from './services/server-selection.service';
import { SettingsStore } from './utils/settings-store';
import { combineLatest, filter } from 'rxjs';
import { FullHouse, PHX, Phoenix, fulldeck } from 'libTichu';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ReactiveFormsModule, AsyncPipe, JsonPipe]
})
export class AppComponent {
  private readonly loginService = inject(LoginService)
  private readonly router = inject(Router)
  private readonly store = inject(SettingsStore);

  protected readonly snack = inject(SnackService)
  protected readonly sel = inject(ServerSelectionService)


  brokerUrl = new FormControl("", { nonNullable: true })

  save() {
    this.store.storeStringSetting('brokerUrl', this.brokerUrl.value)
  }

  

  constructor() {
    combineLatest([
      this.loginService.authenticated$.pipe(filter(i)),
      this.brokerUrl.valueChanges
    ])
      .subscribe(([l, v]) => this.sel.connectToBroker(v))
    this.snack.out$.subscribe(console.log)
    this.brokerUrl.setValue(this.store.getStringSetting('brokerUrl', `ws://${location.host}/api/gs-guide-websocket`))
  }

  logout() {
    this.loginService.logout()
      .subscribe(success => this.router.navigateByUrl('/login'))
  }
}
const i = f => f