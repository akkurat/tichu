import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CardComponent } from '../card/card.component';

type Card = {
  value: number;
  code: string;
};

type Move = {
  type: string;
  player: string;
  cards: Card[];
}

type Trick = { moves: Move[] };

type GameLog = {
  points: {
    tricks: Trick[],
    initialCardmap: Record<"A1" | "A2" | "B1" | "B2", Array<Card>>
    leftoverHandcards: Record<"A1" | "A2" | "B1" | "B2", Array<Card>>
  }
}

@Component({
  selector: 'app-gamelog',
  standalone: true,
  imports: [JsonPipe, KeyValuePipe, CardComponent],
  templateUrl: './gamelog.component.html',
  styleUrl: './gamelog.component.css'
})
export class GamelogComponent {

  points = input<GameLog>()
  tricks = computed(() =>
    this.points()?.points?.tricks
  )
  initialCards = computed(() => {
    const cm = this.points()?.points.initialCardmap
    if (cm) {
      return Object.entries(cm)
        .map(([key, v]) => ({ key, value: v.sort((a, b) => a.value - b.value) }))
    }
    return
  })

  leftOverCards = computed(() => {
    const cm = this.points()?.points.leftoverHandcards
    if (cm) {
      return Object.entries(cm)
        .map(([key, v]) => ({ key, value: v.sort((a, b) => a.value - b.value) }))
    }
    return
  })

  constructor() {

  }


}
