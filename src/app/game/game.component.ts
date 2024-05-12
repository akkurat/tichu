import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [JsonPipe, CardComponent, CdkDrag, CdkDropList, CdkDropListGroup],
  templateUrl: './game.component.html',
  styles: `
  .cdk-drag-preview: {
    background: red;
    box-shadow: 60px -16px teal;
    overflow: visible;
  }
  app-card {
    overflow: visible;
  }
  app-card .div  {
    overflow: visible;
  }
  /* Animate items as they're being sorted. */
.cdk-drop-list-dragging .cdk-drag {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

/* Animate an item that has been dropped. */
.cdk-drag-animating {
  transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
}

  `
})



export class GameComponent {
  sendSchupfedCards() {
    const msg = this.schupf.reduce((a, c) => { a[c.key] = c.card(); return a }, {});
    this.gameService.send(this.gameId, { type: "Schupf", what: msg })
  }

  state: GameState = GameState.EIGHT_CARDS

  displaycards: string[] = [];
  schupfFini = computed(() => this.schupf.every(s => s.card()))

  schupf: { key: string, caption: string, card: WritableSignal<string | null> }[] = [
    { key: "li", caption: "Left", card: signal(null) },
    { key: "partner", caption: "Partner", card: signal(null) },
    { key: "re", caption: "Right", card: signal(null) },
  ]
  schupfed: { caption: string, card: string }[] = []

  handleDrop(e: CdkDragDrop<any, any, any>) {
    if (Array.isArray(e.previousContainer.data)) {
      if (Array.isArray(e.container.data)) {
        if (e.previousContainer === e.container) { // sort hand cards
          moveItemInArray(e.container.data, e.previousIndex, e.currentIndex);
        }
      } else { // handcards to slot -> schupf
        this._handleSchupf(e.previousContainer.data, e.container.data, e.previousIndex)
      }
    } else { // from is slot
      if (Array.isArray(e.container.data)) { // to is handcard
        this._handleDrop(e.previousContainer.data, e.container.data, e.currentIndex)
      } else { // to is also slot => switch them out
        this._handleSwitch(e.previousContainer.data, e.container.data)
      }
    }
  }

  _handleSwitch(from: { card: WritableSignal<string | null> }, to: { card: WritableSignal<string | null> }) {
    const tmpTo = to.card()
    to.card.set(from.card())
    from.card.set(tmpTo)
  }

  _handleSchupf(from: string[], to: { card: WritableSignal<string | null> }, fromIdx: number) {
    const removed = from.splice(fromIdx, 1)[0]
    const beforecard = to.card();
    if (beforecard) {
      from.push(beforecard)
    }
    to.card.set(removed)
  }

  _handleDrop(from: { card: WritableSignal<string | null> }, to: string[], newIdx: number) {
    const fromCard = from.card();
    if (fromCard) {
      to.splice(newIdx, 0, fromCard)
      from.card.set(null)
    }
  }

  gameId = '';
  cards: any[] = [];
  sendAckBigTichu() {
    this.gameService.send(this.gameId, { type: "Ack", what: "BigTichu" })
  }
  sendAckTichuBeforeSchupf() {
    this.gameService.send(this.gameId, { type: "Ack", what: "TichuBeforeSchupf" })
  }
  sendAckTichuAfterSchupf() {
    this.gameService.send(this.gameId, { type: "Ack", what: "TichuAfterSchupf" })
  }
  sendSchupfedAck() {
    this.gameService.send(this.gameId, { type: "Ack", what: "SchupfcardReceived" })
  }

  gameService = inject(GameService)
  route = inject(ActivatedRoute)

  constructor() {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.gameId = id),
    ).subscribe(id => {
      this.gameService.joinGame(id).subscribe(m => console.log("ID DIRECT", m))
    })

    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.gameId = id),
      switchMap((id) => this.gameService.joinGame(id))
    )
      .subscribe(msg => {
        if (msg.isBinaryBody) {
          // const bin = Buffer.from(msg.binaryBody).toString('utf8')
          const bin = new TextDecoder().decode(msg.binaryBody);

          const obj: { type: string, message: any } = JSON.parse(bin)

          // switchMap(obj.)
          if (obj.type === 'Schupf') {
            console.log("SCHUPF", obj.message)
            this.state = GameState.SCHUPFED
            this.schupfed = [
              {caption: "Left", card: obj.message['li'].code},
              {caption: "Partner", card: obj.message['partner'].code},
              {caption: "Right", card: obj.message['re'].code},
            ]
          }

          this.cards = obj?.message?.cards || this.cards
          this.state = obj?.message?.stage || this.state

          this.displaycards = this.cards
            .sort((a, b) => a.sort - b.sort)
            .map(c => c.code)


        }

      })
  }
}

enum GameState {
  EIGHT_CARDS = "EIGHT_CARDS",
  PRE_SCHUPF = "PRE_SCHUPF",
  POST_SCHUPF = "POST_SCHUPF",
  GIFT_DRAGON = "GIFT_DRAGON",
  SCHUPF = "SCHUPF",
  SCHUPFED = "SCHUPFED",

}