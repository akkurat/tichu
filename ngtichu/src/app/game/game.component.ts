import { Component, effect, inject, model, signal } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Dialog, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamelogComponent, Move } from './gamelog/gamelog.component';
import { SnackService } from '../services/snack.service';
import { HttpClient } from '@angular/common/http';
import { SchupfDisplayComponent } from './schupf-display/schupf-display.component';
import { IterPipe, PluckPipe } from './pipes';
import { DeckDisplayComponent } from './deck-display/deck-display.component';
import { TrickdisplayComponent } from './trickdisplay/trickdisplay.component';

type Table = { moves: Move[], currentPlayer: string }
type rlp = "re" | "li" | "partner" | "you"
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [JsonPipe, KeyValuePipe, CardComponent,
    CdkDrag, CdkDropList, CdkDropListGroup, DialogModule,
    ReactiveFormsModule, GamelogComponent,
    SchupfDisplayComponent, PluckPipe, IterPipe, DeckDisplayComponent, TrickdisplayComponent],
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

// split into prepare and game but with reusable card / log component
export class GameComponent {
  selectedCards = signal<string[]>([])


  snackService = inject(SnackService);
  http = inject(HttpClient);
  // todo
  lastTrick = signal<any>(null);
  dialog = inject(Dialog)

  schupfmessage
  cardCounts?: Record<rlp, number>
  tichus?: Record<rlp, string>
  players?: Record<rlp, string>
  private _cardCounts: any;
  private _tichus: any;

  resend() {
    this.http.get(`/api/games/${this.gameId}/resend`)
      .subscribe(v => console.log(v));
  }


  r() {
    return 2
  }
  points: any;

  pass() {
    this.gameService.send(this.gameId, { type: 'Move', cards: [] });
  }

  tichu() {

    this.gameService.send(this.gameId, { type: 'SmallTichu' });
  }
  bigTichu() {
    this.gameService.send(this.gameId, { type: 'BigTichu' });
  }
  // todo: move to gameservice
  // cards should be a parameter
  bomb() {
    const cards = this.selectedCards()
    if (cards.length == 0) {
      // guard againt frotend state bugs
      console.error("Cards cannot be empty for play. Call pass() instead")
      return
    }
    this.gameService.send(this.gameId, { type: 'Bomb', cards });
  }
  playCards() {
    const cards = this.selectedCards()
    if (cards.length == 0) {
      // guard againt frotend state bugs
      console.error("Cards cannot be empty for play. Call pass() instead")
      return
    }

    let whish: number | null = null

    if (cards.includes("mah") && !cards.includes("phx")) {
      this.dialog.open<number>(SelectWishComponent).closed
        .subscribe(wish => this.gameService.send(this.gameId, { type: 'Move', cards, wish }))

    } else if (cards.length == 1 && cards[0] == "phx") {
      const cardsPlayed = this.table.moves.filter(c => c.cards.length > 0);
      const lastHeight = cardsPlayed[cardsPlayed.length - 1]?.cards[0]?.value;
      const val = lastHeight + .5 || 1.5;
      this.gameService.send(this.gameId, { type: 'Move', cards: ["phx" + val] });
    } else if (cards.includes("phx")) {
      this.dialog.open<number>(SelectPhxComponent).closed.subscribe(result => {
        if (result) {
          const mappedCards = cards.map(a => a === "phx" ? "phx" + result : a)
          if (mappedCards.includes("mah")) {
            this.dialog.open<number>(SelectWishComponent).closed
              .subscribe(wish => this.gameService.send(this.gameId, { type: 'Move', cards: mappedCards, wish }))
          } else {
            this.gameService.send(this.gameId, { type: 'Move', cards: mappedCards });
          }
        }
      })

    } else {
      this.gameService.send(this.gameId, { type: 'Move', cards });
    }
  }
  private readonly fb = inject(FormBuilder);



  state: GameState | undefined;

  displaycards: string[] = [];

  gameId = '';
  cards: any[] = [];

  gameService = inject(GameService);
  route = inject(ActivatedRoute);

  /// puh.. .table object in gui as well?
  table: Table = { moves: new Array<Move>(), currentPlayer: "" };
  constructor() {

    effect(() => {
      console.log(this.selectedCards())
    })

    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.gameId = id),
      switchMap((id) => this.gameService.joinGame(id))
    )
      .subscribe(msg => {
        let body
        if (msg.isBinaryBody) {
          // const bin = Buffer.from(msg.binaryBody).toString('utf8')
          body = new TextDecoder().decode(msg.binaryBody);
        } else {
          body = msg.body
        }
        // todo: methods per message type
        const obj: { type: string; message: any; } = JSON.parse(body);
        console.log(obj)

        // todo: methdo here down
        // distribute to different components

        if (obj?.type?.endsWith("Points")) {
          this.points = obj.message;
        } else if (obj?.type?.endsWith("Rejected")) {
          this.snackService.push(JSON.stringify(obj.message));
        } else {
          if (obj?.type?.endsWith("WhosMove")) {
            this._cardCounts = obj?.message?.cardCounts || this._cardCounts
            this._tichus = obj?.message?.tichuMap || this._tichus

            const youAre = obj.message.youAre
            const _players = ["A1", "B1", "A2", "B2"]
            const idxOfYOu = _players.indexOf(youAre)

            this.players = {
              you: _players[idxOfYOu],
              re: _players[(idxOfYOu + 1) % 4],
              li: _players[(idxOfYOu + 3) % 4],
              partner: _players[(idxOfYOu + 2) % 4]
            }
            this.cardCounts = {
              you: this._cardCounts[this.players.you],
              re: this._cardCounts[this.players.re],
              li: this._cardCounts[this.players.li],
              partner: this._cardCounts[this.players.partner],
            }
            this.tichus = {
              you: this._tichus[this.players.you],
              re: this._tichus[this.players.re],
              li: this._tichus[this.players.li],
              partner: this._tichus[this.players.partner],
            }
          }


          const last = obj?.message?.last;
          last && this.lastTrick.set(last);

          this.cards = obj?.message?.handcards || this.cards;
          this.state = obj?.message?.stage || this.state;

          if (this.state === GameState.SCHUPFED) {
            this.schupfmessage = obj
          }

          if (this.state === GameState.YOURTURN || this.state === GameState.OTHERS_TURN) {
            this.table = obj.message?.table || this.table;
            this.cards = obj.message?.handcards || this.cards;
          }

          if (this.state === GameState.GIFT_DRAGON) {
            this.openDrgDialog()
          }

          // todo probably keep original cards
          this.displaycards = this.cards
            .sort((a, b) => a.sort - b.sort)
            .map(c => c.code);

        }



      });
  }

  openDrgDialog(): void {
    const dialogRef = this.dialog.open<string>(DragonDialog, {
      width: '250px',
    });

    dialogRef.closed.subscribe(result => {
      this.gameService.send(this.gameId, { type: "DragonGifted", to: result })
    });
  }
}


// todo -> gameservice
export enum GameState {
  EIGHT_CARDS = "EIGHT_CARDS",
  PRE_SCHUPF = "PRE_SCHUPF",
  POST_SCHUPF = "POST_SCHUPF",
  GIFT_DRAGON = "GIFT_DRAGON",
  SCHUPF = "SCHUPF",
  SCHUPFED = "SCHUPFED",
  OTHERS_TURN = "OTHERS_TURN",
  YOURTURN = "YOURTURN"

}

@Component({
  template: `
  <button class="btn" (click)="close('LI')">Left</button>
  <button class="btn" (click)="close('RE')">Right</button>
  `,
  standalone: true
})
export class DragonDialog {
  constructor(public dialogRef: DialogRef<string>) { }

  close(value: "RE" | "LI") {
    this.dialogRef.close(value)
  }
}

@Component({
  template: `<div class="bg-slate-200 p-10">
    wish
    <input [(ngModel)]="wish" type="range" min="2" max="14" />
    {{wish}}
    <button (click)="ok()">OK</button>
    <button (click)="close()">No Wish</button>
    </div>
  `,
  imports: [FormsModule],
  standalone: true
})
export class SelectWishComponent {
  constructor(public dialogRef: DialogRef<number | null>,
  ) { }
  wish = 2
  ok() {
    this.dialogRef.close(this.wish)
  }
  close() {
    this.dialogRef.close(null)
  }
}
@Component({
  template: `<div class="bg-slate-200 p-10">
    phx
    <input [(ngModel)]="wish" type="range" min="2" max="14" />
    {{wish}}
    <button (click)="close()">OK</button>
    </div>
  `,
  imports: [FormsModule],
  standalone: true
})
export class SelectPhxComponent {
  constructor(public dialogRef: DialogRef<number>,
  ) { }
  wish = 2
  close() {
    this.dialogRef.close(this.wish)
  }
}

