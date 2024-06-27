import { Component, WritableSignal, computed, inject, input, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { GameService } from '../../services/game.service';

export const schupfKeys = ["li", "partner", "re"]

@Component({
  selector: 'app-schupf-display',
  standalone: true,
  imports: [DragDropModule,
    CardComponent],
  templateUrl: './schupf-display.component.html'
})



export class SchupfDisplayComponent {

  state = input<string>()
  gameId = input<string>("")
  message = input<any>()
  schupfFini = computed(() => this.schupf.every(s => s.card()));
  gameService = inject(GameService)

  schupf: { key: string; caption: string; card: WritableSignal<string | null>; }[] = [
    { key: schupfKeys[0], caption: "Left", card: signal(null) },
    { key: schupfKeys[1], caption: "Partner", card: signal(null) },
    { key: schupfKeys[2], caption: "Right", card: signal(null) },
  ];
  // schupfed: { caption: string; card: string; }[] = [];
  schupfed = computed(() => [
    { caption: "Left", card: this.message().message['li'].code },
    { caption: "Partner", card: this.message().message['partner'].code },
    { caption: "Right", card: this.message().message['re'].code },
  ])

  private _handleSchupf(from: string[], to: { card: WritableSignal<string | null>; }, fromIdx: number) {
    const removed = from.splice(fromIdx, 1)[0];
    const beforecard = to.card();
    if (beforecard) {
      from.push(beforecard);
    }
    to.card.set(removed);
  }
  private _handleSwitch(from: { card: WritableSignal<string | null>; }, to: { card: WritableSignal<string | null>; }) {
    const tmpTo = to.card();
    to.card.set(from.card());
    from.card.set(tmpTo);
  }

  handleDrop(e: CdkDragDrop<any, any, any>) {
    if (Array.isArray(e.previousContainer.data)) {
      this._handleSchupf(e.previousContainer.data, e.container.data, e.previousIndex);
    } else { // from is slot
      this._handleSwitch(e.previousContainer.data, e.container.data);
    }
  }
  // maybe this should be all part of the service???
  sendSchupfedCards() {
    const msg = this.schupf.reduce((a, c) => { a[c.key] = c.card(); return a; }, {});
    this.gameService.send(this.gameId(), { type: "Schupf", what: msg });
  }
  sendSchupfedAck() {
    this.gameService.send(this.gameId(), { type: "Ack", what: "SchupfcardReceived" });
  }
  sendAckBigTichu() {
    this.gameService.send(this.gameId(), { type: "Ack", what: "BigTichu" });
  }
  sendAckTichuBeforeSchupf() {
    this.gameService.send(this.gameId(), { type: "Ack", what: "TichuBeforeSchupf" });
  }
  sendAckTichuAfterSchupf() {
    this.gameService.send(this.gameId(), { type: "Ack", what: "TichuAfterSchupf" });
  }

}
