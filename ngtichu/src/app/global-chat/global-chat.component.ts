import { Component } from '@angular/core';
import { ServerSelectionService } from '../services/server-selection.service';
import { buffer, bufferTime, shareReplay, timer } from 'rxjs';

@Component({
  selector: 'app-global-chat',
  standalone: true,
  imports: [],
  templateUrl: './global-chat.component.html',
})
export class GlobalChatComponent {

  messages = new Array<string>()
  constructor(protected r: ServerSelectionService) {

    r.rxStomp.watch({ destination: '/topic/reply' })
      .subscribe(e => this.messages.push(e.body.toString()))
  }

  protected chat(input: HTMLInputElement) {
    this.r.rxStomp.publish({
      destination: '/app/message',
      body: input.value,
    })
    input.disabled = true
    timer(1000).subscribe(() => {
      input.disabled = false
      input.value = ''
    })
  }

}
