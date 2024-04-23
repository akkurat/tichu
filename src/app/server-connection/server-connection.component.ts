import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RxStomp } from '@stomp/rx-stomp';

@Component({
  selector: 'app-server-connection',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './server-connection.component.html',
  styleUrl: './server-connection.component.css'
})
export class ServerConnectionComponent implements OnInit {
  wsConnector = inject(RxStomp)

  ngOnInit(): void {
    this.wsConnector.watch('/topic/games').subscribe(
      m => console.log(m)
    )
    this.wsConnector.publish({ destination: '/topic/games', body: 'Connected' })

  }

}
