import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TrickdisplayComponent } from '../trickdisplay/trickdisplay.component';

export type Card = {
  sort: number;
  value: number;
  code: string;
}

export type Move = {
  value: number;
  type: string;
  player: string;
  cards: Card[];
  pass: boolean
  to?: string
}

export type Trick = { moves: Move[] };

type Player = "A1" | "A2" | "B1" | "B2";

export type GameLog = {
  points: {
    tricks: Trick[],
    initialCardmap: Record<Player, Card[]>
    leftoverHandcards: Record<Player, Card[]>
    points: {A:number,B:number}
  }
}

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
        @if(player(); as player) {
        <div class="flex flex-col">
            <div><b>{{player.key}}</b></div>
            <div class="flex flex-row">
                @for( card of player.value; track card.code ) {
                <div class="w-20 -ml-12 first:ml-0">
                    <app-card [cardcode]="card.code"></app-card>
                </div>
                }
            </div>
        </div>
        }
  `,
  selector: 'app-deckdisplay',

})
export class DeckDisplay {
  player = input<PlayerDeck>()
}

export type PlayerDeck = {
  key: string;
  value: Card[];
};

@Component({
  selector: 'app-gamelog',
  standalone: true,
  imports: [JsonPipe, KeyValuePipe, CardComponent, TrickdisplayComponent, DeckDisplay],
  templateUrl: './gamelog.component.html',
})
export class GamelogComponent {

  points = input<GameLog>()
  tricks = computed(() =>
    this.points()?.points?.tricks
  )
  initialCards = computed(() => {
    const cm = this.points()?.points.initialCardmap
    if (cm) {
      return this.mapCards(cm)
    }
    return
  })

  leftOverCards = computed(() => {
    const cm = this.points()?.points.leftoverHandcards
    if (cm) {
      return this.mapCards(cm)
    }
    return
  })

  daPoints = computed(() => this.points()?.points?.points)

  constructor() {

  }

  private mapCards(cm: Record<Player, Card[]>): PlayerDeck[] {
    return Object.entries(cm)
      .map(([key, v]) => ({ key, value: v.sort((a, b) => a.sort - b.sort) }));
  }
}
