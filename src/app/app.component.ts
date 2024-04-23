import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { SettingsStore } from './settings-store';
import { ServerSelectionService } from './server-selection.service';
import { ServerConnectionComponent } from './server-connection/server-connection.component';
import { RxStomp } from '@stomp/rx-stomp';
import { wsFactory } from './ws-connector.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ServerConnectionComponent],
  providers: [
    {
      provide: RxStomp,
      useFactory: wsFactory,
      deps: [ServerSelectionService]
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  connected = false
  title = 'ngtichu';
  private readonly store = inject(SettingsStore);

  brokerUrl = this.store.getStringSetting('brokerUrl', 'ws://localhost:8080/gs-guide-websocket"')

  urlService = inject(ServerSelectionService)


  onConnect() {
    if (this.connected) {
      this.connected = false
    } else {
      
      this.store.storeStringSetting('brokerUrl', this.brokerUrl)
      this.urlService.setUrl(this.brokerUrl)
      this.connected = true
    }
  }





}
