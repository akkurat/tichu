import { Input, Component, OnInit, forwardRef, signal, input, computed, Signal, effect } from '@angular/core';
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

export class CardComponent implements ControlValueAccessor {
  handleOnChange = (selected: boolean) => { };

  writeValue(obj: any): void {
    this._selected.set(obj)
  }

  registerOnChange(fn: any): void {
    this.handleOnChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled.set(isDisabled)
  }

  constructor() {
    effect(() => {
      this.handleOnChange(this.selected())
    })
  }


  cardcode = input('')
  selectable = input(true)

  mousedown = signal(false)
  _selected = signal(false)
  _disabled = signal(false)

  cardsrc = computed(() => '/assets/cards/' + this.cardcode() + '.png')
  selected = computed(() => { return this.selectable() && !this._disabled() && this._selected() })

  click(ev: MouseEvent): void {
    this._selected.update(v => !v)
  }

  mouse(ev: MouseEvent): void {
    if (ev.type === "mousedown") {
      this.mousedown.set(true)
    }
    else if (ev.type === "mouseup") {
      this.mousedown.set(false)
    }
  }

}
