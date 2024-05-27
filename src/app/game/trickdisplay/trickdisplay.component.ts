import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Move } from '../gamelog/gamelog.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-trickdisplay',
  standalone: true,
  imports: [CardComponent,JsonPipe],
  templateUrl: './trickdisplay.component.html',
})
export class TrickdisplayComponent {
  moves = input<Move[]>()
}
