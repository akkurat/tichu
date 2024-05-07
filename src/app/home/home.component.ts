import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ServerSelectionService } from '../services/server-selection.service';
import { SettingsStore } from '../utils/settings-store';
import { GamesComponent } from '../games/games.component';
import { FormsModule } from '@angular/forms';
import { GlobalChatComponent } from '../global-chat/global-chat.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GamesComponent, GlobalChatComponent, FormsModule, AsyncPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  private readonly http = inject(HttpClient)

}
