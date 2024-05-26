import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Move } from '../gamelog/gamelog.component';

export type Table = {
  currentPlayer: String
  moves: Move[]

}
@Component({
  selector: 'app-tabledisplay',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tabledisplay.component.html',
})



export class TabledisplayComponent {

  table = input<Table>()
}
