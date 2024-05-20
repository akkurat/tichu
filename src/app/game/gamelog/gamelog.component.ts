import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';

type Move = {
  player: string;
  cards: { code: string }[];
}

type Trick = Move[];

type GameLog = {
  points: { tricks: Trick[] }
}

@Component({
  selector: 'app-gamelog',
  standalone: true,
  imports: [JsonPipe, CardComponent],
  templateUrl: './gamelog.component.html',
  styleUrl: './gamelog.component.css'
})
export class GamelogComponent {

  points = input<GameLog>()

}
