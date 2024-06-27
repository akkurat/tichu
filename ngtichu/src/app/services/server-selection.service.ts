import { Injectable } from '@angular/core';
import * as rxStomp from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root'
})
export class ServerSelectionService {
  url = ''
  /**
   * exposing rxstomp itself since everything is there...
   */

  rxStomp = new rxStomp.RxStomp()
  sessionId: any;
  constructor() {
    this.rxStomp.configure({
      debug: m =>
        console.log("RXSTOMP", m)
    })
    this.rxStomp.connected$.subscribe(s => {
      console.log(s)
    })
  }

  connectToBroker(brokerUrl: string) {
    console.log("connecting to " + brokerUrl)
    this.rxStomp.deactivate()
    this.url = brokerUrl
    this.rxStomp.configure({ brokerURL: brokerUrl })
    this.url = brokerUrl
    this.rxStomp.activate()
    return rxStomp
  }

}
