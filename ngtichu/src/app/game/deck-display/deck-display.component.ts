import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output, WritableSignal, computed, effect, inject, input, model, signal } from '@angular/core';
import { schupfKeys } from '../schupf-display/schupf-display.component';
import { ControlValueAccessor, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';
import { KeyValuePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-deck-display',
  standalone: true,
  imports: [DragDropModule, CardComponent, KeyValuePipe],
  templateUrl: './deck-display.component.html'
})
export class DeckDisplayComponent {

  @Output()
  selectedCards = new EventEmitter<string[]>
  // todo: sort backing map
  cards = input<string[]>([])
  schupfKeys = schupfKeys

  selection = new SelectionModel<string>(true)

  constructor() {
    this.selection.changed.subscribe(sel => this.selectedCards.emit(this.selection.selected))
    effect(() => {
      const cards = this.cards()
      const stillAvailable = this.selection.selected.filter(c => cards.includes(c))
      this.selection.setSelection(...stillAvailable)
    })

  }





  handleDrop(e: CdkDragDrop<any, any, any>) {
    this.cards
    if (Array.isArray(e.previousContainer.data)) {
      if (e.previousContainer === e.container) { // sort hand cards
        moveItemInArray(e.container.data, e.previousIndex, e.currentIndex);
      }
    } else { // from is slot
      this._handleDrop(e.previousContainer.data, e.container.data, e.currentIndex);
    }
  }

  private _handleDrop(from: { card: WritableSignal<string | null>; }, to: string[], newIdx: number) {
    const fromCard = from.card();
    if (fromCard) {
      to.splice(newIdx, 0, fromCard);
      from.card.set(null);
    }
  }


}
