import { Injectable, inject } from '@angular/core';
import { ServerSelectionService } from './server-selection.service';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject, combineLatest, map, of, shareReplay, switchAll, switchMap, throwError } from 'rxjs';
import { IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  send(gameId: string, message: any) {
    this.wsServer.rxStomp.publish({ destination: `/app/games/${gameId}`, body: JSON.stringify(message) })
  }

  wsServer = inject(ServerSelectionService)
  http = inject(HttpClient)
  games$: Observable<any>
  joinedGames: Map<string, Observable<any>>

  constructor() {
    this.games$ = this.wsServer.rxStomp.watch('/topic/games').pipe(
      map(s => JSON.parse(s.body)),
      shareReplay(1)
    )
    this.joinedGames = new Map()
  }

  createGame(name: string) {
    return this.http.post(`/api/games/create?caption=${name}`, '', { withCredentials: true })
  }

  getGames() {
    return this.games$
  }

  joinGame(gameId: string): Observable<IMessage> {
    if (this.joinedGames.has(gameId)) {
      return this.joinedGames.get(gameId)!
    } else {
      const destination = `/user/queue/games/${gameId}`;
      // const sub = this.wsServer.rxStomp.watch(destination)
      const sub = new ReplaySubject<IMessage>()
      this.wsServer.rxStomp.connected$.subscribe(() =>
        this.wsServer.rxStomp.stompClient.subscribe(destination,
          m => {
            sub.next(m); console.log(m)
          })
      )
      this.joinedGames.set(gameId, sub)
      return sub
    }
  }

  // hm... ask server first if already joined?
  rejoin(gameId: string): Observable<IMessage> {
    if (this.joinedGames.has(gameId)) {
      return this.joinedGames.get(gameId)!
    } else {
      return throwError(() => new Error("not yet joined."))
    }
  }

}
