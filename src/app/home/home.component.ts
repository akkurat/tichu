import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ServerSelectionService } from '../services/server-selection.service';
import { SettingsStore } from '../utils/settings-store';
import { GamesComponent } from '../games/games.component';
import { FormsModule } from '@angular/forms';
import { GlobalChatComponent } from '../global-chat/global-chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GamesComponent, GlobalChatComponent, FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private readonly http = inject(HttpClient)
  private readonly store = inject(SettingsStore);

  sel = inject(ServerSelectionService)
  _brokerUrl = ''

  set brokerUrl(value: string) {
    this._brokerUrl = value;
    this.sel.connectToBroker(this._brokerUrl)
  }
  get brokerUrl() {
    return this._brokerUrl
  }

  constructor() {
    this.brokerUrl = this.store.getStringSetting('brokerUrl', '/api/gs-guide-websocket')
  }

  save() {
    this.store.storeStringSetting('brokerUrl', this.brokerUrl)
  }

}
