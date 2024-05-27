import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ServerSelectionService } from '../services/server-selection.service';
import { Observable, map, switchAll, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackService } from '../services/snack.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './games.component.html',
})
export class GamesComponent {
  games$: Observable<any>;

  restGames: any
  test$: any;
  test2$: any;

  router = inject(Router)
  snack = inject(SnackService)
  gs = inject(GameService)

  constructor() {
    this.games$ = this.gs.games$
  }

  createGame(caption: string) {
    this.gs.createGame(caption)
    .subscribe( res => this.snack.push(JSON.stringify(res), ) )
  }

  join(id: string) {
    this.gs.joinGame(id).subscribe( g => this.router.navigate(['/game', id]) )

  }
}

