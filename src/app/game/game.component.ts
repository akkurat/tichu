

import { Component, Inject, Pipe, PipeTransform, WritableSignal, computed, inject, signal } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { Dialog, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamelogComponent, Move } from './gamelog/gamelog.component';
import { SnackService } from '../services/snack.service';
import { HttpClient } from '@angular/common/http';
import { Table, TabledisplayComponent } from './tabledisplay/tabledisplay.component';

@Pipe({
  name: 'pluck',
  standalone: true,
})
export class PluckPipe implements PipeTransform{

  transform(value: any[], property="key") {
    return value.map( v => v[property])
  }

}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [JsonPipe, KeyValuePipe, CardComponent,
    CdkDrag, CdkDropList, CdkDropListGroup, DialogModule,
    ReactiveFormsModule, GamelogComponent, TabledisplayComponent,
   PluckPipe],
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

  snackService = inject(SnackService);
  http = inject(HttpClient);
  // todo
  lastTrick = signal<any>(null);
  dialog = inject(Dialog)

  resend() {
    this.http.get(`/api/games/${this.gameId}/resend`)
      .subscribe(v => console.log(v));
  }


  points: any;
  playCards() {
    console.log(this.fg.value);
    const cards = Object.entries(this.fg.value)
      .filter(([_, v]) => v)
      .map(([k]) => k);

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
            this.gameService.send(this.gameId, { type: 'Move', mappedCards });
          }
        }
      })

    } else {
      this.gameService.send(this.gameId, { type: 'Move', cards });
    }
  }
  private readonly fb = inject(FormBuilder);

  fg = this.fb.nonNullable.group({});

  sendSchupfedCards() {
    const msg = this.schupf.reduce((a, c) => { a[c.key] = c.card(); return a; }, {});
    this.gameService.send(this.gameId, { type: "Schupf", what: msg });
  }

  state: GameState | undefined;

  displaycards: string[] = [];
  schupfFini = computed(() => this.schupf.every(s => s.card()));

  schupf: { key: string; caption: string; card: WritableSignal<string | null>; }[] = [
    { key: "li", caption: "Left", card: signal(null) },
    { key: "partner", caption: "Partner", card: signal(null) },
    { key: "re", caption: "Right", card: signal(null) },
  ];
  schupfed: { caption: string; card: string; }[] = [];

  handleDrop(e: CdkDragDrop<any, any, any>) {
    if (Array.isArray(e.previousContainer.data)) {
      if (Array.isArray(e.container.data)) {
        if (e.previousContainer === e.container) { // sort hand cards
          moveItemInArray(e.container.data, e.previousIndex, e.currentIndex);
        }
      } else { // handcards to slot -> schupf
        this._handleSchupf(e.previousContainer.data, e.container.data, e.previousIndex);
      }
    } else { // from is slot
      if (Array.isArray(e.container.data)) { // to is handcard
        this._handleDrop(e.previousContainer.data, e.container.data, e.currentIndex);
      } else { // to is also slot => switch them out
        this._handleSwitch(e.previousContainer.data, e.container.data);
      }
    }
  }

  _handleSwitch(from: { card: WritableSignal<string | null>; }, to: { card: WritableSignal<string | null>; }) {
    const tmpTo = to.card();
    to.card.set(from.card());
    from.card.set(tmpTo);
  }

  _handleSchupf(from: string[], to: { card: WritableSignal<string | null>; }, fromIdx: number) {
    const removed = from.splice(fromIdx, 1)[0];
    const beforecard = to.card();
    if (beforecard) {
      from.push(beforecard);
    }
    to.card.set(removed);
  }

  _handleDrop(from: { card: WritableSignal<string | null>; }, to: string[], newIdx: number) {
    const fromCard = from.card();
    if (fromCard) {
      to.splice(newIdx, 0, fromCard);
      from.card.set(null);
    }
  }

  gameId = '';
  cards: any[] = [];
  sendAckBigTichu() {
    this.gameService.send(this.gameId, { type: "Ack", what: "BigTichu" });
  }
  sendAckTichuBeforeSchupf() {
    this.gameService.send(this.gameId, { type: "Ack", what: "TichuBeforeSchupf" });
  }
  sendAckTichuAfterSchupf() {
    this.gameService.send(this.gameId, { type: "Ack", what: "TichuAfterSchupf" });
  }
  sendSchupfedAck() {
    this.gameService.send(this.gameId, { type: "Ack", what: "SchupfcardReceived" });
  }

  gameService = inject(GameService);
  route = inject(ActivatedRoute);

  /// puh.. .table object in gui as well?
  table: Table = { moves: new Array<Move>(), currentPlayer: "" };
  constructor() {

    this.fg.valueChanges.subscribe(console.log);


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

        // todo: methdo here down
        // distribute to different components

        if (obj.type === "Points") {
          this.points = obj.message;
        } else if (obj.type === "Rejected") {
          this.snackService.push(JSON.stringify(obj.message));
        } else {


          const last = obj?.message?.last;
          last && this.lastTrick.set(last);

          this.cards = obj?.message?.cards || this.cards;
          this.state = obj?.message?.stage || this.state;

          // switchMap(obj.)
          if (this.state === GameState.SCHUPFED) {
            this.schupfed = [
              { caption: "Left", card: obj.message['li'].code },
              { caption: "Partner", card: obj.message['partner'].code },
              { caption: "Right", card: obj.message['re'].code },
            ];
          }

          if (this.state === GameState.YOURTURN || this.state === GameState.GAME) {
            this.table = obj.message?.table || this.table;
            this.cards = obj.message?.handcards || this.cards;
          }

          if (this.state === GameState.GIFT_DRAGON) {
            this.openDrgDialog()
          }

          this.displaycards = this.cards
            .sort((a, b) => a.sort - b.sort)
            .map(c => c.code);


          this.fg = this.fb.group(this.displaycards.reduce((a, c) => { a[c] = new FormControl(); return a; }, {}));
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


export enum GameState {
  EIGHT_CARDS = "EIGHT_CARDS",
  PRE_SCHUPF = "PRE_SCHUPF",
  POST_SCHUPF = "POST_SCHUPF",
  GIFT_DRAGON = "GIFT_DRAGON",
  SCHUPF = "SCHUPF",
  SCHUPFED = "SCHUPFED",
  GAME = "GAME",
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

