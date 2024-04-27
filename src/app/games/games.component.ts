import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ServerSelectionService } from '../services/server-selection.service';
import { Observable, map, switchAll, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './games.component.html',
})
export class GamesComponent {
  games$: Observable<any>;

  restGames: any

  constructor(
    protected remote: ServerSelectionService,
    protected http: HttpClient
  ) {

    this.games$ = remote.rxStomp.watch('/topic/games')
      .pipe(map(s => JSON.parse(s.body)))

      this.http.get('/api/games').subscribe( rg => this.restGames = rg)


  }

  send() {
    this.remote.rxStomp.publish({
      destination: "/app/games",
      body: JSON.stringify({you: 'haha'}),

    });
  }
  createGame(name: string) {
    this.http.post(`/api/games/create?caption=${name}`, '', { withCredentials: true }).subscribe(
      g => console.log(g)
    )

  }
  join(id: string) {
    this.http.put(`/api/games/join?gameid=${id}`, '').subscribe(
      g => console.log(g)
    )
  }
}

