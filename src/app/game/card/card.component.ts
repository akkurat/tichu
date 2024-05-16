import { Input, Component, OnInit, forwardRef } from '@angular/core';
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
  handleOnChange = (selected: boolean) => {};


  writeValue(obj: any): void {
    this.selected = obj
  }
  registerOnChange(fn: any): void {
    this.handleOnChange = fn
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  @Input()
  set cardcode(value:string) {
    this.cardsrc = '/assets/cards/' + value + '.png'
  }

  cardsrc?: string
  high = false
  selected = false
  click(ev: MouseEvent): void {
    if (ev.type == "mousedown") {
      this.high = true
    }
    else if (ev.type == "click") {
      this.selected = !this.selected
      this.handleOnChange(this.selected)
    }
    else {
      this.high = false
    }
  }



}
