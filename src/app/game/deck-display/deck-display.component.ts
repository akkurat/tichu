import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, WritableSignal, computed, effect, inject, input, model, signal } from '@angular/core';
import { schupfKeys } from '../schupf-display/schupf-display.component';
import { ControlValueAccessor, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deck-display',
  standalone: true,
  imports: [DragDropModule, ReactiveFormsModule, CardComponent],
  templateUrl: './deck-display.component.html'
})
export class DeckDisplayComponent {

  // todo: sort backing map
  cards = input<string[]>([])
  schupfKeys = schupfKeys
  fb = inject(FormBuilder)

  selectedCards = model<string[]>([])

  fg = this.fb.nonNullable.group({});
  lastSub?: Subscription;




  constructor() {
    effect(() => {
      this.lastSub?.unsubscribe()
      this.fg = this.fb.group(this.cards().reduce((a, c) => { a[c] = new FormControl(); return a; }, {}))
      this.lastSub = this.fg.valueChanges.subscribe(
        val => {
          const cards = Object.entries(val)
            .filter(([_, v]) => v)
            .map(([k]) => k);
          this.selectedCards.set(cards)
        })
    })
    this.selectedCards.subscribe(s => console.log(s))
  }


  // this.fg.valueChanges.subscribe(console.log);

  // const cards = Object.entries(this.fg.value)
  //   .filter(([_, v]) => v)
  //   .map(([k]) => k);



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
