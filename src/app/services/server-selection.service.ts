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
    this.rxStomp.connected$.subscribe(s => {
      console.log(s)
    })
  }

  connectToBroker(brokerUrl: string) {
    this.rxStomp.deactivate()
    this.url = brokerUrl
    this.rxStomp.configure({ brokerURL: brokerUrl })
    this.url = brokerUrl
    this.rxStomp.activate()
    return rxStomp
  }

}
