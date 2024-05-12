import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

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
    }
    else {
      this.high = false
    }
  }

  ngOnInit(): void {
  }


}
