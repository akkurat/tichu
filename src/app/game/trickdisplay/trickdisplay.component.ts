import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Move } from '../gamelog/gamelog.component';

@Component({
  selector: 'app-trickdisplay',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './trickdisplay.component.html',
})
export class TrickdisplayComponent {
  moves = input<Move[]>()
}
