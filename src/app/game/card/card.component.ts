import { Input, Component, OnInit, forwardRef, signal, input, computed, Signal, effect, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardComponent),
      multi: true,
    }
  ],
})

export class CardComponent {
  handleOnChange = (selected: boolean) => { };

  constructor() {
    effect(() => {
      this.handleOnChange(this.selected())
    })
  }


  cardcode = input('')
  selected = model(false)
  selectable = input(true)

  mousedown = signal(false)

  cardsrc = computed(() => '/assets/cards/' + this.cardcode() + '.png')

  click(ev: MouseEvent): void {
    if (this.selectable()) {
      this.selected.update(v => !v)
    }
  }

}
