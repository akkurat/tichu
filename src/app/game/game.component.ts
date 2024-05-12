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
  displaycards: string[] = [];

  schupfFini = computed(() => this.schupf.every(s => s.card()))


  schupf: { caption: string, card: WritableSignal<string | null> }[] = [
    { caption: "Left", card: signal(null) },
    { caption: "Partner", card: signal(null) },
    { caption: "Right", card: signal(null) },
  ]

  left: any[] = [{ code: "p10" }]
  handleSchupf(event: CdkDragDrop<any, any, any>) {
    const from: string[] = event.previousContainer.data
    const to: { card: WritableSignal<string | null> } = event.container.data
    const fromIdx = event.previousIndex

    const removed = from.splice(fromIdx, 1)[0]
    const beforecard = to.card();
    if (beforecard) {
      from.push(beforecard)
    }

    to.card.set(removed)


  }
  handleDrop(event: CdkDragDrop<any, any, any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      const from: { card: WritableSignal<string | null> } = event.previousContainer.data
      const to: string[] = event.container.data

      const fromCard = from.card();
      if (fromCard) {
        to.splice(event.currentIndex, 0, fromCard)
        from.card.set(null)
      }

    }
    console.log(event)
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

          const obj = JSON.parse(bin)
          this.cards = obj?.payload?.cards || this.cards
          this.displaycards = this.cards.map(c => c.code)
          console.log(obj)

        }

      })
  }
}
