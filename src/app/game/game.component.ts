import { Component, Input, OnInit, inject, input } from '@angular/core';
import { ServerSelectionService } from '../services/server-selection.service';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './game.component.html',
})
export class GameComponent {
  gameId = '';
  cards: any[] = [];
  sendAckBigTichu() {
    this.gameService.send(this.gameId, {type:"Ack", what: "BigTichu"} )
  }
  sendAckTichuBeforeSchupf() {
    this.gameService.send(this.gameId, {type: "Ack", what: "TichuBeforeSchupf"})
  }
  sendAckTichuAfterSchupf() {
    this.gameService.send(this.gameId, {type: "Ack", what: "TichuAfterSchupf"})
  }

  gameService = inject(GameService)
  route = inject(ActivatedRoute)

  constructor() {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.gameId = id),
      switchMap((id) => this.gameService.joinGame(id))
    )
      .subscribe(msg => {
        console.log(msg)
        if(msg.isBinaryBody) {
          // const bin = Buffer.from(msg.binaryBody).toString('utf8')
          const bin = new TextDecoder().decode(msg.binaryBody);

          const obj = JSON.parse(bin)
          this.cards = obj?.payload?.cards || this.cards

        }

      })
  }
}
