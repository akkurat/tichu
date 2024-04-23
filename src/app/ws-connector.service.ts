import { RxStomp } from '@stomp/rx-stomp';
import { ServerSelectionService } from './server-selection.service';

export const wsFactory = (urlService: ServerSelectionService) => {

  const rxStomp = new RxStomp();
  rxStomp.configure({ brokerURL: urlService.url })
  // this.serverMessages$.next(`URL: ${url}`)
  rxStomp.activate()
  return rxStomp
}




